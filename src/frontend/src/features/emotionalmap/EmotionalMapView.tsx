import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTodayCheckIns } from '../checkins/useTodayCheckIns';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { usePairingStatus } from '../pairing/usePairingStatus';
import { getLatestCheckInByAuthor } from '../../lib/checkInHelpers';
import { Loader2 } from 'lucide-react';

export function EmotionalMapView() {
  const { data: todayCheckIns, isLoading } = useTodayCheckIns();
  const { identity } = useInternetIdentity();
  const { isPaired, partnerName, partner } = usePairingStatus();

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isPaired) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <p className="text-lg text-muted-foreground">
              You are not connected to a partner yet.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentPrincipal = identity?.getPrincipal().toString();
  const partnerPrincipal = partner?.toString();

  const myLatestCheckIn = currentPrincipal
    ? getLatestCheckInByAuthor(todayCheckIns || [], currentPrincipal)
    : null;

  const partnerLatestCheckIn = partnerPrincipal
    ? getLatestCheckInByAuthor(todayCheckIns || [], partnerPrincipal)
    : null;

  const myEmoji = myLatestCheckIn?.emoji;
  const partnerEmoji = partnerLatestCheckIn?.emoji;

  let statusMessage = '';
  if (myEmoji && partnerEmoji) {
    if (myEmoji === partnerEmoji) {
      statusMessage = 'You are emotionally in sync today 💛';
    } else {
      statusMessage = 'You feel different today. Maybe talk a little more 🌊';
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Emotional Map</h1>
        <p className="text-muted-foreground">
          See how you and your partner are feeling today
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Today's Emotional Connection</CardTitle>
          <CardDescription>
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="flex items-center justify-center gap-12 py-8">
            <div className="text-center space-y-2">
              <div className="text-7xl">{myEmoji || '❓'}</div>
              <p className="text-sm font-medium text-muted-foreground">You</p>
            </div>
            <div className="text-center space-y-2">
              <div className="text-7xl">{partnerEmoji || '❓'}</div>
              <p className="text-sm font-medium text-muted-foreground">
                {partnerName || 'Partner'}
              </p>
            </div>
          </div>

          {statusMessage && (
            <div className="text-center">
              <p className="text-lg font-medium text-foreground">{statusMessage}</p>
            </div>
          )}

          {!myEmoji && !partnerEmoji && (
            <div className="text-center">
              <p className="text-muted-foreground">
                No check-ins yet today. Start by sharing how you feel!
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
