import type { CheckIn } from '../backend';

/**
 * Get the latest check-in from a list of check-ins for a specific author
 */
export function getLatestCheckInByAuthor(
  checkIns: CheckIn[],
  authorPrincipal: string
): CheckIn | null {
  const authorCheckIns = checkIns.filter(
    (checkIn) => checkIn.author.toString() === authorPrincipal
  );

  if (authorCheckIns.length === 0) return null;

  return authorCheckIns.reduce((latest, current) =>
    current.timestamp > latest.timestamp ? current : latest
  );
}
