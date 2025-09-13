import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  Trophy, 
  Target, 
  Clock, 
  RotateCcw, 
  Home, 
  ChevronDown, 
  ChevronRight,
  CheckCircle,
  XCircle,
  Award
} from 'lucide-react';
import EmailCard from './EmailCard';
import { Email, QuizResult } from '@/types/quiz';

interface ResultScreenProps {
  result: QuizResult;
  emails: Email[];
  onRetry: () => void;
  onReturnHome: () => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({
  result,
  emails,
  onRetry,
  onReturnHome,
}) => {
  const [expandedQuestions, setExpandedQuestions] = useState<Set<number>>(new Set());

  const toggleQuestion = (questionIndex: number) => {
    const newExpanded = new Set(expandedQuestions);
    if (newExpanded.has(questionIndex)) {
      newExpanded.delete(questionIndex);
    } else {
      newExpanded.add(questionIndex);
    }
    setExpandedQuestions(newExpanded);
  };

  const getClassificationColor = (classification: string) => {
    switch (classification.toLowerCase()) {
      case 'expert':
        return 'text-success';
      case 'good':
        return 'text-primary';
      case 'needs improvement':
        return 'text-warning';
      default:
        return 'text-destructive';
    }
  };

  const getClassificationBadge = (classification: string) => {
    switch (classification.toLowerCase()) {
      case 'expert':
        return <Badge className="bg-success text-success-foreground">Expert</Badge>;
      case 'good':
        return <Badge variant="secondary">Good</Badge>;
      case 'needs improvement':
        return <Badge className="bg-warning text-warning-foreground">Needs Improvement</Badge>;
      default:
        return <Badge variant="destructive">Beginner</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Trophy className="h-16 w-16 text-accent mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Quiz Complete!</h1>
          <p className="text-muted-foreground">Here's how you performed on the phishing awareness test</p>
        </div>

        {/* Score Card */}
        <Card className="mb-8 shadow-custom">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Your Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Score Display */}
            <div className="text-center">
              <div className="text-6xl font-bold text-primary mb-2">
                {result.score}<span className="text-2xl text-muted-foreground">/{result.totalQuestions}</span>
              </div>
              <div className="text-xl text-muted-foreground mb-4">
                {result.percentage}% Correct
              </div>
              {getClassificationBadge(result.classification)}
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{result.percentage}%</span>
              </div>
              <Progress value={result.percentage} className="h-3" />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="text-center">
                <Target className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-success">{result.answers.filter(a => a.isCorrect).length}</div>
                <div className="text-sm text-muted-foreground">Correct Answers</div>
              </div>
              <div className="text-center">
                <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-accent">
                  {Math.round(result.answers.reduce((sum, a) => sum + a.timeSpent, 0) / result.answers.length)}s
                </div>
                <div className="text-sm text-muted-foreground">Avg. Time per Question</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Feedback */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-4">
              <Award className="h-6 w-6 text-primary" />
              <h3 className="text-lg font-semibold">Performance Feedback</h3>
            </div>
            <div className="space-y-3">
              {result.percentage >= 90 && (
                <p className="text-success">
                  <strong>Excellent!</strong> You have strong phishing detection skills. You can identify most phishing attempts and understand the key warning signs.
                </p>
              )}
              {result.percentage >= 70 && result.percentage < 90 && (
                <p className="text-primary">
                  <strong>Good work!</strong> You have solid phishing awareness. Review the questions you missed to further improve your skills.
                </p>
              )}
              {result.percentage >= 50 && result.percentage < 70 && (
                <p className="text-warning">
                  <strong>Room for improvement.</strong> Consider additional training on phishing indicators like suspicious domains, urgent language, and unexpected attachments.
                </p>
              )}
              {result.percentage < 50 && (
                <p className="text-destructive">
                  <strong>Additional training recommended.</strong> Phishing emails can be tricky! Focus on learning the common warning signs and practice more.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Question Review */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Question Review</CardTitle>
            <p className="text-muted-foreground">Review each question to learn from your answers</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {emails.map((email, index) => {
              const answer = result.answers[index];
              const isExpanded = expandedQuestions.has(index);
              
              return (
                <Collapsible key={email.id}>
                  <CollapsibleTrigger
                    onClick={() => toggleQuestion(index)}
                    className="w-full"
                  >
                    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="text-lg font-bold text-muted-foreground">
                          #{index + 1}
                        </div>
                        {answer.isCorrect ? (
                          <CheckCircle className="h-5 w-5 text-success" />
                        ) : (
                          <XCircle className="h-5 w-5 text-destructive" />
                        )}
                        <div className="text-left">
                          <div className="font-medium truncate max-w-md">{email.subject}</div>
                          <div className="text-sm text-muted-foreground">
                            {answer.isCorrect ? 'Correct' : 'Incorrect'} • {answer.timeSpent}s
                          </div>
                        </div>
                      </div>
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="mt-4 pl-4">
                      <EmailCard 
                        email={email} 
                        showAnswer={true}
                        userAnswer={answer.userAnswer}
                      />
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              );
            })}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={onRetry}
            variant="outline"
            size="lg"
            className="px-8 py-3 flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Retake Test
          </Button>
          <Button
            onClick={onReturnHome}
            variant="default"
            size="lg"
            className="px-8 py-3 flex items-center gap-2"
          >
            <Home className="h-4 w-4" />
            Return to Home
          </Button>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-8">
          <p className="text-xs text-muted-foreground">
            This quiz is for educational purposes only. Results are stored locally and not transmitted.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResultScreen;