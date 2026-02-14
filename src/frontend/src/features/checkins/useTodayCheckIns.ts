import { useQuery } from '@tanstack/react-query';
import { useActor } from '../../hooks/useActor';
import type { CheckIn } from '../../backend';

export function useTodayCheckIns() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<CheckIn[]>({
    queryKey: ['todayCheckIns'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getTodayCheckIns();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}
