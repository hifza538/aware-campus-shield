import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Search, BookOpen, FileText, Video, Download, Clock, User, ArrowRight } from "lucide-react";

const Resources = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const categories = [
    { name: "All", count: 24 },
    { name: "Guides", count: 8 },
    { name: "Best Practices", count: 6 },
    { name: "Case Studies", count: 4 },
    { name: "Templates", count: 6 }
  ];

  const resources = [
    {
      title: "Complete Guide to Phishing Recognition",
      description: "Learn to identify common phishing tactics and protect yourself from email-based attacks.",
      category: "Guides",
      type: "article",
      readTime: "15 min read",
      author: "Security Team",
      downloadUrl: "#",
      featured: true
    },
    {
      title: "Building Security Awareness Culture",
      description: "How to create and maintain a security-conscious culture in your organization.",
      category: "Best Practices",
      type: "article",
      readTime: "10 min read",
      author: "Dr. Sarah Johnson",
      downloadUrl: "#",
      featured: false
    },
    {
      title: "Phishing Email Templates Collection",
      description: "A collection of real phishing email examples with detailed analysis.",
      category: "Templates",
      type: "download",
      readTime: "PDF - 2.3MB",
      author: "Research Team",
      downloadUrl: "#",
      featured: false
    },
    {
      title: "University Case Study: 90% Improvement",
      description: "How State University reduced phishing susceptibility by 90% using targeted training.",
      category: "Case Studies",
      type: "article",
      readTime: "8 min read",
      author: "Prof. Mike Chen",
      downloadUrl: "#",
      featured: true
    },
    {
      title: "Mobile Phishing Threats Guide",
      description: "Understanding and preventing phishing attacks on mobile devices and apps.",
      category: "Guides",
      type: "article",
      readTime: "12 min read",
      author: "Mobile Security Team",
      downloadUrl: "#",
      featured: false
    },
    {
      title: "Social Engineering Awareness Training",
      description: "Beyond email: recognizing social engineering attacks across all channels.",
      category: "Best Practices",
      type: "video",
      readTime: "25 min video",
      author: "Training Department",
      downloadUrl: "#",
      featured: false
    }
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case "video":
        return Video;
      case "download":
        return Download;
      default:
        return FileText;
    }
  };

  const filteredResources = resources.filter(resource =>
    resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resource.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-20 bg-gradient-hero text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">
            Knowledge Base & Resources
          </h1>
          <p className="text-xl text-white/90 mb-8">
            Everything you need to know about phishing awareness, cybersecurity 
            best practices, and effective training strategies.
          </p>
          <div className="max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search resources..."
                className="pl-10 bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((category, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-smooth"
              >
                {category.name} ({category.count})
              </Badge>
            ))}
          </div>

          {/* Featured Resources */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Featured Resources</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {filteredResources.filter(r => r.featured).map((resource, index) => (
                <Card key={index} className="group hover:shadow-accent transition-smooth">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
                          {(() => {
                            const IconComponent = getIcon(resource.type);
                            return <IconComponent className="h-5 w-5 text-primary" />;
                          })()}
                        </div>
                        <Badge variant="secondary">{resource.category}</Badge>
                      </div>
                      <Badge className="bg-gradient-primary text-white">Featured</Badge>
                    </div>
                    <CardTitle className="group-hover:text-primary transition-smooth">
                      {resource.title}
                    </CardTitle>
                    <CardDescription className="text-base">
                      {resource.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        {resource.author}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {resource.readTime}
                      </div>
                    </div>
                    <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-smooth">
                      {resource.type === "download" ? "Download" : "Read Article"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* All Resources */}
          <div>
            <h2 className="text-2xl font-bold mb-6">All Resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.filter(r => !r.featured).map((resource, index) => (
                <Card key={index} className="group hover:shadow-custom transition-smooth">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        {(() => {
                          const IconComponent = getIcon(resource.type);
                          return <IconComponent className="h-4 w-4 text-primary" />;
                        })()}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {resource.category}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg group-hover:text-primary transition-smooth">
                      {resource.title}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {resource.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                      <span>{resource.author}</span>
                      <span>{resource.readTime}</span>
                    </div>
                    <Button variant="ghost" size="sm" className="w-full justify-between">
                      {resource.type === "download" ? "Download" : "Read"}
                      <ArrowRight className="h-3 w-3" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {filteredResources.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No resources found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search terms or browse all categories.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-16 bg-secondary/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center mb-8">Quick Access</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center hover:shadow-custom transition-smooth">
              <CardContent className="pt-6">
                <BookOpen className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Training Materials</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Ready-to-use training content for your organization
                </p>
                <Button variant="outline" size="sm">Browse Materials</Button>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-custom transition-smooth">
              <CardContent className="pt-6">
                <FileText className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Best Practices</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Industry-proven strategies for security awareness
                </p>
                <Button variant="outline" size="sm">View Practices</Button>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-custom transition-smooth">
              <CardContent className="pt-6">
                <Download className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Templates</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Downloadable templates and resources
                </p>
                <Button variant="outline" size="sm">Get Templates</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Need More Resources?
          </h2>
          <p className="text-lg mb-8 text-white/90">
            Our team of security experts is constantly creating new educational 
            content. Contact us for custom training materials.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="accent" size="lg">
              Request Custom Content
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary">
              Contact Support
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Resources;