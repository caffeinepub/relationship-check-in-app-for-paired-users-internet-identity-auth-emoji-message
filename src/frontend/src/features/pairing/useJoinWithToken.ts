import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../../hooks/useActor';

export function useJoinWithToken() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (token: string) => {
      if (!actor) throw new Error('Not authenticated');
      return actor.joinWithToken(token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partner'] });
      queryClient.invalidateQueries({ queryKey: ['partnerProfile'] });
    },
  });

  const errorMessage = mutation.error
    ? mutation.error instanceof Error
      ? mutation.error.message
      : 'Failed to join with token'
    : undefined;

  return {
    joinWithToken: mutation.mutate,
    isJoining: mutation.isPending,
    error: errorMessage,
  };
}
