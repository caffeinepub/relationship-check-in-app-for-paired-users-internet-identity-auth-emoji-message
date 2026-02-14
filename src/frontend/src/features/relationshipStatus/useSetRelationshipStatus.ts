import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../../hooks/useActor';
import type { RelationshipStatus, UserProfile } from '../../backend';

export function useSetRelationshipStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (status: string) => {
      if (!actor) throw new Error('Actor not available');
      
      // Frontend guard: check if user is allowed to set status
      const profile = queryClient.getQueryData<UserProfile | null>(['currentUserProfile']);
      if (!profile?.can_set_relationship_status) {
        throw new Error('Only the invited user can set the initial relationship status');
      }

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
