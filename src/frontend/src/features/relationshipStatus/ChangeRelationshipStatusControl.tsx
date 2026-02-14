import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSetRelationshipStatus } from './useSetRelationshipStatus';
import { RELATIONSHIP_OPTIONS } from './relationshipStatusOptions';
import { Loader2, Heart } from 'lucide-react';
import { toast } from 'sonner';

interface ChangeRelationshipStatusControlProps {
  currentStatus: string;
}

export function ChangeRelationshipStatusControl({ currentStatus }: ChangeRelationshipStatusControlProps) {
  const [selectedStatus, setSelectedStatus] = useState<string>(currentStatus);
  const setStatusMutation = useSetRelationshipStatus();

  const handleSave = async () => {
    if (selectedStatus === currentStatus) {
      toast.info('Status unchanged');
      return;
    }

    setStatusMutation.mutate(selectedStatus, {
      onSuccess: () => {
        toast.success('Relationship status updated successfully 💛');
      },
      onError: (error) => {
        const errorMessage = error instanceof Error ? error.message : 'Failed to update status';
        toast.error(errorMessage);
      },
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5" />
          Relationship Status
        </CardTitle>
        <CardDescription>Change your relationship status</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Current Status</label>
          <Select value={selectedStatus} onValueChange={setSelectedStatus} disabled={setStatusMutation.isPending}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {RELATIONSHIP_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          onClick={handleSave}
          disabled={selectedStatus === currentStatus || setStatusMutation.isPending}
          className="w-full"
        >
          {setStatusMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating...
            </>
          ) : (
            'Update Status'
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
