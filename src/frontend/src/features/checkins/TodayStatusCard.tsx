import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useTodayCheckIns } from './useTodayCheckIns';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { usePairingStatus } from '../pairing/usePairingStatus';
import { CheckCircle2, Clock, Loader2 } from 'lucide-react';

export function TodayStatusCard() {
  const { data: todayCheckIns, isLoading } = useTodayCheckIns();
  const { identity } = useInternetIdentity();
  const { partnerName } = usePairingStatus();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  const currentPrincipal = identity?.getPrincipal().toString();
  
  // Filter check-ins by author and get the latest one for each person
  const myCheckIns = todayCheckIns?.filter(
    (checkIn) => checkIn.author.toString() === currentPrincipal
  ) || [];
  const partnerCheckIns = todayCheckIns?.filter(
    (checkIn) => checkIn.author.toString() !== currentPrincipal
  ) || [];

  // Get the latest check-in for each person (highest timestamp)
  const myCheckIn = myCheckIns.length > 0
    ? myCheckIns.reduce((latest, current) => 
        current.timestamp > latest.timestamp ? current : latest
      )
    : null;
  
  const partnerCheckIn = partnerCheckIns.length > 0
    ? partnerCheckIns.reduce((latest, current) => 
        current.timestamp > latest.timestamp ? current : latest
      )
    : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Today's Status</CardTitle>
        <CardDescription>
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">You</span>
            <div className="flex items-center gap-2">
              {myCheckIns.length > 1 && (
                <Badge variant="outline" className="text-xs">
                  {myCheckIns.length} check-ins
                </Badge>
              )}
              {myCheckIn ? (
                <Badge variant="default" className="gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Checked in
                </Badge>
              ) : (
                <Badge variant="secondary" className="gap-1">
                  <Clock className="h-3 w-3" />
                  Pending
                </Badge>
              )}
            </div>
          </div>
          {myCheckIn && (
            <div className="rounded-lg bg-muted/50 p-3 space-y-1">
              <div className="text-2xl">{myCheckIn.emoji}</div>
              <p className="text-sm text-muted-foreground">{myCheckIn.message}</p>
            </div>
          )}
        </div>

        <Separator />

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{partnerName || 'Partner'}</span>
            <div className="flex items-center gap-2">
              {partnerCheckIns.length > 1 && (
                <Badge variant="outline" className="text-xs">
                  {partnerCheckIns.length} check-ins
                </Badge>
              )}
              {partnerCheckIn ? (
                <Badge variant="default" className="gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Checked in
                </Badge>
              ) : (
                <Badge variant="secondary" className="gap-1">
                  <Clock className="h-3 w-3" />
                  Pending
                </Badge>
              )}
            </div>
          </div>
          {partnerCheckIn && (
            <div className="rounded-lg bg-muted/50 p-3 space-y-1">
              <div className="text-2xl">{partnerCheckIn.emoji}</div>
              <p className="text-sm text-muted-foreground">{partnerCheckIn.message}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
