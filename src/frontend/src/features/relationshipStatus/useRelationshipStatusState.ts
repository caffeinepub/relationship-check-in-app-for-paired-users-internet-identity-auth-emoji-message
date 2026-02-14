import { useQuery } from '@tanstack/react-query';
import { useActor } from '../../hooks/useActor';
import type { RelationshipStatus, UserProfile } from '../../backend';

export function useRelationshipStatusState() {
  const { actor, isFetching: actorFetching } = useActor();

  const statusQuery = useQuery<RelationshipStatus | null>({
    queryKey: ['relationshipStatus'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getRelationshipStatus();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  const profileQuery = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  const isChooser = profileQuery.data?.can_set_relationship_status === true;
  const hasStatus = statusQuery.data !== null;
  const statusValue = statusQuery.data?.status;

  return {
    relationshipStatus: statusQuery.data,
    isChooser,
    hasStatus,
    statusValue,
    isLoading: actorFetching || statusQuery.isLoading || profileQuery.isLoading,
    isFetched: !!actor && statusQuery.isFetched && profileQuery.isFetched,
  };
}
