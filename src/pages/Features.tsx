import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  Shield, Target, Users, BarChart3, Mail, BookOpen, Clock, 
  Settings, Lock, Globe, Smartphone, Database, ArrowRight,
  CheckCircle, Star
} from "lucide-react";

const Features = () => {
  const features = [
    {
      category: "Campaign Management",
      items: [
        {
          icon: Target,
          title: "Custom Campaigns",
          description: "Create tailored phishing simulations with customizable templates and scenarios.",
          badge: "Popular"
        },
        {
          icon: Mail,
          title: "Email Templates",
          description: "50+ professionally designed phishing email templates for realistic training.",
          badge: null
        },
        {
          icon: Clock,
          title: "Scheduled Deployment",
          description: "Schedule campaigns at optimal times for maximum educational impact.",
          badge: null
        },
        {
          icon: Settings,
          title: "Advanced Configuration",
          description: "Fine-tune campaign parameters, difficulty levels, and targeting criteria.",
          badge: null
        }
      ]
    },
    {
      category: "Analytics & Reporting",
      items: [
        {
          icon: BarChart3,
          title: "Real-time Analytics",
          description: "Monitor campaign performance with live dashboards and detailed metrics.",
          badge: "New"
        },
        {
          icon: Database,
          title: "Comprehensive Reports",
          description: "Generate detailed reports for individuals, teams, and organizations.",
          badge: null
        },
        {
          icon: Users,
          title: "User Progress Tracking",
          description: "Track individual learning progress and identify areas for improvement.",
          badge: null
        },
        {
          icon: Globe,
          title: "Multi-location Support",
          description: "Manage campaigns across multiple locations and time zones.",
          badge: null
        }
      ]
    },
    {
      category: "Security & Compliance",
      items: [
        {
          icon: Shield,
          title: "Safe Environment",
          description: "Completely secure educational environment with no actual security risks.",
          badge: "Essential"
        },
        {
          icon: Lock,
          title: "Data Protection",
          description: "Enterprise-grade security with encryption and compliance standards.",
          badge: null
        },
        {
          icon: BookOpen,
          title: "Educational Focus",
          description: "Designed specifically for learning with immediate feedback and guidance.",
          badge: null
        },
        {
          icon: Smartphone,
          title: "Mobile Responsive",
          description: "Access training materials and campaigns from any device, anywhere.",
          badge: null
        }
      ]
    }
  ];

  const highlights = [
    "50+ Email Templates",
    "Real-time Analytics",
    "Multi-language Support",
    "API Integration",
    "Role-based Access",
    "Custom Branding"
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-20 bg-gradient-hero text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">
            Powerful Features for 
            <span className="block text-accent">Complete Training</span>
          </h1>
          <p className="text-xl text-white/90 mb-8">
            Everything you need to create, deploy, and measure effective 
            phishing awareness training programs.
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {highlights.map((highlight, index) => (
              <Badge key={index} variant="secondary" className="bg-white/20 text-white border-white/30">
                {highlight}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Features by Category */}
      {features.map((category, categoryIndex) => (
        <section key={categoryIndex} className={`py-20 ${categoryIndex % 2 === 0 ? 'bg-white' : 'bg-secondary/30'}`}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">{category.category}</h2>
              <div className="w-24 h-1 bg-gradient-primary mx-auto rounded-full"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {category.items.map((feature, index) => (
                <Card key={index} className="group hover:shadow-accent transition-smooth">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4 group-hover:bg-primary/20 transition-smooth">
                          <feature.icon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            {feature.title}
                            {feature.badge && (
                              <Badge variant={feature.badge === 'New' ? 'default' : 'secondary'} className="text-xs">
                                {feature.badge}
                              </Badge>
                            )}
                          </CardTitle>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Feature Comparison */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Choose PhishAware?</h2>
            <p className="text-lg text-muted-foreground">
              See how our features compare to traditional training methods
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-2 border-primary/20">
              <CardHeader className="bg-primary/5">
                <CardTitle className="flex items-center">
                  <Star className="h-5 w-5 text-primary mr-2" />
                  PhishAware Platform
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <ul className="space-y-3">
                  {[
                    "Interactive simulations",
                    "Real-time feedback",
                    "Detailed analytics",
                    "Customizable campaigns",
                    "Safe learning environment",
                    "Progress tracking"
                  ].map((item, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-success mr-3" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-muted-foreground">Traditional Training</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <ul className="space-y-3">
                  {[
                    "Static presentations",
                    "No immediate feedback",
                    "Limited metrics",
                    "One-size-fits-all",
                    "No practical experience",
                    "Difficult to measure"
                  ].map((item, index) => (
                    <li key={index} className="flex items-center">
                      <div className="w-4 h-4 border-2 border-muted rounded mr-3"></div>
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Experience All Features Today
          </h2>
          <p className="text-lg mb-8 text-white/90">
            Start your free trial and discover how PhishAware can transform 
            your organization's security awareness.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button variant="accent" size="lg">
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/demo">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary">
                See Live Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Features;