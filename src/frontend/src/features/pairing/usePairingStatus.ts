import { useQuery } from '@tanstack/react-query';
import { useActor } from '../../hooks/useActor';
import type { Principal } from '@dfinity/principal';
import type { UserProfile } from '../../backend';

export function usePairingStatus() {
  const { actor, isFetching: actorFetching } = useActor();

  const partnerQuery = useQuery<Principal | null>({
    queryKey: ['partner'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getPartner();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  const partnerProfileQuery = useQuery<UserProfile | null>({
    queryKey: ['partnerProfile', partnerQuery.data?.toString()],
    queryFn: async () => {
      if (!actor || !partnerQuery.data) return null;
      return actor.getUserProfile(partnerQuery.data);
    },
    enabled: !!actor && !!partnerQuery.data,
    retry: false,
  });

  return {
    partner: partnerQuery.data,
    partnerProfile: partnerProfileQuery.data,
    partnerName: partnerProfileQuery.data?.name,
    partnerCountry: partnerProfileQuery.data?.country,
    partnerAvatar: partnerProfileQuery.data?.avatar,
    isPaired: !!partnerQuery.data,
    isLoading: actorFetching || partnerQuery.isLoading,
    isError: partnerQuery.isError,
  };
}
