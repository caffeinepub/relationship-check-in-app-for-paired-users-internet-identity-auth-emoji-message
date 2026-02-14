import { useQuery } from '@tanstack/react-query';
import { useActor } from '../../hooks/useActor';
import type { RelationshipStatus } from '../../backend';

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

  const hasStatus = statusQuery.data !== null;
  const statusValue = statusQuery.data?.status;

  return {
    relationshipStatus: statusQuery.data,
    hasStatus,
    statusValue,
    isLoading: actorFetching || statusQuery.isLoading,
    isFetched: !!actor && statusQuery.isFetched,
  };
}
