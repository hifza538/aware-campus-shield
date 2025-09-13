import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Target, Plus, Search, Calendar, Users, Mail, BarChart3, Eye } from "lucide-react";

const Campaigns = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const campaigns = [
    {
      id: 1,
      name: "Q4 Security Awareness Training",
      description: "Comprehensive phishing awareness campaign for all employees",
      status: "active",
      recipients: 245,
      sent: 245,
      clicked: 73,
      reported: 15,
      startDate: "2024-01-15",
      endDate: "2024-02-15",
      template: "Urgent Security Update"
    },
    {
      id: 2,
      name: "Executive Leadership Assessment",
      description: "Targeted phishing simulation for executive team",
      status: "completed",
      recipients: 25,
      sent: 25,
      clicked: 3,
      reported: 22,
      startDate: "2024-01-10",
      endDate: "2024-01-24",
      template: "Board Meeting Invitation"
    },
    {
      id: 3,
      name: "New Employee Onboarding",
      description: "Introduction to phishing awareness for new hires",
      status: "scheduled",
      recipients: 50,
      sent: 0,
      clicked: 0,
      reported: 0,
      startDate: "2024-01-20",
      endDate: "2024-02-05",
      template: "HR Policy Update"
    },
    {
      id: 4,
      name: "IT Department Advanced Testing",
      description: "Advanced phishing scenarios for IT staff",
      status: "draft",
      recipients: 35,
      sent: 0,
      clicked: 0,
      reported: 0,
      startDate: "2024-02-01",
      endDate: "2024-02-15",
      template: "System Maintenance Notice"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-success text-success-foreground";
      case "completed":
        return "bg-primary text-primary-foreground";
      case "scheduled":
        return "bg-warning text-warning-foreground";
      case "draft":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const filteredCampaigns = campaigns.filter(campaign =>
    campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    campaign.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Campaigns</h1>
            <p className="text-muted-foreground">
              Manage your phishing awareness training campaigns
            </p>
          </div>
          <Button variant="hero" className="flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Create Campaign
          </Button>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search campaigns..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                  All
                </Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                  Active
                </Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                  Completed
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Campaigns Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredCampaigns.map((campaign) => (
            <Card key={campaign.id} className="hover:shadow-accent transition-smooth">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Target className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{campaign.name}</CardTitle>
                      <CardDescription>{campaign.template}</CardDescription>
                    </div>
                  </div>
                  <Badge className={getStatusColor(campaign.status)}>
                    {campaign.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {campaign.description}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{campaign.recipients} recipients</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{campaign.sent} sent</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Eye className="h-4 w-4 text-warning" />
                    <span className="text-sm">{campaign.clicked} clicked</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="h-4 w-4 text-success" />
                    <span className="text-sm">{campaign.reported} reported</span>
                  </div>
                </div>

                {/* Timeline */}
                <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
                  <Calendar className="h-4 w-4" />
                  <span>{campaign.startDate} - {campaign.endDate}</span>
                </div>

                {/* Progress Bar (for active campaigns) */}
                {campaign.status === "active" && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>{Math.round((campaign.sent / campaign.recipients) * 100)}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${(campaign.sent / campaign.recipients) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    View Details
                  </Button>
                  {campaign.status === "draft" && (
                    <Button variant="default" size="sm" className="flex-1">
                      Launch
                    </Button>
                  )}
                  {campaign.status === "active" && (
                    <Button variant="outline" size="sm" className="flex-1">
                      Pause
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCampaigns.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No campaigns found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm ? "No campaigns match your search criteria." : "You haven't created any campaigns yet."}
              </p>
              <Button variant="hero">
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Campaign
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Campaigns;