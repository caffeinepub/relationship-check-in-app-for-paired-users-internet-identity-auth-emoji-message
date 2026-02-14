import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../../hooks/useActor';
import type { RelationshipStatus } from '../../backend';

export function useSetRelationshipStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (status: string) => {
      if (!actor) throw new Error('Actor not available');

      const relationshipStatus: RelationshipStatus = {
        status,
        customMessage: '',
      };
      await actor.setRelationshipStatus(relationshipStatus);
    },
    onSuccess: () => {
      // Invalidate all relationship status and pairing-related queries
      queryClient.invalidateQueries({ queryKey: ['relationshipStatus'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      queryClient.invalidateQueries({ queryKey: ['partner'] });
      queryClient.invalidateQueries({ queryKey: ['partnerProfile'] });
    },
  });
}
