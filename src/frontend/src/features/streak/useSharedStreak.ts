import { useQuery } from '@tanstack/react-query';
import { useActor } from '../../hooks/useActor';

export function useSharedStreak() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<number>({
    queryKey: ['streak'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      const streak = await actor.getSharedStreak();
      return Number(streak);
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}
