import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Target, Users, BarChart3, Shield, Mail, BookOpen, ArrowRight } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      step: 1,
      title: "Create Your Campaign",
      description: "Design custom phishing simulations using our template library or create your own scenarios.",
      details: [
        "Choose from 50+ email templates",
        "Customize content for your organization",
        "Set campaign parameters and targeting",
        "Schedule deployment timing"
      ],
      icon: Target
    },
    {
      step: 2,
      title: "Deploy & Monitor",
      description: "Launch your educational campaign and track real-time engagement and responses.",
      details: [
        "Send simulated phishing emails",
        "Monitor click rates and responses",
        "Provide immediate feedback",
        "Track learning progress"
      ],
      icon: Mail
    },
    {
      step: 3,
      title: "Analyze & Improve",
      description: "Review comprehensive analytics and provide targeted training to improve security awareness.",
      details: [
        "Detailed performance analytics",
        "Individual and team reports",
        "Identify training needs",
        "Measure improvement over time"
      ],
      icon: BarChart3
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-20 bg-gradient-hero text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">
            How PhishAware Works
          </h1>
          <p className="text-xl text-white/90">
            Our three-step process makes phishing awareness training simple, 
            effective, and measurable for organizations of all sizes.
          </p>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-20">
            {steps.map((step, index) => (
              <div key={step.step} className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
              }`}>
                <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white text-xl font-bold mr-4">
                      {step.step}
                    </div>
                    <step.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h2 className="text-3xl font-bold mb-4">{step.title}</h2>
                  <p className="text-lg text-muted-foreground mb-6">{step.description}</p>
                  
                  <ul className="space-y-3">
                    {step.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-center">
                        <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className={index % 2 === 1 ? 'lg:col-start-1' : ''}>
                  <Card className="p-8 shadow-custom">
                    <CardHeader className="text-center">
                      <div className="mx-auto w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                        <step.icon className="h-10 w-10 text-primary" />
                      </div>
                      <CardTitle className="text-2xl">Step {step.step}</CardTitle>
                      <CardDescription className="text-lg">{step.title}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-secondary/30 rounded-lg p-6">
                        <h4 className="font-semibold mb-3">Key Features:</h4>
                        <ul className="space-y-2">
                          {step.details.slice(0, 2).map((detail, detailIndex) => (
                            <li key={detailIndex} className="text-sm text-muted-foreground">
                              • {detail}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section className="py-20 bg-secondary/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Complete Training Ecosystem</h2>
            <p className="text-lg text-muted-foreground">
              Everything you need for comprehensive phishing awareness training
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Safe Environment</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Completely safe educational environment with no real security risks
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardHeader>
                <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Team Management</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Manage users, assign roles, and track progress across your organization
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardHeader>
                <BookOpen className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Educational Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Comprehensive library of training materials and best practices
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-lg mb-8 text-white/90">
            Try our platform today and see how easy it is to improve your organization's security awareness.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/demo">
              <Button variant="accent" size="lg">
                Try Free Demo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/features">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary">
                Explore Features
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default HowItWorks;