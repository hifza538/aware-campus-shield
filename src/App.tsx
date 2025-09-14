import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import Index from "./pages/Index";
import HowItWorks from "./pages/HowItWorks";
import Features from "./pages/Features";
import Demo from "./pages/Demo";
import Pricing from "./pages/Pricing";
import Resources from "./pages/Resources";
import PhishingTest from "./pages/PhishingTest";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import AdminAuth from "./pages/auth/AdminAuth";
import Dashboard from "./pages/dashboard/Dashboard";
import Campaigns from "./pages/dashboard/Campaigns";
import CampaignDetail from "./pages/dashboard/CampaignDetail";
import Reports from "./pages/dashboard/Reports";
import Users from "./pages/dashboard/Users";
import OrganizationSetup from "./pages/dashboard/OrganizationSetup";
import EmployeeManagement from "./pages/dashboard/EmployeeManagement";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";

// Context
import { AuthProvider } from "./contexts/AuthContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/features" element={<Features />} />
            <Route path="/demo" element={<Demo />} />
            <Route path="/phishing-test" element={<PhishingTest />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/admin-auth" element={<AdminAuth />} />
            <Route path="/organization-setup" element={<OrganizationSetup />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            
            {/* Dashboard Routes */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/campaigns" element={<Campaigns />} />
            <Route path="/dashboard/campaigns/:id" element={<CampaignDetail />} />
            <Route path="/dashboard/reports" element={<Reports />} />
            <Route path="/dashboard/users" element={<Users />} />
            <Route path="/dashboard/employees" element={<EmployeeManagement />} />
            
            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
