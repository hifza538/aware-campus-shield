import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertTriangle, Target, Clock, Award, Info } from 'lucide-react';

interface QuizLandingProps {
  onStartQuiz: () => void;
}

const QuizLanding: React.FC<QuizLandingProps> = ({ onStartQuiz }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Demo Warning Banner */}
        <Alert className="mb-8 border-accent bg-accent/10">
          <AlertTriangle className="h-4 w-4 text-accent" />
          <AlertDescription className="text-accent font-medium">
            <strong>DEMO ONLY</strong> — This tool is for education and internal training. 
            Do NOT use to send real phishing emails. Obtain consent and obey laws.
          </AlertDescription>
        </Alert>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="h-12 w-12 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">Phishing Awareness Test</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Test your ability to identify phishing emails and improve your cybersecurity awareness
          </p>
        </div>

        {/* Instructions Card */}
        <Card className="mb-8 shadow-custom">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-primary" />
              How It Works
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <Target className="h-8 w-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold mb-2">10 Email Scenarios</h3>
                <p className="text-sm text-muted-foreground">
                  Review realistic email examples and decide if they're legitimate or phishing attempts
                </p>
              </div>
              <div className="text-center">
                <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold mb-2">Immediate Feedback</h3>
                <p className="text-sm text-muted-foreground">
                  Get instant explanations for each answer to learn from every scenario
                </p>
              </div>
              <div className="text-center">
                <Award className="h-8 w-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold mb-2">Detailed Results</h3>
                <p className="text-sm text-muted-foreground">
                  See your score and review all questions with comprehensive explanations
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-lg mb-4">Instructions:</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold mt-1">1.</span>
                <span>Read each email carefully, including sender, subject, and content</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold mt-1">2.</span>
                <span>Decide if the email is <strong>Legitimate/Safe</strong> or <strong>Phishing/Malicious</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold mt-1">3.</span>
                <span>You'll receive immediate feedback and explanations for each answer</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold mt-1">4.</span>
                <span>Track your progress with the numbered indicators at the top</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold mt-1">5.</span>
                <span><strong>Keyboard shortcuts:</strong> Press 'F' for Phishing, 'L' for Legitimate</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Start Button */}
        <div className="text-center">
          <Button 
            onClick={onStartQuiz}
            size="xl"
            variant="hero"
            className="px-12 py-4 text-lg font-semibold"
          >
            <Shield className="mr-2 h-5 w-5" />
            Start Phishing Test
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            Takes approximately 5-10 minutes to complete
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuizLanding;