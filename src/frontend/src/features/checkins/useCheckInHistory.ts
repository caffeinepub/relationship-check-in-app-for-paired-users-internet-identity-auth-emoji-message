import { useQuery } from '@tanstack/react-query';
import { useActor } from '../../hooks/useActor';
import type { CheckIn } from '../../backend';

export function useCheckInHistory(limit: number = 30) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<CheckIn[]>({
    queryKey: ['checkInHistory', limit],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCheckInHistory(BigInt(limit));
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}
