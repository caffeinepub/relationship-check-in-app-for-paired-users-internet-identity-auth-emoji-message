import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../../hooks/useActor';

export function useSubmitCheckIn() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ emoji, message }: { emoji: string; message: string }) => {
      if (!actor) throw new Error('Not authenticated');
      await actor.submitCheckIn(emoji, message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todayCheckIns'] });
      queryClient.invalidateQueries({ queryKey: ['checkInHistory'] });
    },
  });

  const errorMessage = mutation.error
    ? mutation.error instanceof Error
      ? mutation.error.message
      : 'Failed to submit check-in'
    : undefined;

  return {
    submitCheckIn: mutation.mutate,
    isSubmitting: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error: errorMessage,
    reset: mutation.reset,
  };
}
