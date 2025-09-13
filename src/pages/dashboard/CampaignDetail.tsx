import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Target, Users, Mail, Eye, AlertTriangle, CheckCircle, Calendar, BarChart3 } from "lucide-react";

const CampaignDetail = () => {
  const { user } = useAuth();
  const { id } = useParams();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Mock campaign data
  const campaign = {
    id: parseInt(id || "1"),
    name: "Q4 Security Awareness Training",
    description: "Comprehensive phishing awareness campaign for all employees",
    status: "active",
    template: "Urgent Security Update",
    startDate: "2024-01-15",
    endDate: "2024-02-15",
    stats: {
      recipients: 245,
      sent: 245,
      opened: 198,
      clicked: 73,
      reported: 15,
      completed_training: 142
    }
  };

  const timelineData = [
    { day: "Day 1", sent: 50, clicked: 15, reported: 2 },
    { day: "Day 2", sent: 75, clicked: 22, reported: 3 },
    { day: "Day 3", sent: 120, clicked: 38, reported: 7 },
    { day: "Day 4", sent: 180, clicked: 55, reported: 10 },
    { day: "Day 5", sent: 245, clicked: 73, reported: 15 }
  ];

  const userResponses = [
    { id: 1, name: "John Smith", email: "john.smith@company.com", status: "clicked", responseTime: "2 hours", department: "Marketing" },
    { id: 2, name: "Sarah Johnson", email: "sarah.j@company.com", status: "reported", responseTime: "15 minutes", department: "IT" },
    { id: 3, name: "Mike Chen", email: "mike.chen@company.com", status: "completed", responseTime: "1 hour", department: "Sales" },
    { id: 4, name: "Lisa Wang", email: "lisa.wang@company.com", status: "clicked", responseTime: "3 hours", department: "HR" },
    { id: 5, name: "Tom Brown", email: "tom.brown@company.com", status: "reported", responseTime: "30 minutes", department: "Finance" }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "clicked":
        return "bg-warning text-warning-foreground";
      case "reported":
        return "bg-success text-success-foreground";
      case "completed":
        return "bg-primary text-primary-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const clickRate = Math.round((campaign.stats.clicked / campaign.stats.sent) * 100);
  const reportRate = Math.round((campaign.stats.reported / campaign.stats.sent) * 100);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <h1 className="text-3xl font-bold text-foreground">{campaign.name}</h1>
              <Badge className="bg-success text-success-foreground">
                {campaign.status}
              </Badge>
            </div>
            <p className="text-muted-foreground">{campaign.description}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">Export Report</Button>
            <Button variant="warning">Pause Campaign</Button>
          </div>
        </div>

        {/* Campaign Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Recipients</p>
                  <p className="text-3xl font-bold">{campaign.stats.recipients}</p>
                </div>
                <Users className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Click Rate</p>
                  <p className="text-3xl font-bold text-warning">{clickRate}%</p>
                  <p className="text-xs text-muted-foreground">{campaign.stats.clicked} clicked</p>
                </div>
                <Eye className="h-8 w-8 text-warning" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Report Rate</p>
                  <p className="text-3xl font-bold text-success">{reportRate}%</p>
                  <p className="text-xs text-muted-foreground">{campaign.stats.reported} reported</p>
                </div>
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Training Completed</p>
                  <p className="text-3xl font-bold text-primary">{campaign.stats.completed_training}</p>
                  <p className="text-xs text-muted-foreground">of {campaign.stats.clicked} who clicked</p>
                </div>
                <BarChart3 className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Timeline Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Campaign Timeline</CardTitle>
              <CardDescription>Daily progress over the campaign period</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {timelineData.map((day, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm font-medium w-16">{day.day}</span>
                    <div className="flex-1 mx-4">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>Sent: {day.sent}</span>
                        <span>Clicked: {day.clicked}</span>
                        <span>Reported: {day.reported}</span>
                      </div>
                      <Progress value={(day.sent / campaign.stats.recipients) * 100} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Campaign Details */}
          <Card>
            <CardHeader>
              <CardTitle>Campaign Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-muted-foreground">Template</span>
                <span className="text-sm">{campaign.template}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-muted-foreground">Start Date</span>
                <span className="text-sm">{campaign.startDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-muted-foreground">End Date</span>
                <span className="text-sm">{campaign.endDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-muted-foreground">Duration</span>
                <span className="text-sm">31 days</span>
              </div>
              <div className="pt-4 border-t">
                <h4 className="text-sm font-medium mb-2">Risk Assessment</h4>
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-warning" />
                  <span className="text-sm">Medium Risk - {clickRate}% click rate detected</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* User Responses */}
        <Card>
          <CardHeader>
            <CardTitle>User Responses</CardTitle>
            <CardDescription>Detailed breakdown of individual user responses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">User</th>
                    <th className="text-left py-2">Department</th>
                    <th className="text-left py-2">Response</th>
                    <th className="text-left py-2">Response Time</th>
                    <th className="text-left py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {userResponses.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-secondary/30">
                      <td className="py-3">
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                        </div>
                      </td>
                      <td className="py-3 text-sm">{user.department}</td>
                      <td className="py-3">
                        <Badge className={getStatusColor(user.status)}>
                          {user.status}
                        </Badge>
                      </td>
                      <td className="py-3 text-sm">{user.responseTime}</td>
                      <td className="py-3">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CampaignDetail;