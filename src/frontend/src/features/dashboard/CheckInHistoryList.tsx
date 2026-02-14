import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useCheckInHistory } from '../checkins/useCheckInHistory';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { Loader2, Calendar } from 'lucide-react';

export function CheckInHistoryList() {
  const { data: history, isLoading } = useCheckInHistory(30);
  const { identity } = useInternetIdentity();

  const currentPrincipal = identity?.getPrincipal().toString();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (!history || history.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Check-in History
          </CardTitle>
          <CardDescription>Your past check-ins will appear here</CardDescription>
        </CardHeader>
        <CardContent className="py-12">
          <div className="text-center text-muted-foreground">
            <p>No check-ins yet</p>
            <p className="text-sm mt-1">Start by submitting your first check-in above</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Check-in History
        </CardTitle>
        <CardDescription>Last {history.length} check-ins</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {history.map((checkIn, index) => {
            const isCurrentUser = checkIn.author.toString() === currentPrincipal;
            const date = new Date(Number(checkIn.timestamp) / 1000000);

            return (
              <div key={index}>
                {index > 0 && <Separator className="my-4" />}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant={isCurrentUser ? 'default' : 'secondary'}>
                      {isCurrentUser ? 'You' : 'Partner'}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {date.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">{checkIn.emoji}</span>
                    <p className="text-sm text-muted-foreground flex-1 pt-1">
                      {checkIn.message}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
