import { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useSharedStreak } from './useSharedStreak';
import { usePairingStatus } from '../pairing/usePairingStatus';

export function StreakSection() {
  const { isPaired } = usePairingStatus();
  const { data: streakCount, isLoading } = useSharedStreak();
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const previousStreakRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (streakCount !== undefined && previousStreakRef.current !== undefined) {
      if (streakCount > previousStreakRef.current) {
        setShouldAnimate(true);
        const timer = setTimeout(() => setShouldAnimate(false), 600);
        return () => clearTimeout(timer);
      }
    }
    previousStreakRef.current = streakCount;
  }, [streakCount]);

  if (!isPaired || isLoading) {
    return null;
  }

  const displayText =
    streakCount === 0
      ? 'Start your connection streak today 💛'
      : `🔥 ${streakCount} days connected`;

  return (
    <Card className="max-w-md mx-auto">
      <CardContent className="pt-6 pb-6">
        <div
          className={`text-center text-lg font-medium transition-all ${
            shouldAnimate ? 'animate-streak-pulse' : ''
          }`}
        >
          {displayText}
        </div>
      </CardContent>
    </Card>
  );
}
