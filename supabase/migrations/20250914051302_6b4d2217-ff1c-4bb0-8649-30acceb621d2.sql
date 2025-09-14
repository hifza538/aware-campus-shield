-- Create organizations table
CREATE TABLE public.organizations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  admin_phone TEXT,
  timezone TEXT DEFAULT 'UTC',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user roles enum
CREATE TYPE public.user_role AS ENUM ('admin', 'manager', 'employee');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  role public.user_role NOT NULL DEFAULT 'employee',
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create departments table
CREATE TABLE public.departments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create employees table
CREATE TABLE public.employees (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  position TEXT,
  opted_in BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(organization_id, email)
);

-- Create email templates table
CREATE TABLE public.email_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  sender_name TEXT NOT NULL,
  sender_email TEXT NOT NULL,
  difficulty_level INTEGER DEFAULT 1 CHECK (difficulty_level BETWEEN 1 AND 5),
  is_phishing BOOLEAN NOT NULL DEFAULT true,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create campaigns table
CREATE TABLE public.campaigns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  name TEXT NOT NULL,
  description TEXT,
  email_template_id UUID NOT NULL REFERENCES public.email_templates(id),
  target_group TEXT DEFAULT 'all' CHECK (target_group IN ('all', 'department', 'custom')),
  department_id UUID REFERENCES public.departments(id),
  schedule_type TEXT DEFAULT 'immediate' CHECK (schedule_type IN ('immediate', 'scheduled', 'randomized')),
  scheduled_at TIMESTAMP WITH TIME ZONE,
  randomize_window_hours INTEGER DEFAULT 24,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'active', 'completed', 'paused')),
  landing_page_variant TEXT DEFAULT 'default',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create campaign targets table (for custom employee lists)
CREATE TABLE public.campaign_targets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  UNIQUE(campaign_id, employee_id)
);

-- Create campaign results table
CREATE TABLE public.campaign_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  email_sent BOOLEAN DEFAULT false,
  email_sent_at TIMESTAMP WITH TIME ZONE,
  email_clicked BOOLEAN DEFAULT false,
  email_clicked_at TIMESTAMP WITH TIME ZONE,
  landing_page_visited BOOLEAN DEFAULT false,
  landing_page_visited_at TIMESTAMP WITH TIME ZONE,
  data_entered BOOLEAN DEFAULT false,
  data_entered_at TIMESTAMP WITH TIME ZONE,
  reported_phishing BOOLEAN DEFAULT false,
  reported_phishing_at TIMESTAMP WITH TIME ZONE,
  tracking_token TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(campaign_id, employee_id)
);

-- Enable Row Level Security
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_results ENABLE ROW LEVEL SECURITY;

