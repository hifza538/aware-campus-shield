import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

const Terms = () => {
  return (
    <Layout>
      <section className="py-20 bg-gradient-hero text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">Terms of Service</h1>
          <p className="text-xl text-white/90">
            Important guidelines for using PhishAware responsibly.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <Card className="border-warning">
            <CardHeader>
              <CardTitle className="flex items-center text-warning">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Ethical Use Policy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-medium mb-4">
                PhishAware is designed exclusively for educational and awareness training purposes.
              </p>
              <ul className="space-y-2 text-sm">
                <li>• Must not be used for real phishing attacks</li>
                <li>• All campaigns must be clearly identified as training</li>
                <li>• Users must consent to participation</li>
                <li>• No malicious content or actual threats</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Terms and Conditions</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <h3>Acceptable Use</h3>
              <p>
                Users agree to use PhishAware only for legitimate educational purposes 
                and cybersecurity awareness training.
              </p>
              <h3>Account Responsibilities</h3>
              <p>
                Organizations are responsible for ensuring all participants understand 
                the educational nature of campaigns.
              </p>
              <h3>Limitation of Liability</h3>
              <p>
                PhishAware provides educational tools and cannot be held responsible 
                for misuse of the platform.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </Layout>
  );
};

export default Terms;