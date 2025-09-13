import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Check, Star, Users, Building, Zap } from "lucide-react";

const Pricing = () => {
  const plans = [
    {
      name: "Student",
      price: "Free",
      period: "forever",
      description: "Perfect for individual learners and small study groups",
      features: [
        "Up to 10 simulated emails",
        "Basic email templates",
        "Individual progress tracking",
        "Educational resources",
        "Community support"
      ],
      popular: false,
      cta: "Start Free",
      icon: Users
    },
    {
      name: "Educator",
      price: "$29",
      period: "per month",
      description: "Ideal for teachers and small educational institutions",
      features: [
        "Up to 100 students",
        "50+ email templates",
        "Class management tools",
        "Detailed analytics",
        "Curriculum integration",
        "Email support",
        "Custom branding"
      ],
      popular: true,
      cta: "Start Free Trial",
      icon: Star
    },
    {
      name: "Enterprise",
      price: "$199",
      period: "per month",
      description: "Full-featured solution for large organizations",
      features: [
        "Unlimited users",
        "Advanced campaign builder",
        "Multi-location support",
        "API integration",
        "SSO authentication",
        "Priority support",
        "Custom development",
        "Compliance reporting"
      ],
      popular: false,
      cta: "Contact Sales",
      icon: Building
    }
  ];

  const features = [
    "Safe educational environment",
    "No real security risks",
    "Comprehensive training materials",
    "Real-time feedback",
    "Progress tracking",
    "Multi-language support"
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-20 bg-gradient-hero text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-white/90 mb-8">
            Choose the perfect plan for your educational needs. 
            All plans include our core phishing awareness training features.
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {features.map((feature, index) => (
              <Badge key={index} variant="secondary" className="bg-white/20 text-white border-white/30">
                {feature}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 bg-secondary/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <Card 
                key={index} 
                className={`relative ${
                  plan.popular 
                    ? 'border-2 border-primary shadow-accent scale-105' 
                    : 'hover:shadow-custom transition-smooth'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-primary text-white px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-8">
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                    <plan.icon className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription className="text-base">{plan.description}</CardDescription>
                  <div className="pt-4">
                    <span className="text-4xl font-bold text-primary">{plan.price}</span>
                    {plan.period && (
                      <span className="text-muted-foreground ml-1">/{plan.period}</span>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <Check className="h-4 w-4 text-success mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Link to={plan.name === "Enterprise" ? "/contact" : "/signup"} className="block">
                    <Button 
                      variant={plan.popular ? "hero" : "outline"} 
                      className="w-full"
                      size="lg"
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to know about our pricing and plans
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-3">Is this really safe for educational use?</h3>
              <p className="text-muted-foreground mb-6">
                Absolutely. PhishAware is designed exclusively for educational purposes 
                and creates no real security risks. All simulations are clearly marked 
                as training exercises.
              </p>
              
              <h3 className="font-semibold mb-3">Can I upgrade or downgrade my plan?</h3>
              <p className="text-muted-foreground mb-6">
                Yes, you can change your plan at any time. Upgrades take effect immediately, 
                and downgrades will be applied at your next billing cycle.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">Do you offer educational discounts?</h3>
              <p className="text-muted-foreground mb-6">
                Yes! We offer special pricing for educational institutions. 
                Contact our sales team to learn about available discounts for schools and universities.
              </p>
              
              <h3 className="font-semibold mb-3">What kind of support do you provide?</h3>
              <p className="text-muted-foreground mb-6">
                All plans include access to our knowledge base and community forums. 
                Paid plans also include email support, with Enterprise customers receiving priority assistance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Ethical Use Notice */}
      <section className="py-16 bg-warning/10 border-y border-warning/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center items-center mb-4">
              <Zap className="h-8 w-8 text-warning mr-3" />
              <h2 className="text-2xl font-bold text-warning-foreground">Ethical Use Policy</h2>
            </div>
            <p className="text-lg text-warning-foreground/80 mb-6">
              PhishAware is designed exclusively for educational and awareness training purposes. 
              Our platform must not be used to conduct real phishing attacks or any malicious activities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/terms">
                <Button variant="outline" className="border-warning text-warning hover:bg-warning hover:text-warning-foreground">
                  Read Terms of Service
                </Button>
              </Link>
              <Link to="/privacy">
                <Button variant="outline" className="border-warning text-warning hover:bg-warning hover:text-warning-foreground">
                  Privacy Policy
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Start Training?
          </h2>
          <p className="text-lg mb-8 text-white/90">
            Join thousands of educators and organizations using PhishAware 
            to build stronger cybersecurity awareness.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button variant="accent" size="lg">
                Start Free Today
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary">
                Talk to Sales
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Pricing;