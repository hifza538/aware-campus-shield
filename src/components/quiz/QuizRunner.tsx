import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, AlertTriangle, CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import EmailCard from './EmailCard';
import ProgressDots from './ProgressDots';
import { Email, QuizAnswer } from '@/types/quiz';

interface QuizRunnerProps {
  emails: Email[];
  onQuizComplete: (answers: QuizAnswer[]) => void;
}

const QuizRunner: React.FC<QuizRunnerProps> = ({ emails, onQuizComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Array<{ isCorrect: boolean } | null>>(
    new Array(emails.length).fill(null)
  );
  const [detailedAnswers, setDetailedAnswers] = useState<QuizAnswer[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [userAnswer, setUserAnswer] = useState<boolean | null>(null);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());

  const currentEmail = emails[currentIndex];
  const totalQuestions = emails.length;

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (showFeedback) return; // Don't process shortcuts during feedback
      
      if (event.key.toLowerCase() === 'f') {
        handleAnswer(true); // Phishing
      } else if (event.key.toLowerCase() === 'l') {
        handleAnswer(false); // Legitimate
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showFeedback]);

  // Reset question start time when moving to next question
  useEffect(() => {
    setQuestionStartTime(Date.now());
  }, [currentIndex]);

  const handleAnswer = useCallback((isPhishing: boolean) => {
    if (showFeedback) return; // Prevent multiple answers

    const isCorrect = isPhishing === currentEmail.isPhish;
    const timeSpent = Math.round((Date.now() - questionStartTime) / 1000);

    // Update answers array
    const newAnswers = [...answers];
    newAnswers[currentIndex] = { isCorrect };
    setAnswers(newAnswers);

    // Update detailed answers
    const newDetailedAnswers = [...detailedAnswers];
    newDetailedAnswers[currentIndex] = {
      emailId: currentEmail.id,
      userAnswer: isPhishing,
      isCorrect,
      timeSpent,
    };
    setDetailedAnswers(newDetailedAnswers);

    setUserAnswer(isPhishing);
    setShowFeedback(true);

    // Auto-advance after delay or complete quiz
    setTimeout(() => {
      if (currentIndex < totalQuestions - 1) {
        setCurrentIndex(currentIndex + 1);
        setShowFeedback(false);
        setUserAnswer(null);
      } else {
        // Quiz complete
        onQuizComplete(newDetailedAnswers);
      }
    }, 1500);
  }, [currentEmail, currentIndex, answers, detailedAnswers, showFeedback, questionStartTime, totalQuestions, onQuizComplete]);

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowFeedback(false);
      setUserAnswer(null);
    } else {
      onQuizComplete(detailedAnswers);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Demo Warning Banner */}
        <Alert className="mb-6 border-accent bg-accent/10">
          <AlertTriangle className="h-4 w-4 text-accent" />
          <AlertDescription className="text-accent font-medium">
            <strong>DEMO ONLY</strong> — Educational phishing awareness test. No real emails are sent.
          </AlertDescription>
        </Alert>

        {/* Progress Section */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">Phishing Awareness Test</h1>
          <p className="text-muted-foreground mb-6">
            Question {currentIndex + 1} of {totalQuestions}
          </p>
          <ProgressDots
            totalQuestions={totalQuestions}
            currentQuestion={currentIndex}
            answers={answers}
          />
        </div>

        {/* Email Card */}
        <div className="mb-8">
          <EmailCard email={currentEmail} />
        </div>

        {/* Feedback Section */}
        {showFeedback && (
          <Card className="mb-6 shadow-custom">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-4">
                {userAnswer === currentEmail.isPhish ? (
                  <CheckCircle className="h-6 w-6 text-success" />
                ) : (
                  <XCircle className="h-6 w-6 text-destructive" />
                )}
                <div className="flex items-center gap-2">
                  <Badge variant={userAnswer === currentEmail.isPhish ? "secondary" : "destructive"}>
                    {userAnswer === currentEmail.isPhish ? "Correct!" : "Incorrect"}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    This email is {currentEmail.isPhish ? "phishing" : "legitimate"}
                  </span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {currentEmail.explanation}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        {!showFeedback ? (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => handleAnswer(false)}
              variant="outline"
              size="lg"
              className="px-8 py-6 text-lg flex items-center gap-2"
            >
              <Shield className="h-5 w-5 text-success" />
              Legitimate / Safe
              <span className="text-xs opacity-70">(L)</span>
            </Button>
            <Button
              onClick={() => handleAnswer(true)}
              variant="destructive"
              size="lg"
              className="px-8 py-6 text-lg flex items-center gap-2"
            >
              <AlertTriangle className="h-5 w-5" />
              Phishing / Malicious
              <span className="text-xs opacity-70">(F)</span>
            </Button>
          </div>
        ) : (
          <div className="flex justify-center">
            <Button
              onClick={handleNext}
              variant="default"
              size="lg"
              className="px-8 py-3 flex items-center gap-2"
            >
              {currentIndex < totalQuestions - 1 ? (
                <>
                  Next Question
                  <ArrowRight className="h-4 w-4" />
                </>
              ) : (
                "View Results"
              )}
            </Button>
          </div>
        )}

        {/* Instructions */}
        {!showFeedback && (
          <div className="text-center mt-8">
            <p className="text-sm text-muted-foreground">
              Use keyboard shortcuts: <kbd className="px-2 py-1 bg-muted rounded text-xs">F</kbd> for Phishing, 
              <kbd className="px-2 py-1 bg-muted rounded text-xs ml-1">L</kbd> for Legitimate
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizRunner;