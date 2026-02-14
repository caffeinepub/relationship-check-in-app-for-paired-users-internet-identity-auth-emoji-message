import { useQuery } from '@tanstack/react-query';
import { useActor } from '../../hooks/useActor';

export function useHasPremium() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['hasPremium'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.hasPremium();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}
