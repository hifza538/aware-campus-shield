import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Users, Target, BookOpen } from "lucide-react";

const About = () => {
  return (
    <Layout>
      <section className="py-20 bg-gradient-hero text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">About PhishAware</h1>
          <p className="text-xl text-white/90">
            Dedicated to building stronger cybersecurity awareness through ethical education and training.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
            <p className="text-lg text-muted-foreground">
              PhishAware is committed to creating a safer digital world through comprehensive 
              phishing awareness education and ethical simulation training.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {[
              {
                icon: Shield,
                title: "Ethical First",
                description: "All our tools are designed for educational purposes only, with strict ethical guidelines."
              },
              {
                icon: Users,
                title: "Community Driven",
                description: "Built for educators, by educators, with input from cybersecurity professionals."
              },
              {
                icon: Target,
                title: "Effective Training",
                description: "Proven methodologies that improve security awareness and reduce phishing susceptibility."
              },
              {
                icon: BookOpen,
                title: "Continuous Learning",
                description: "Always expanding our knowledge base with the latest threat intelligence and best practices."
              }
            ].map((value, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <value.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                  <CardTitle>{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{value.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;