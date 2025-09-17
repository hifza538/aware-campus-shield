import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { Mail, Eye, AlertTriangle, CheckCircle, Clock, Users, BarChart3, Shield, Upload, Plus, Search, FileText, Download, Target, Calendar } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";

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

interface Campaign {
  id: string;
  name: string;
  description?: string;
  status: string;
  created_at: string;
  email_template_id: string;
  organization_id: string;
  email_templates?: { name: string; subject: string };
}

const Demo = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [showResult, setShowResult] = useState(false);
  
  // Employee management state
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResults, setUploadResults] = useState<{success: number, errors: string[]}>({success: 0, errors: []});
  
  // Campaign creation state
  const [campaignForm, setCampaignForm] = useState({
    name: "",
    description: "",
    templateId: "",
    targetGroup: "all",
    scheduleType: "immediate",
  });
  const [isCreatingCampaign, setIsCreatingCampaign] = useState(false);
  const [templates, setTemplates] = useState<any[]>([]);
  
  // Add employee form
  const [addEmployeeForm, setAddEmployeeForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    position: "",
    departmentId: "",
  });
  const [isAddingEmployee, setIsAddingEmployee] = useState(false);

  useEffect(() => {
    if (user?.organization_id) {
      fetchEmployees();
      fetchDepartments();
      fetchCampaigns();
      fetchTemplates();
    }
  }, [user]);

  const demoSteps = [
    {
      title: "Employee Setup",
      description: "Upload and manage your employees",
      component: "employees"
    },
    {
      title: "Campaign Setup",
      description: "Configure your phishing simulation campaign",
      component: "setup"
    },
    {
      title: "Email Preview",
      description: "Review the simulated phishing email",
      component: "email"
    },
    {
      title: "Results Dashboard", 
      description: "View campaign analytics and user responses",
      component: "results"
    }
  ];

  const fetchEmployees = async () => {
    if (!user?.organization_id) return;
    
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
    if (!user?.organization_id) return;
    
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

  const fetchCampaigns = async () => {
    if (!user?.organization_id) return;
    
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .select(`
          *,
          email_templates (
            name,
            subject
          )
        `)
        .eq('organization_id', user.organization_id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCampaigns(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch campaigns",
        variant: "destructive",
      });
    }
  };

  const fetchTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('email_templates')
        .select('*')
        .or(`organization_id.eq.${user?.organization_id},organization_id.is.null`);

      if (error) throw error;
      setTemplates(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch templates",
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
    if (!selectedFile || !user?.organization_id) return;

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
    if (!user?.organization_id) return;
    
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

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.organization_id || !campaignForm.templateId) return;
    
    setIsCreatingCampaign(true);

    try {
      const { error } = await supabase
        .from('campaigns')
        .insert({
          organization_id: user.organization_id,
          created_by: user.id,
          name: campaignForm.name,
          description: campaignForm.description,
          email_template_id: campaignForm.templateId,
          target_group: campaignForm.targetGroup,
          schedule_type: campaignForm.scheduleType,
          status: 'draft',
        });

      if (error) throw error;

      toast({
        title: "Campaign created",
        description: "Your phishing simulation campaign has been created",
      });

      setCampaignForm({ name: "", description: "", templateId: "", targetGroup: "all", scheduleType: "immediate" });
      await fetchCampaigns();
      setCurrentStep(2); // Move to email preview
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create campaign",
        variant: "destructive",
      });
    } finally {
      setIsCreatingCampaign(false);
    }
  };

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

  const filteredEmployees = employees.filter(emp =>
    emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.position?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sampleEmail = {
    from: "security@company-portal.com",
    subject: "Urgent: Security Update Required - Action Needed",
    preview: "Your account requires immediate security verification...",
    content: `
Dear Employee,

We have detected unusual activity on your account and require immediate verification to ensure your account security.

Please click the link below to verify your account within 24 hours:

[VERIFY ACCOUNT NOW]

Failure to verify may result in account suspension.

Best regards,
IT Security Team
    `
  };

  const simulateClick = () => {
    setShowResult(true);
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-20 bg-gradient-hero text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">
            {user ? "Phishing Simulation Platform" : "Interactive Demo"}
          </h1>
          <p className="text-xl text-white/90 mb-8">
            {user 
              ? "Train your employees with realistic phishing simulations and build security awareness"
              : "Experience how PhishAware works with this safe, educational demonstration"
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Badge className="bg-warning/20 text-warning-foreground border-warning/30">
              <Shield className="h-4 w-4 mr-2" />
              {user ? "Live Platform - Real Training" : "Safe Demo Environment - No Real Risks"}
            </Badge>
            {!user && (
              <Button 
                variant="accent" 
                onClick={() => window.location.href = '/admin-auth'}
                className="mt-4 sm:mt-0"
              >
                Sign In to Use Full Platform
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Demo Steps Navigation */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {!user && (
            <div className="text-center mb-6">
              <Alert className="max-w-md mx-auto">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  This is a demo version. <a href="/admin-auth" className="text-primary hover:underline">Sign in</a> to access the full platform.
                </AlertDescription>
              </Alert>
            </div>
          )}
          <div className="flex items-center justify-between overflow-x-auto">
            {(user ? demoSteps : demoSteps.slice(1)).map((step, index) => {
              const actualIndex = user ? index : index + 1;
              return (
                <div 
                  key={index}
                  className={`flex items-center cursor-pointer min-w-0 ${
                    actualIndex <= currentStep ? 'text-primary' : 'text-muted-foreground'
                  }`}
                  onClick={() => setCurrentStep(actualIndex)}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mr-3 ${
                    actualIndex <= currentStep 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {actualIndex + 1}
                  </div>
                  <div className="hidden sm:block">
                    <div className="font-medium">{step.title}</div>
                    <div className="text-sm text-muted-foreground">{step.description}</div>
                  </div>
                  {index < (user ? demoSteps : demoSteps.slice(1)).length - 1 && (
                    <div className={`hidden md:block w-16 h-0.5 ml-4 ${
                      actualIndex < currentStep ? 'bg-primary' : 'bg-muted'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Demo Content */}
      <section className="py-12 min-h-[600px]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Step 0: Employee Setup */}
          {currentStep === 0 && user && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">Manage Your Employees</h2>
                <p className="text-muted-foreground">Upload employee data and organize them by departments</p>
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

                  {uploadResults.success > 0 && (
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>
                        Successfully imported {uploadResults.success} employees
                      </AlertDescription>
                    </Alert>
                  )}

                  {uploadResults.errors.length > 0 && (
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        Errors: {uploadResults.errors.slice(0, 3).join(', ')}
                        {uploadResults.errors.length > 3 && '...'}
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>

              {/* Add Single Employee */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Plus className="h-5 w-5 mr-2" />
                    Add Single Employee
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddEmployee} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={addEmployeeForm.firstName}
                          onChange={(e) => setAddEmployeeForm(prev => ({ ...prev, firstName: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={addEmployeeForm.lastName}
                          onChange={(e) => setAddEmployeeForm(prev => ({ ...prev, lastName: e.target.value }))}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={addEmployeeForm.email}
                        onChange={(e) => setAddEmployeeForm(prev => ({ ...prev, email: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="position">Position</Label>
                      <Input
                        id="position"
                        value={addEmployeeForm.position}
                        onChange={(e) => setAddEmployeeForm(prev => ({ ...prev, position: e.target.value }))}
                        placeholder="Software Engineer"
                      />
                    </div>
                    <Button type="submit" disabled={isAddingEmployee}>
                      {isAddingEmployee ? "Adding..." : "Add Employee"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Employee List */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center">
                      <Users className="h-5 w-5 mr-2" />
                      Employee List ({employees.length})
                    </span>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search employees..."
                        className="pl-10 w-64"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="text-center py-8">Loading employees...</div>
                  ) : filteredEmployees.length === 0 ? (
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No employees found</h3>
                      <p className="text-muted-foreground">Upload a CSV file or add employees manually to get started.</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {filteredEmployees.slice(0, 10).map((employee) => (
                        <div key={employee.id} className="flex items-center justify-between p-3 bg-secondary/30 rounded">
                          <div>
                            <div className="font-medium">{employee.first_name} {employee.last_name}</div>
                            <div className="text-sm text-muted-foreground">{employee.email}</div>
                            {employee.position && (
                              <div className="text-xs text-muted-foreground">{employee.position}</div>
                            )}
                          </div>
                          <Badge variant={employee.opted_in ? "default" : "secondary"}>
                            {employee.opted_in ? "Opted In" : "Pending"}
                          </Badge>
                        </div>
                      ))}
                      {filteredEmployees.length > 10 && (
                        <div className="text-center text-sm text-muted-foreground pt-2">
                          Showing 10 of {filteredEmployees.length} employees
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="text-center">
                <Button 
                  onClick={() => setCurrentStep(1)}
                  disabled={employees.length === 0}
                  size="lg"
                >
                  Continue to Campaign Setup
                </Button>
              </div>
            </div>
          )}

          {/* Step 1: Campaign Setup */}
          {currentStep === 1 && user && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">Create Your Phishing Campaign</h2>
                <p className="text-muted-foreground">Configure your simulation parameters and target audience</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Target className="h-5 w-5 mr-2" />
                      Campaign Configuration
                    </CardTitle>
                    <CardDescription>
                      Set up your phishing simulation parameters
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleCreateCampaign} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="campaignName">Campaign Name</Label>
                        <Input
                          id="campaignName"
                          value={campaignForm.name}
                          onChange={(e) => setCampaignForm(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Q4 Security Awareness Training"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="campaignDescription">Description</Label>
                        <Textarea
                          id="campaignDescription"
                          value={campaignForm.description}
                          onChange={(e) => setCampaignForm(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Comprehensive phishing awareness campaign for all employees"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="template">Email Template</Label>
                        <Select
                          value={campaignForm.templateId}
                          onValueChange={(value) => setCampaignForm(prev => ({ ...prev, templateId: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select email template" />
                          </SelectTrigger>
                          <SelectContent>
                            {templates.map((template) => (
                              <SelectItem key={template.id} value={template.id}>
                                {template.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="targetGroup">Target Group</Label>
                        <Select
                          value={campaignForm.targetGroup}
                          onValueChange={(value) => setCampaignForm(prev => ({ ...prev, targetGroup: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Employees ({employees.length} users)</SelectItem>
                            {departments.map((dept) => (
                              <SelectItem key={dept.id} value={`department:${dept.id}`}>
                                {dept.name} Department
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="scheduleType">Schedule</Label>
                        <Select
                          value={campaignForm.scheduleType}
                          onValueChange={(value) => setCampaignForm(prev => ({ ...prev, scheduleType: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="immediate">Send Immediately</SelectItem>
                            <SelectItem value="scheduled">Schedule for Later</SelectItem>
                            <SelectItem value="randomized">Randomized Window</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <Button 
                        type="submit" 
                        disabled={isCreatingCampaign || !campaignForm.templateId}
                        className="w-full"
                      >
                        {isCreatingCampaign ? "Creating..." : "Create Campaign"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Campaign Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-secondary/30 rounded">
                        <span className="text-sm">Total Employees</span>
                        <Badge>{employees.length} users</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-secondary/30 rounded">
                        <span className="text-sm">Available Templates</span>
                        <Badge>{templates.length} templates</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-secondary/30 rounded">
                        <span className="text-sm">Departments</span>
                        <Badge>{departments.length} depts</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-secondary/30 rounded">
                        <span className="text-sm">Previous Campaigns</span>
                        <Badge>{campaigns.length} campaigns</Badge>
                      </div>
                    </div>

                    {campaigns.length > 0 && (
                      <div className="mt-6">
                        <h4 className="font-medium mb-3">Recent Campaigns</h4>
                        <div className="space-y-2">
                          {campaigns.slice(0, 3).map((campaign) => (
                            <div key={campaign.id} className="flex items-center justify-between p-2 bg-secondary/20 rounded text-sm">
                              <span className="truncate">{campaign.name}</span>
                              <Badge 
                                variant={
                                  campaign.status === 'active' ? 'default' : 
                                  campaign.status === 'completed' ? 'secondary' : 'outline'
                                }
                              >
                                {campaign.status}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Demo fallback for non-authenticated users */}
          {!user && currentStep === 0 && (
            <div className="text-center space-y-6">
              <Card className="max-w-2xl mx-auto">
                <CardHeader>
                  <CardTitle className="flex items-center justify-center">
                    <Users className="h-6 w-6 mr-2" />
                    Employee Management Demo
                  </CardTitle>
                  <CardDescription>
                    In the full platform, you can upload employee data via CSV files and manage departments
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-secondary/30 rounded">
                      <Upload className="h-8 w-8 text-primary mx-auto mb-2" />
                      <div className="font-medium">CSV Upload</div>
                      <div className="text-sm text-muted-foreground">Bulk import employees</div>
                    </div>
                    <div className="text-center p-4 bg-secondary/30 rounded">
                      <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                      <div className="font-medium">Department Management</div>
                      <div className="text-sm text-muted-foreground">Organize by teams</div>
                    </div>
                    <div className="text-center p-4 bg-secondary/30 rounded">
                      <Search className="h-8 w-8 text-primary mx-auto mb-2" />
                      <div className="font-medium">Employee Search</div>
                      <div className="text-sm text-muted-foreground">Find and filter staff</div>
                    </div>
                  </div>
                  <Button 
                    onClick={() => setCurrentStep(1)}
                    className="w-full"
                  >
                    Continue to Campaign Setup Demo
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 2: Email Preview */}
          {(currentStep === 2 || (!user && currentStep === 1)) && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Eye className="h-5 w-5 mr-2" />
                    Simulated Phishing Email
                  </CardTitle>
                  <CardDescription>
                    This is what recipients would see (educational simulation only)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg p-4 bg-white">
                    <div className="border-b pb-3 mb-4">
                      <div className="text-sm text-muted-foreground">From: {sampleEmail.from}</div>
                      <div className="text-sm text-muted-foreground">Subject: {sampleEmail.subject}</div>
                      <div className="text-sm text-muted-foreground">Preview: {sampleEmail.preview}</div>
                    </div>
                    <div className="whitespace-pre-line text-sm">
                      {sampleEmail.content}
                    </div>
                    <div className="mt-4 pt-4 border-t">
                      {!showResult ? (
                        <Button 
                          variant="destructive" 
                          className="w-full"
                          onClick={simulateClick}
                        >
                          [VERIFY ACCOUNT NOW] - Click to Simulate
                        </Button>
                      ) : (
                        <div className="text-center p-4 bg-warning/10 border border-warning/30 rounded">
                          <AlertTriangle className="h-8 w-8 text-warning mx-auto mb-2" />
                          <div className="font-medium text-warning-foreground">Learning Moment!</div>
                          <div className="text-sm text-warning-foreground/80 mt-1">
                            This was a simulated phishing email. Here's what to look for...
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Red Flags to Identify</CardTitle>
                  <CardDescription>
                    Learn to spot phishing indicators
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <AlertTriangle className="h-4 w-4 text-warning mr-3 mt-0.5" />
                      <div>
                        <div className="font-medium">Suspicious sender domain</div>
                        <div className="text-sm text-muted-foreground">"company-portal.com" vs legitimate domain</div>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <AlertTriangle className="h-4 w-4 text-warning mr-3 mt-0.5" />
                      <div>
                        <div className="font-medium">Urgency tactics</div>
                        <div className="text-sm text-muted-foreground">"Immediate verification" and time pressure</div>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <AlertTriangle className="h-4 w-4 text-warning mr-3 mt-0.5" />
                      <div>
                        <div className="font-medium">Generic greeting</div>
                        <div className="text-sm text-muted-foreground">"Dear Employee" instead of your name</div>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <AlertTriangle className="h-4 w-4 text-warning mr-3 mt-0.5" />
                      <div>
                        <div className="font-medium">Threatening consequences</div>
                        <div className="text-sm text-muted-foreground">"Account suspension" fear tactics</div>
                      </div>
                    </li>
                  </ul>
                  <div className="mt-6">
                    <Button 
                      onClick={() => setCurrentStep(3)}
                      className="w-full"
                    >
                      View Campaign Results
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 3: Results Dashboard */}
          {(currentStep === 3 || (!user && currentStep === 2)) && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="text-center">
                  <CardContent className="pt-6">
                    <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                    <div className="text-2xl font-bold">245</div>
                    <div className="text-sm text-muted-foreground">Total Recipients</div>
                  </CardContent>
                </Card>
                <Card className="text-center">
                  <CardContent className="pt-6">
                    <Eye className="h-8 w-8 text-warning mx-auto mb-2" />
                    <div className="text-2xl font-bold">73</div>
                    <div className="text-sm text-muted-foreground">Clicked Link (30%)</div>
                  </CardContent>
                </Card>
                <Card className="text-center">
                  <CardContent className="pt-6">
                    <CheckCircle className="h-8 w-8 text-success mx-auto mb-2" />
                    <div className="text-2xl font-bold">172</div>
                    <div className="text-sm text-muted-foreground">Identified Correctly (70%)</div>
                  </CardContent>
                </Card>
                <Card className="text-center">
                  <CardContent className="pt-6">
                    <BarChart3 className="h-8 w-8 text-accent mx-auto mb-2" />
                    <div className="text-2xl font-bold">85%</div>
                    <div className="text-sm text-muted-foreground">Improvement Rate</div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Response Timeline</CardTitle>
                    <CardDescription>How quickly users responded to the campaign</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Within 1 hour</span>
                        <div className="flex items-center">
                          <div className="w-24 h-2 bg-muted rounded mr-2">
                            <div className="w-3/4 h-2 bg-warning rounded"></div>
                          </div>
                          <span className="text-sm">45 clicks</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">1-6 hours</span>
                        <div className="flex items-center">
                          <div className="w-24 h-2 bg-muted rounded mr-2">
                            <div className="w-1/2 h-2 bg-warning rounded"></div>
                          </div>
                          <span className="text-sm">18 clicks</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">6-24 hours</span>
                        <div className="flex items-center">
                          <div className="w-24 h-2 bg-muted rounded mr-2">
                            <div className="w-1/4 h-2 bg-warning rounded"></div>
                          </div>
                          <span className="text-sm">10 clicks</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Training Recommendations</CardTitle>
                    <CardDescription>Suggested next steps for improvement</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <Clock className="h-4 w-4 text-primary mr-3 mt-0.5" />
                        <div>
                          <div className="font-medium">Focus on urgency recognition</div>
                          <div className="text-sm text-muted-foreground">30% fell for time pressure tactics</div>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <Mail className="h-4 w-4 text-primary mr-3 mt-0.5" />
                        <div>
                          <div className="font-medium">Domain verification training</div>
                          <div className="text-sm text-muted-foreground">Teach URL inspection techniques</div>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <Shield className="h-4 w-4 text-primary mr-3 mt-0.5" />
                        <div>
                          <div className="font-medium">Reporting procedures</div>
                          <div className="text-sm text-muted-foreground">Reinforce how to report suspicious emails</div>
                        </div>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Create Your Own Campaign?
          </h2>
          <p className="text-lg mb-8 text-white/90">
            This was just a taste of what PhishAware can do. Start building 
            comprehensive security awareness for your organization today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!user ? (
              <>
                <Button variant="accent" size="lg" onClick={() => window.location.href = '/admin-auth'}>
                  Start Free Trial
                </Button>
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary">
                  Contact Sales
                </Button>
              </>
            ) : (
              <Button variant="accent" size="lg" onClick={() => window.location.href = '/dashboard'}>
                Go to Dashboard
              </Button>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Demo;