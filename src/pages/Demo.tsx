import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Mail, Eye, AlertTriangle, CheckCircle, Clock, Users, BarChart3, Shield } from "lucide-react";

const Demo = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const demoSteps = [
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
            Interactive Demo
          </h1>
          <p className="text-xl text-white/90 mb-8">
            Experience how PhishAware works with this safe, educational demonstration
          </p>
          <Badge className="bg-warning/20 text-warning-foreground border-warning/30">
            <Shield className="h-4 w-4 mr-2" />
            Safe Demo Environment - No Real Risks
          </Badge>
        </div>
      </section>

      {/* Demo Steps Navigation */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {demoSteps.map((step, index) => (
              <div 
                key={index}
                className={`flex items-center cursor-pointer ${
                  index <= currentStep ? 'text-primary' : 'text-muted-foreground'
                }`}
                onClick={() => setCurrentStep(index)}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mr-3 ${
                  index <= currentStep 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {index + 1}
                </div>
                <div className="hidden sm:block">
                  <div className="font-medium">{step.title}</div>
                  <div className="text-sm text-muted-foreground">{step.description}</div>
                </div>
                {index < demoSteps.length - 1 && (
                  <div className={`hidden md:block w-20 h-0.5 ml-4 ${
                    index < currentStep ? 'bg-primary' : 'bg-muted'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Content */}
      <section className="py-12 min-h-[600px]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Step 1: Campaign Setup */}
          {currentStep === 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Mail className="h-5 w-5 mr-2" />
                    Campaign Configuration
                  </CardTitle>
                  <CardDescription>
                    Set up your phishing simulation parameters
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Campaign Name</label>
                    <div className="mt-1 p-2 bg-secondary/30 rounded border">Q4 Security Awareness Training</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Template</label>
                    <div className="mt-1 p-2 bg-secondary/30 rounded border">Urgent Security Update</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Target Group</label>
                    <div className="mt-1 p-2 bg-secondary/30 rounded border">All Employees (245 users)</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Difficulty Level</label>
                    <div className="mt-1 p-2 bg-secondary/30 rounded border">Medium</div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Campaign Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-secondary/30 rounded">
                      <span className="text-sm">Expected Recipients</span>
                      <Badge>245 users</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-secondary/30 rounded">
                      <span className="text-sm">Estimated Duration</span>
                      <Badge>2 weeks</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-secondary/30 rounded">
                      <span className="text-sm">Training Materials</span>
                      <Badge>Included</Badge>
                    </div>
                    <div className="mt-6">
                      <Button 
                        onClick={() => setCurrentStep(1)}
                        className="w-full"
                      >
                        Preview Email
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 2: Email Preview */}
          {currentStep === 1 && (
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
                      onClick={() => setCurrentStep(2)}
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
          {currentStep === 2 && (
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
            <Button variant="accent" size="lg">
              Start Free Trial
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary">
              Contact Sales
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Demo;