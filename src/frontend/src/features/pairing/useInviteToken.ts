import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useActor } from '../../hooks/useActor';

export function useInviteToken() {
  const [token, setToken] = useState<string | null>(null);
  const { actor } = useActor();

  const mutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Not authenticated');
      return actor.generateInviteToken();
    },
    onSuccess: (newToken) => {
      setToken(newToken);
    },
  });

  const generateToken = () => {
    mutation.mutate();
  };

  const errorMessage = mutation.error
    ? mutation.error instanceof Error
      ? mutation.error.message
      : 'Failed to generate invite token'
    : undefined;

  return {
    token,
    generateToken,
    isGenerating: mutation.isPending,
    error: errorMessage,
  };
}
