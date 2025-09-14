import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Building2, Mail, Phone, Clock } from "lucide-react";

const timezones = [
  { value: "UTC", label: "UTC (Coordinated Universal Time)" },
  { value: "America/New_York", label: "Eastern Time (ET)" },
  { value: "America/Chicago", label: "Central Time (CT)" },
  { value: "America/Denver", label: "Mountain Time (MT)" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
  { value: "Europe/London", label: "GMT (Greenwich Mean Time)" },
  { value: "Europe/Berlin", label: "CET (Central European Time)" },
  { value: "Asia/Tokyo", label: "JST (Japan Standard Time)" },
  { value: "Australia/Sydney", label: "AEDT (Australian Eastern Daylight Time)" },
];

const OrganizationSetup = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: "",
    contactEmail: "",
    adminPhone: "",
    timezone: "UTC",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [existingOrganization, setExistingOrganization] = useState<any>(null);

  useEffect(() => {
    checkExistingOrganization();
  }, [user]);

  const checkExistingOrganization = async () => {
    if (!user?.organization_id) return;

    try {
      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .eq('id', user.organization_id)
        .single();

      if (data) {
        setExistingOrganization(data);
        setFormData({
          name: data.name || "",
          contactEmail: data.contact_email || "",
          adminPhone: data.admin_phone || "",
          timezone: data.timezone || "UTC",
        });
      }
    } catch (error) {
      console.error('Error fetching organization:', error);
    }
  };

  if (!user) {
    return <Navigate to="/admin-auth" replace />;
  }

  if (user.role !== 'admin' && user.role !== 'manager') {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      if (existingOrganization) {
        // Update existing organization
        const { error } = await supabase
          .from('organizations')
          .update({
            name: formData.name,
            contact_email: formData.contactEmail,
            admin_phone: formData.adminPhone,
            timezone: formData.timezone,
          })
          .eq('id', existingOrganization.id);

        if (error) throw error;
      } else {
        // Create new organization
        const { data: orgData, error: orgError } = await supabase
          .from('organizations')
          .insert({
            name: formData.name,
            contact_email: formData.contactEmail,
            admin_phone: formData.adminPhone,
            timezone: formData.timezone,
          })
          .select()
          .single();

        if (orgError) throw orgError;

        // Update user profile with organization_id
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ organization_id: orgData.id })
          .eq('user_id', user.id);

        if (profileError) throw profileError;
      }

      toast({
        title: existingOrganization ? "Organization updated!" : "Organization created!",
        description: existingOrganization 
          ? "Your organization settings have been updated successfully."
          : "Your organization has been set up successfully. You can now proceed to manage employees and campaigns.",
      });

      navigate("/dashboard");
    } catch (error: any) {
      setError(error.message || "An error occurred while saving organization details");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {existingOrganization ? "Update Organization" : "Organization Setup"}
          </h1>
          <p className="text-muted-foreground">
            {existingOrganization 
              ? "Update your organization's information and settings"
              : "Set up your organization to get started with PhishAware"
            }
          </p>
        </div>

        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle>Organization Details</CardTitle>
            <CardDescription>
              Configure your organization's basic information and preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Organization Name *</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Acme Corporation"
                    className="pl-10"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="contactEmail"
                    type="email"
                    placeholder="admin@acmecorp.com"
                    className="pl-10"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
                    required
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  This email will be used for important notifications and system communications
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="adminPhone">Admin Phone (Optional)</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="adminPhone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    className="pl-10"
                    value={formData.adminPhone}
                    onChange={(e) => setFormData(prev => ({ ...prev, adminPhone: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone *</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                  <Select
                    value={formData.timezone}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, timezone: value }))}
                  >
                    <SelectTrigger className="pl-10">
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      {timezones.map((tz) => (
                        <SelectItem key={tz.value} value={tz.value}>
                          {tz.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <p className="text-sm text-muted-foreground">
                  Campaign schedules and reports will use this timezone
                </p>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/dashboard")}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1" 
                  disabled={isSubmitting}
                >
                  {isSubmitting 
                    ? (existingOrganization ? "Updating..." : "Creating...") 
                    : (existingOrganization ? "Update Organization" : "Create Organization")
                  }
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            {existingOrganization 
              ? "Make changes to your organization settings as needed"
              : "Once set up, you can manage employees and create phishing campaigns"
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrganizationSetup;