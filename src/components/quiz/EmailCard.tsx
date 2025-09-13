import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, Paperclip, ExternalLink, Shield, AlertTriangle } from 'lucide-react';
import { Email } from '@/types/quiz';

interface EmailCardProps {
  email: Email;
  showAnswer?: boolean;
  userAnswer?: boolean | null;
}

const EmailCard: React.FC<EmailCardProps> = ({ email, showAnswer = false, userAnswer = null }) => {
  return (
    <Card className="w-full max-w-2xl mx-auto shadow-custom">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">Email Preview</span>
          </div>
          {showAnswer && (
            <div className="flex items-center gap-2">
              {email.isPhish ? (
                <Badge variant="destructive" className="flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  Phishing
                </Badge>
              ) : (
                <Badge variant="secondary" className="flex items-center gap-1 bg-success text-success-foreground">
                  <Shield className="h-3 w-3" />
                  Legitimate
                </Badge>
              )}
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            <div>
              <span className="font-medium text-muted-foreground">From:</span>
              <div className="font-medium">{email.senderName}</div>
              <div className="text-muted-foreground text-xs">{email.sender}</div>
            </div>
            <div>
              <span className="font-medium text-muted-foreground">To:</span>
              <div className="text-muted-foreground">{email.to}</div>
            </div>
          </div>
          
          <div className="text-sm">
            <span className="font-medium text-muted-foreground">Date:</span>
            <span className="ml-2">{email.timestamp}</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold text-lg mb-3 break-words">{email.subject}</h3>
        </div>
        
        <div className="bg-muted p-4 rounded-lg">
          <div className="whitespace-pre-line text-sm leading-relaxed">
            {email.body}
          </div>
          
          {(email.hasAttachment || email.hasLink) && (
            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex flex-wrap gap-2">
                {email.hasAttachment && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground bg-background px-2 py-1 rounded">
                    <Paperclip className="h-3 w-3" />
                    <span>attachment.pdf</span>
                  </div>
                )}
                {email.hasLink && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground bg-background px-2 py-1 rounded">
                    <ExternalLink className="h-3 w-3" />
                    <span>Contains external link</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {showAnswer && userAnswer !== null && (
          <div className="mt-4 p-4 rounded-lg bg-muted">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-medium">Your Answer:</span>
              <Badge variant={userAnswer === email.isPhish ? "secondary" : "destructive"}>
                {userAnswer ? "Phishing" : "Legitimate"}
              </Badge>
              {userAnswer === email.isPhish ? (
                <Badge variant="secondary" className="bg-success text-success-foreground">Correct</Badge>
              ) : (
                <Badge variant="destructive">Incorrect</Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{email.explanation}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EmailCard;