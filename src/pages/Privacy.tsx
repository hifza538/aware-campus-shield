import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Privacy = () => {
  return (
    <Layout>
      <section className="py-20 bg-gradient-hero text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">Privacy Policy</h1>
          <p className="text-xl text-white/90">
            Your privacy and data security are our top priorities.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardHeader>
              <CardTitle>Data Collection and Use</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p>
                PhishAware is committed to protecting your privacy. This educational platform 
                collects minimal data necessary for training purposes only.
              </p>
              <h3>Information We Collect</h3>
              <ul>
                <li>Email addresses for campaign delivery</li>
                <li>Training completion data</li>
                <li>Anonymous usage analytics</li>
              </ul>
              <h3>How We Use Information</h3>
              <ul>
                <li>Deliver educational content</li>
                <li>Track training progress</li>
                <li>Improve our platform</li>
              </ul>
              <h3>Data Security</h3>
              <p>
                All data is encrypted and stored securely. We never share personal 
                information with third parties.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </Layout>
  );
};

export default Privacy;