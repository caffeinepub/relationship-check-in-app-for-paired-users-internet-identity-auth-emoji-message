import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../../hooks/useActor';
import type { UserProfile } from '../../backend';

interface SaveProfileParams {
  name: string;
  country?: string;
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, country }: SaveProfileParams) => {
      if (!actor) throw new Error('Actor not available');
      
      const profile: UserProfile = {
        name,
        premium: false,
        can_set_relationship_status: false,
        streak_count: BigInt(0),
        last_checkin_date: undefined,
        country: country || undefined,
      };
      
      await actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}
