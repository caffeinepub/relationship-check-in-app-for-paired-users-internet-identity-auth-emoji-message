import { useState } from 'react';
import { useSetRelationshipStatus } from './useSetRelationshipStatus';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const RELATIONSHIP_OPTIONS = [
  'Friendship',
  'Almost Something',
  'Situationship',
  'Relationship',
  'Engaged',
  'Married',
] as const;

interface ChooseRelationshipStatusViewProps {
  onComplete: () => void;
}

export function ChooseRelationshipStatusView({ onComplete }: ChooseRelationshipStatusViewProps) {
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const setStatusMutation = useSetRelationshipStatus();

  const handleSelect = async (status: string) => {
    setSelectedStatus(status);
    setStatusMutation.mutate(status, {
      onSuccess: () => {
        toast.success('Relationship status updated successfully 💛');
        onComplete();
      },
      onError: (error) => {
        setSelectedStatus(null);
        const errorMessage = error instanceof Error ? error.message : 'Failed to update status';
        toast.error(errorMessage);
      },
    });
  };

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Choose Relationship Status</CardTitle>
          <CardDescription>
            Select the status that best describes your relationship
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {RELATIONSHIP_OPTIONS.map((option) => (
            <Button
              key={option}
              variant="outline"
              className="w-full h-auto py-4 text-lg font-medium hover:bg-primary hover:text-primary-foreground transition-colors"
              onClick={() => handleSelect(option)}
              disabled={setStatusMutation.isPending}
            >
              {setStatusMutation.isPending && selectedStatus === option ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Saving...
                </>
              ) : (
                option
              )}
            </Button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
