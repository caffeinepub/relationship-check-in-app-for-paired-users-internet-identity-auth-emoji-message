import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../../hooks/useActor';
import type { UserProfile } from '../../backend';

interface SaveProfileParams {
  name: string;
  country: string;
  avatar?: string;
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, country, avatar }: SaveProfileParams) => {
      if (!actor) throw new Error('Actor not available');
      
      // Frontend validation: ensure country is provided and not empty
      const trimmedCountry = country?.trim() || '';
      if (!trimmedCountry) {
        throw new Error('Country selection is required.');
      }

      // Get existing profile to preserve backend-managed fields
      const existingProfile = await actor.getCallerUserProfile();
      
      const profile: UserProfile = {
        name: name.trim(),
        premium: existingProfile?.premium || false,
        streak_count: existingProfile?.streak_count || BigInt(0),
        country: trimmedCountry,
        avatar: avatar || '',
        // Preserve backend-managed fields
        ...(existingProfile?.partner_ref && { partner_ref: existingProfile.partner_ref }),
        ...(existingProfile?.relationship_status && { relationship_status: existingProfile.relationship_status }),
        ...(existingProfile?.last_checkin_date && { last_checkin_date: existingProfile.last_checkin_date }),
      };
      
      await actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}
