import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Upload, Users, Plus, Search, FileText, Check, X, Download, UserCheck } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Employee {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  position?: string;
  opted_in: boolean;
  department_id?: string;
  departments?: { name: string };
}

interface Department {
  id: string;
  name: string;
  description?: string;
}

const EmployeeManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResults, setUploadResults] = useState<{success: number, errors: string[]}>({success: 0, errors: []});

  // Add employee form
  const [addEmployeeForm, setAddEmployeeForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    position: "",
    departmentId: "",
  });
  const [isAddingEmployee, setIsAddingEmployee] = useState(false);

  // Add department form
  const [addDepartmentForm, setAddDepartmentForm] = useState({
    name: "",
    description: "",
  });
  const [isAddingDepartment, setIsAddingDepartment] = useState(false);

  useEffect(() => {
    if (user?.organization_id) {
      fetchEmployees();
      fetchDepartments();
    }
  }, [user]);

  if (!user) {
    return <Navigate to="/admin-auth" replace />;
  }

  if (user.role !== 'admin' && user.role !== 'manager') {
    return <Navigate to="/dashboard" replace />;
  }

  const fetchEmployees = async () => {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select(`
          *,
          departments (
            name
          )
        `)
        .eq('organization_id', user.organization_id);

      if (error) throw error;
      setEmployees(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch employees",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const { data, error } = await supabase
        .from('departments')
        .select('*')
        .eq('organization_id', user.organization_id);

      if (error) throw error;
      setDepartments(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch departments",
        variant: "destructive",
      });
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
        toast({
          title: "Invalid file type",
          description: "Please upload a CSV file",
          variant: "destructive",
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  const parseCSV = (csvText: string): any[] => {
    const lines = csvText.split('\n').filter(line => line.trim());
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const employees = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      if (values.length >= 3) {
        const employee = {
          email: values[headers.indexOf('email')] || values[0],
          first_name: values[headers.indexOf('first_name') || headers.indexOf('firstname')] || values[1],
          last_name: values[headers.indexOf('last_name') || headers.indexOf('lastname')] || values[2],
          position: values[headers.indexOf('position') || headers.indexOf('title')] || "",
          department_name: values[headers.indexOf('department')] || "",
        };
        employees.push(employee);
      }
    }
    return employees;
  };

  const handleCSVUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadResults({success: 0, errors: []});

    try {
      const text = await selectedFile.text();
      const employeesData = parseCSV(text);
      
      if (employeesData.length === 0) {
        throw new Error("No valid employee data found in CSV");
      }

      const results = {success: 0, errors: []};

      for (const empData of employeesData) {
        try {
          // Find or create department if specified
          let department_id = null;
          if (empData.department_name) {
            let dept = departments.find(d => d.name.toLowerCase() === empData.department_name.toLowerCase());
            if (!dept) {
              const { data: newDept, error: deptError } = await supabase
                .from('departments')
                .insert({
                  organization_id: user.organization_id,
                  name: empData.department_name,
                })
                .select()
                .single();

              if (deptError) throw deptError;
              dept = newDept;
              setDepartments(prev => [...prev, dept]);
            }
            department_id = dept.id;
          }

          const { error } = await supabase
            .from('employees')
            .insert({
              organization_id: user.organization_id,
              email: empData.email,
              first_name: empData.first_name,
              last_name: empData.last_name,
              position: empData.position,
              department_id,
            });

          if (error) {
            if (error.code === '23505') { // Unique constraint violation
              results.errors.push(`${empData.email}: Employee already exists`);
            } else {
              results.errors.push(`${empData.email}: ${error.message}`);
            }
          } else {
            results.success++;
          }
        } catch (error: any) {
          results.errors.push(`${empData.email}: ${error.message}`);
        }
      }

      setUploadResults(results);
      
      if (results.success > 0) {
        await fetchEmployees();
        toast({
          title: "Upload completed",
          description: `Successfully imported ${results.success} employees`,
        });
      }
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setSelectedFile(null);
    }
  };

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAddingEmployee(true);

    try {
      const { error } = await supabase
        .from('employees')
        .insert({
          organization_id: user.organization_id,
          email: addEmployeeForm.email,
          first_name: addEmployeeForm.firstName,
          last_name: addEmployeeForm.lastName,
          position: addEmployeeForm.position,
          department_id: addEmployeeForm.departmentId || null,
        });

      if (error) throw error;

      toast({
        title: "Employee added",
        description: "Employee has been successfully added",
      });

      setAddEmployeeForm({ email: "", firstName: "", lastName: "", position: "", departmentId: "" });
      await fetchEmployees();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add employee",
        variant: "destructive",
      });
    } finally {
      setIsAddingEmployee(false);
    }
  };

  const handleAddDepartment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAddingDepartment(true);

    try {
      const { error } = await supabase
        .from('departments')
        .insert({
          organization_id: user.organization_id,
          name: addDepartmentForm.name,
          description: addDepartmentForm.description,
        });

      if (error) throw error;

      toast({
        title: "Department added",
        description: "Department has been successfully added",
      });

      setAddDepartmentForm({ name: "", description: "" });
      await fetchDepartments();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add department",
        variant: "destructive",
      });
    } finally {
      setIsAddingDepartment(false);
    }
  };

  const filteredEmployees = employees.filter(emp =>
    emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.position?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const downloadSampleCSV = () => {
    const csvContent = `email,first_name,last_name,position,department
john.doe@company.com,John,Doe,Software Engineer,Engineering
jane.smith@company.com,Jane,Smith,Marketing Manager,Marketing
bob.johnson@company.com,Bob,Johnson,HR Specialist,Human Resources`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_employees.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Employee Management</h1>
            <p className="text-muted-foreground">Manage your organization's employees and departments</p>
          </div>
          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Department
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Department</DialogTitle>
                  <DialogDescription>
                    Create a new department for your organization
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddDepartment} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="dept-name">Department Name</Label>
                    <Input
                      id="dept-name"
                      value={addDepartmentForm.name}
                      onChange={(e) => setAddDepartmentForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Engineering"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dept-description">Description (Optional)</Label>
                    <Input
                      id="dept-description"
                      value={addDepartmentForm.description}
                      onChange={(e) => setAddDepartmentForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Software development team"
                    />
                  </div>
                  <Button type="submit" disabled={isAddingDepartment}>
                    {isAddingDepartment ? "Adding..." : "Add Department"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Employee
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Employee</DialogTitle>
                  <DialogDescription>
                    Add a single employee to your organization
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddEmployee} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="emp-firstName">First Name</Label>
                      <Input
                        id="emp-firstName"
                        value={addEmployeeForm.firstName}
                        onChange={(e) => setAddEmployeeForm(prev => ({ ...prev, firstName: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emp-lastName">Last Name</Label>
                      <Input
                        id="emp-lastName"
                        value={addEmployeeForm.lastName}
                        onChange={(e) => setAddEmployeeForm(prev => ({ ...prev, lastName: e.target.value }))}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emp-email">Email</Label>
                    <Input
                      id="emp-email"
                      type="email"
                      value={addEmployeeForm.email}
                      onChange={(e) => setAddEmployeeForm(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emp-position">Position</Label>
                    <Input
                      id="emp-position"
                      value={addEmployeeForm.position}
                      onChange={(e) => setAddEmployeeForm(prev => ({ ...prev, position: e.target.value }))}
                      placeholder="Software Engineer"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emp-department">Department</Label>
                    <Select
                      value={addEmployeeForm.departmentId}
                      onValueChange={(value) => setAddEmployeeForm(prev => ({ ...prev, departmentId: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select department (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept.id} value={dept.id}>
                            {dept.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" disabled={isAddingEmployee}>
                    {isAddingEmployee ? "Adding..." : "Add Employee"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* CSV Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Upload className="h-5 w-5 mr-2" />
              Bulk Import Employees
            </CardTitle>
            <CardDescription>
              Upload a CSV file to import multiple employees at once
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Input
                  type="file"
                  accept=".csv"
                  onChange={handleFileSelect}
                  disabled={isUploading}
                />
              </div>
              <Button
                onClick={downloadSampleCSV}
                variant="outline"
                size="sm"
              >
                <Download className="h-4 w-4 mr-2" />
                Sample CSV
              </Button>
              <Button
                onClick={handleCSVUpload}
                disabled={!selectedFile || isUploading}
              >
                {isUploading ? "Uploading..." : "Upload CSV"}
              </Button>
            </div>
            
            <div className="text-sm text-muted-foreground">
              CSV format: email, first_name, last_name, position, department
            </div>

            {uploadResults.success > 0 || uploadResults.errors.length > 0 ? (
              <Alert>
                <AlertDescription>
                  <div className="space-y-2">
                    {uploadResults.success > 0 && (
                      <div className="flex items-center text-green-600">
                        <Check className="h-4 w-4 mr-2" />
                        Successfully imported {uploadResults.success} employees
                      </div>
                    )}
                    {uploadResults.errors.length > 0 && (
                      <div>
                        <div className="flex items-center text-red-600 mb-2">
                          <X className="h-4 w-4 mr-2" />
                          {uploadResults.errors.length} errors occurred:
                        </div>
                        <ul className="text-xs space-y-1 max-h-20 overflow-y-auto">
                          {uploadResults.errors.map((error, index) => (
                            <li key={index} className="text-red-600">• {error}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </AlertDescription>
              </Alert>
            ) : null}
          </CardContent>
        </Card>

        {/* Employee List */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Employee Directory ({employees.length})
                </CardTitle>
                <CardDescription>
                  Manage your organization's employee database
                </CardDescription>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search employees..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Loading employees...</div>
            ) : filteredEmployees.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No employees found</h3>
                <p className="text-muted-foreground">
                  {searchTerm ? "No employees match your search." : "Start by adding employees individually or uploading a CSV file."}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredEmployees.map((employee) => (
                  <div key={employee.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <UserCheck className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {employee.first_name} {employee.last_name}
                        </p>
                        <p className="text-sm text-muted-foreground">{employee.email}</p>
                        {employee.position && (
                          <p className="text-xs text-muted-foreground">{employee.position}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {employee.departments && (
                        <Badge variant="outline">{employee.departments.name}</Badge>
                      )}
                      <Badge variant={employee.opted_in ? "default" : "secondary"}>
                        {employee.opted_in ? "Opted In" : "Pending"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Departments Overview */}
        {departments.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Departments ({departments.length})</CardTitle>
              <CardDescription>
                Organization departments and their employee counts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {departments.map((dept) => {
                  const deptEmployees = employees.filter(emp => emp.department_id === dept.id);
                  return (
                    <div key={dept.id} className="p-4 border rounded-lg">
                      <h4 className="font-medium">{dept.name}</h4>
                      {dept.description && (
                        <p className="text-sm text-muted-foreground mt-1">{dept.description}</p>
                      )}
                      <div className="mt-2">
                        <Badge variant="outline">
                          {deptEmployees.length} employee{deptEmployees.length !== 1 ? 's' : ''}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default EmployeeManagement;