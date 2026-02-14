import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../../hooks/useActor';
import type { UserProfile } from '../../backend';

interface SaveProfileParams {
  name: string;
  country: string;
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, country }: SaveProfileParams) => {
      if (!actor) throw new Error('Actor not available');
      
      // Frontend validation: ensure country is provided and not empty
      const trimmedCountry = country?.trim() || '';
      if (!trimmedCountry) {
        throw new Error('Country selection is required.');
      }
      
      const profile: UserProfile = {
        name: name.trim(),
        premium: false,
        streak_count: BigInt(0),
        country: trimmedCountry,
      };
      
      await actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}