-- Create security definer function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid UUID)
RETURNS public.user_role AS $$
BEGIN
  RETURN (
    SELECT role 
    FROM public.profiles 
    WHERE user_id = user_uuid
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Create security definer function to get user organization
CREATE OR REPLACE FUNCTION public.get_user_organization(user_uuid UUID)
RETURNS UUID AS $$
BEGIN
  RETURN (
    SELECT organization_id 
    FROM public.profiles 
    WHERE user_id = user_uuid
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- RLS Policies for organizations
CREATE POLICY "Users can view their own organization" ON public.organizations
  FOR SELECT USING (id = public.get_user_organization(auth.uid()));

CREATE POLICY "Admins can insert organizations" ON public.organizations
  FOR INSERT WITH CHECK (public.get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Admins can update their organization" ON public.organizations
  FOR UPDATE USING (id = public.get_user_organization(auth.uid()) AND public.get_user_role(auth.uid()) IN ('admin', 'manager'));

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Admins can view organization profiles" ON public.profiles
  FOR SELECT USING (organization_id = public.get_user_organization(auth.uid()) AND public.get_user_role(auth.uid()) IN ('admin', 'manager'));

-- RLS Policies for departments
CREATE POLICY "Organization members can view departments" ON public.departments
  FOR SELECT USING (organization_id = public.get_user_organization(auth.uid()));

CREATE POLICY "Admins can manage departments" ON public.departments
  FOR ALL USING (organization_id = public.get_user_organization(auth.uid()) AND public.get_user_role(auth.uid()) IN ('admin', 'manager'));

-- RLS Policies for employees
CREATE POLICY "Organization members can view employees" ON public.employees
  FOR SELECT USING (organization_id = public.get_user_organization(auth.uid()));

CREATE POLICY "Admins can manage employees" ON public.employees
  FOR ALL USING (organization_id = public.get_user_organization(auth.uid()) AND public.get_user_role(auth.uid()) IN ('admin', 'manager'));

-- RLS Policies for email_templates
CREATE POLICY "Organization members can view templates" ON public.email_templates
  FOR SELECT USING (organization_id = public.get_user_organization(auth.uid()) OR organization_id IS NULL);

CREATE POLICY "Admins can manage templates" ON public.email_templates
  FOR ALL USING (organization_id = public.get_user_organization(auth.uid()) AND public.get_user_role(auth.uid()) IN ('admin', 'manager'));

-- RLS Policies for campaigns
CREATE POLICY "Organization members can view campaigns" ON public.campaigns
  FOR SELECT USING (organization_id = public.get_user_organization(auth.uid()));

CREATE POLICY "Admins can manage campaigns" ON public.campaigns
  FOR ALL USING (organization_id = public.get_user_organization(auth.uid()) AND public.get_user_role(auth.uid()) IN ('admin', 'manager'));

-- RLS Policies for campaign_targets
CREATE POLICY "Organization members can view campaign targets" ON public.campaign_targets
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.campaigns c 
      WHERE c.id = campaign_id 
      AND c.organization_id = public.get_user_organization(auth.uid())
    )
  );

CREATE POLICY "Admins can manage campaign targets" ON public.campaign_targets
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.campaigns c 
      WHERE c.id = campaign_id 
      AND c.organization_id = public.get_user_organization(auth.uid())
      AND public.get_user_role(auth.uid()) IN ('admin', 'manager')
    )
  );

-- RLS Policies for campaign_results
CREATE POLICY "Organization members can view campaign results" ON public.campaign_results
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.campaigns c 
      WHERE c.id = campaign_id 
      AND c.organization_id = public.get_user_organization(auth.uid())
    )
  );

CREATE POLICY "Admins can manage campaign results" ON public.campaign_results
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.campaigns c 
      WHERE c.id = campaign_id 
      AND c.organization_id = public.get_user_organization(auth.uid())
      AND public.get_user_role(auth.uid()) IN ('admin', 'manager')
    )
  );

-- Create function to handle new user profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, first_name, last_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'employee')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at columns
CREATE TRIGGER update_organizations_updated_at
  BEFORE UPDATE ON public.organizations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_employees_updated_at
  BEFORE UPDATE ON public.employees
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_email_templates_updated_at
  BEFORE UPDATE ON public.email_templates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_campaigns_updated_at
  BEFORE UPDATE ON public.campaigns
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default email templates
INSERT INTO public.email_templates (name, subject, body, sender_name, sender_email, difficulty_level, is_phishing, is_default) VALUES
('Urgent Security Update', 'URGENT: Security breach detected - Action required immediately', 'Your account has been compromised. Click here to secure your account: http://security-update-portal.com/verify', 'IT Security Team', 'security@company-alerts.com', 2, true, true),
('Password Expiration Notice', 'Your password will expire in 24 hours', 'Hello, Your company password will expire tomorrow. Please update it by clicking the link below to avoid account lockout.', 'IT Support', 'support@yourcompany.com', 1, false, true),
('CEO Request', 'Urgent: Wire Transfer Required', 'I need you to process an urgent wire transfer for a confidential acquisition. Please transfer $50,000 to account #1234567890. Time sensitive - please handle immediately.', 'John Smith', 'j.smith.ceo@temp-email.com', 4, true, true),
('Benefits Enrollment', 'Annual Benefits Enrollment - Action Required', 'Its time for annual benefits enrollment. Please review and update your selections by logging into the HR portal.', 'HR Department', 'hr@yourcompany.com', 1, false, true),
('Invoice Payment', 'Invoice #INV-2024-001 - Payment Overdue', 'Your payment for invoice INV-2024-001 is overdue. Please remit payment immediately to avoid service interruption. Download invoice: http://billing-portal-secure.net/inv2024001', 'Billing Department', 'billing@vendor-services.org', 3, true, true);