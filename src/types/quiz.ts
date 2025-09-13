export interface Email {
  id: number;
  subject: string;
  sender: string;
  senderName: string;
  to: string;
  timestamp: string;
  body: string;
  isPhish: boolean;
  explanation: string;
  hasAttachment: boolean;
  hasLink: boolean;
}

export interface QuizAnswer {
  emailId: number;
  userAnswer: boolean; // true = phish, false = legitimate
  isCorrect: boolean;
  timeSpent: number; // in seconds
}

export interface QuizResult {
  score: number;
  totalQuestions: number;
  percentage: number;
  classification: string;
  answers: QuizAnswer[];
  completedAt: Date;
}

export type ProgressStatus = 'unanswered' | 'correct' | 'incorrect' | 'current';