import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useSubmitCheckIn } from './useSubmitCheckIn';
import { useTodayCheckIns } from './useTodayCheckIns';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useHasPremium } from '../profile/useHasPremium';
import { EMOJIS, MAX_MESSAGE_LENGTH } from './constants';
import { Loader2, Send, CheckCircle2, Crown } from 'lucide-react';

export function CheckInComposer() {
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const { submitCheckIn, isSubmitting, isSuccess, error, reset } = useSubmitCheckIn();
  const { data: todayCheckIns } = useTodayCheckIns();
  const { data: hasPremium, isLoading: premiumLoading } = useHasPremium();
  const { identity } = useInternetIdentity();

  const currentPrincipal = identity?.getPrincipal().toString();
  const hasCheckedInToday = todayCheckIns?.some(
    (checkIn) => checkIn.author.toString() === currentPrincipal
  );

  const isPremiumUser = hasPremium === true;
  const isBlocked = hasCheckedInToday && !isPremiumUser;

  useEffect(() => {
    if (isSuccess) {
      setSelectedEmoji(null);
      setMessage('');
      const timer = setTimeout(() => reset(), 3000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, reset]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedEmoji && message.trim() && !isBlocked) {
      submitCheckIn({ emoji: selectedEmoji, message: message.trim() });
    }
  };

  if (isBlocked) {
    return (
      <Card className="border-amber-200 dark:border-amber-900 bg-amber-50/50 dark:bg-amber-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
            <CheckCircle2 className="h-5 w-5" />
            Daily Limit Reached
          </CardTitle>
          <CardDescription>
            You've already checked in today. Multiple same-day check-ins are a premium feature.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Crown className="h-4 w-4 text-amber-500" />
            <span>Upgrade to premium for unlimited daily check-ins</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isSuccess) {
    return (
      <Card className="border-green-200 dark:border-green-900 bg-green-50/50 dark:bg-green-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
            <CheckCircle2 className="h-5 w-5" />
            Check-in Submitted!
          </CardTitle>
          <CardDescription>
            Your partner will see your check-in. Thank you for sharing!
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Today's Check-in</CardTitle>
            <CardDescription>
              How are you feeling today? Share your emotions with your partner
            </CardDescription>
          </div>
          {isPremiumUser && (
            <Badge variant="secondary" className="gap-1">
              <Crown className="h-3 w-3 text-amber-500" />
              Premium
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <Label>Select Your Mood</Label>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {EMOJIS.map(({ emoji, label }) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setSelectedEmoji(emoji)}
                  className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all hover:scale-105 ${
                    selectedEmoji === emoji
                      ? 'border-primary bg-primary/10 shadow-sm'
                      : 'border-border hover:border-primary/50'
                  }`}
                  disabled={isSubmitting}
                >
                  <span className="text-3xl mb-1">{emoji}</span>
                  <span className="text-xs text-muted-foreground">{label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="message">Your Message</Label>
              <Badge variant="secondary" className="text-xs">
                {message.length}/{MAX_MESSAGE_LENGTH}
              </Badge>
            </div>
            <Textarea
              id="message"
              placeholder="Share what's on your mind..."
              value={message}
              onChange={(e) => {
                if (e.target.value.length <= MAX_MESSAGE_LENGTH) {
                  setMessage(e.target.value);
                }
              }}
              disabled={isSubmitting}
              rows={4}
              className="resize-none"
            />
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <Button
            type="submit"
            disabled={!selectedEmoji || !message.trim() || isSubmitting}
            className="w-full"
            size="lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Submit Check-in
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
