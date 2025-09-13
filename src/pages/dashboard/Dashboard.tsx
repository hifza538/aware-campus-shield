import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { BarChart3, Users, Mail, Target, TrendingUp, AlertTriangle, CheckCircle, Clock } from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const stats = [
    {
      title: "Active Campaigns",
      value: "3",
      change: "+2 this month",
      icon: Target,
      color: "text-primary"
    },
    {
      title: "Total Users",
      value: "245",
      change: "+12 this week",
      icon: Users,
      color: "text-success"
    },
    {
      title: "Emails Sent",
      value: "1,247",
      change: "+156 today",
      icon: Mail,
      color: "text-accent"
    },
    {
      title: "Success Rate",
      value: "73%",
      change: "+5% improvement",
      icon: TrendingUp,
      color: "text-success"
    }
  ];

  const recentCampaigns = [
    {
      id: 1,
      name: "Q4 Security Training",
      status: "active",
      recipients: 245,
      clickRate: 0.3,
      startDate: "2024-01-15"
    },
    {
      id: 2,
      name: "Executive Phishing Test",
      status: "completed",
      recipients: 25,
      clickRate: 0.12,
      startDate: "2024-01-10"
    },
    {
      id: 3,
      name: "New Employee Onboarding",
      status: "scheduled",
      recipients: 50,
      clickRate: null,
      startDate: "2024-01-20"
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
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user.name}. Here's what's happening with your campaigns.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-custom transition-smooth">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                  </div>
                  <div className={`p-3 rounded-full bg-primary/10`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Campaigns */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="h-5 w-5 mr-2" />
                Recent Campaigns
              </CardTitle>
              <CardDescription>
                Overview of your latest phishing awareness campaigns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentCampaigns.map((campaign) => (
                  <div key={campaign.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-secondary/30 transition-smooth">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium">{campaign.name}</h3>
                        <Badge className={getStatusColor(campaign.status)}>
                          {campaign.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{campaign.recipients} recipients</span>
                        {campaign.clickRate !== null && (
                          <span>{Math.round(campaign.clickRate * 100)}% click rate</span>
                        )}
                        <span>{campaign.startDate}</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <Button variant="outline" className="w-full">
                  View All Campaigns
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common tasks and shortcuts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4">
                <Button variant="hero" className="h-auto p-4 justify-start">
                  <Mail className="h-5 w-5 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">Create New Campaign</div>
                    <div className="text-sm text-primary-foreground/80">Start a new phishing simulation</div>
                  </div>
                </Button>
                
                <Button variant="outline" className="h-auto p-4 justify-start">
                  <BarChart3 className="h-5 w-5 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">View Reports</div>
                    <div className="text-sm text-muted-foreground">Analyze campaign performance</div>
                  </div>
                </Button>
                
                <Button variant="outline" className="h-auto p-4 justify-start">
                  <Users className="h-5 w-5 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">Manage Users</div>
                    <div className="text-sm text-muted-foreground">Add or edit user accounts</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activity Feed */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  icon: CheckCircle,
                  message: "Campaign 'Q4 Security Training' completed successfully",
                  time: "2 hours ago",
                  color: "text-success"
                },
                {
                  icon: AlertTriangle,
                  message: "High click rate detected in 'Executive Phishing Test'",
                  time: "4 hours ago",
                  color: "text-warning"
                },
                {
                  icon: Users,
                  message: "12 new users added to the system",
                  time: "1 day ago",
                  color: "text-primary"
                },
                {
                  icon: Mail,
                  message: "156 training emails sent today",
                  time: "1 day ago",
                  color: "text-accent"
                }
              ].map((activity, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-secondary/30 transition-smooth">
                  <div className="p-2 rounded-full bg-secondary">
                    <activity.icon className={`h-4 w-4 ${activity.color}`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;