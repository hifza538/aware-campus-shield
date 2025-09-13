import React from 'react';
import { cn } from '@/lib/utils';
import { ProgressStatus } from '@/types/quiz';

interface ProgressDotsProps {
  totalQuestions: number;
  currentQuestion: number;
  answers: Array<{ isCorrect: boolean } | null>;
}

const ProgressDots: React.FC<ProgressDotsProps> = ({
  totalQuestions,
  currentQuestion,
  answers,
}) => {
  const getStatus = (index: number): ProgressStatus => {
    if (index === currentQuestion) return 'current';
    if (answers[index] === null) return 'unanswered';
    return answers[index]?.isCorrect ? 'correct' : 'incorrect';
  };

  const getStatusStyles = (status: ProgressStatus) => {
    switch (status) {
      case 'current':
        return 'bg-primary text-primary-foreground border-2 border-primary ring-2 ring-primary/20 scale-110';
      case 'correct':
        return 'bg-success text-success-foreground border border-success';
      case 'incorrect':
        return 'bg-destructive text-destructive-foreground border border-destructive';
      case 'unanswered':
      default:
        return 'bg-muted text-muted-foreground border border-border';
    }
  };

  return (
    <div className="flex flex-wrap justify-center gap-2 mb-8" role="progressbar" aria-valuenow={currentQuestion + 1} aria-valuemax={totalQuestions}>
      {Array.from({ length: totalQuestions }, (_, index) => {
        const status = getStatus(index);
        return (
          <div
            key={index}
            className={cn(
              'w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300',
              getStatusStyles(status)
            )}
            aria-label={`Question ${index + 1} ${status === 'current' ? '(current)' : status}`}
          >
            {index + 1}
          </div>
        );
      })}
    </div>
  );
};

export default ProgressDots;