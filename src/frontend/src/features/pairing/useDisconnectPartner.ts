import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../../hooks/useActor';

export function useDisconnectPartner() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      await actor.disconnect();
    },
    onSuccess: () => {
      // Invalidate all pairing-dependent queries
      queryClient.invalidateQueries({ queryKey: ['partner'] });
      queryClient.invalidateQueries({ queryKey: ['partnerProfile'] });
      queryClient.invalidateQueries({ queryKey: ['todayCheckIns'] });
      queryClient.invalidateQueries({ queryKey: ['checkInHistory'] });
      queryClient.invalidateQueries({ queryKey: ['relationshipStatus'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}
