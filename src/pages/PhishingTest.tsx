import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import QuizLanding from '@/components/quiz/QuizLanding';
import QuizRunner from '@/components/quiz/QuizRunner';
import ResultScreen from '@/components/quiz/ResultScreen';
import { Email, QuizAnswer, QuizResult } from '@/types/quiz';
import emailsData from '@/data/emails.json';

type QuizState = 'landing' | 'running' | 'completed';

const PhishingTest: React.FC = () => {
  const navigate = useNavigate();
  const [quizState, setQuizState] = useState<QuizState>('landing');
  const [emails] = useState<Email[]>(emailsData);
  const [shuffledEmails, setShuffledEmails] = useState<Email[]>([]);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);

  // Shuffle emails when component mounts
  useEffect(() => {
    const shuffled = [...emails].sort(() => Math.random() - 0.5);
    setShuffledEmails(shuffled);
  }, [emails]);

  const handleStartQuiz = () => {
    setQuizState('running');
  };

  const handleQuizComplete = (answers: QuizAnswer[]) => {
    const score = answers.filter(answer => answer.isCorrect).length;
    const percentage = Math.round((score / answers.length) * 100);
    
    let classification = 'Beginner';
    if (percentage >= 90) classification = 'Expert';
    else if (percentage >= 80) classification = 'Good';
    else if (percentage >= 60) classification = 'Needs Improvement';

    const result: QuizResult = {
      score,
      totalQuestions: answers.length,
      percentage,
      classification,
      answers,
      completedAt: new Date(),
    };

    setQuizResult(result);
    setQuizState('completed');
  };

  const handleRetry = () => {
    // Shuffle emails again for retry
    const shuffled = [...emails].sort(() => Math.random() - 0.5);
    setShuffledEmails(shuffled);
    setQuizResult(null);
    setQuizState('landing');
  };

  const handleReturnHome = () => {
    navigate('/');
  };

  // SEO and accessibility
  useEffect(() => {
    document.title = 'Phishing Awareness Test - PhishAware';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Take our interactive phishing awareness test to improve your cybersecurity skills. Identify phishing emails and learn to protect yourself online.');
    }
  }, []);

  if (quizState === 'landing') {
    return <QuizLanding onStartQuiz={handleStartQuiz} />;
  }

  if (quizState === 'running') {
    return (
      <QuizRunner 
        emails={shuffledEmails}
        onQuizComplete={handleQuizComplete}
      />
    );
  }

  if (quizState === 'completed' && quizResult) {
    return (
      <ResultScreen
        result={quizResult}
        emails={shuffledEmails}
        onRetry={handleRetry}
        onReturnHome={handleReturnHome}
      />
    );
  }

  return null;
};

export default PhishingTest;