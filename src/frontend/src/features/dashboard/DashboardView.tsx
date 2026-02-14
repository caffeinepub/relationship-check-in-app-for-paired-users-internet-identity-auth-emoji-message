import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckInComposer } from '../checkins/CheckInComposer';
import { TodayStatusCard } from '../checkins/TodayStatusCard';
import { CheckInHistoryList } from './CheckInHistoryList';
import { useRelationshipStatusState } from '../relationshipStatus/useRelationshipStatusState';
import { StreakSection } from '../streak/StreakSection';
import { Heart, History } from 'lucide-react';

export function DashboardView() {
  const { hasStatus, statusValue } = useRelationshipStatusState();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Your Daily Check-in</h1>
        <p className="text-muted-foreground">
          Share your feelings and stay connected with your partner
        </p>
        
        {/* Relationship Status Display */}
        {hasStatus && statusValue && (
          <div className="pt-2">
            <p className="text-sm font-medium text-primary">
              Status: {statusValue}
            </p>
          </div>
        )}
        {!hasStatus && (
          <div className="pt-2">
            <p className="text-sm text-muted-foreground italic">
              Waiting for your partner to choose the relationship status.
            </p>
          </div>
        )}
      </div>

      {/* Streak Section */}
      <StreakSection />

      <Tabs defaultValue="today" className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
          <TabsTrigger value="today" className="gap-2">
            <Heart className="h-4 w-4" />
            Today
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2">
            <History className="h-4 w-4" />
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="space-y-6 mt-6">
          <TodayStatusCard />
          <CheckInComposer />
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <CheckInHistoryList />
        </TabsContent>
      </Tabs>
    </div>
  );
}
