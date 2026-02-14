/**
 * Maps relationship status strings to Tailwind color classes for the heart icon.
 * Returns a neutral color for null/unknown statuses.
 */

export type RelationshipStatusType = 
  | 'Friendship'
  | 'Almost Something'
  | 'Situationship'
  | 'Relationship'
  | 'Engaged'
  | 'Married';

interface StatusColorConfig {
  textColor: string;
  fillColor: string;
}

const STATUS_COLOR_MAP: Record<RelationshipStatusType, StatusColorConfig> = {
  'Friendship': {
    textColor: 'text-amber-500',
    fillColor: 'fill-amber-500',
  },
  'Almost Something': {
    textColor: 'text-pink-400',
    fillColor: 'fill-pink-400',
  },
  'Situationship': {
    textColor: 'text-purple-400',
    fillColor: 'fill-purple-400',
  },
  'Relationship': {
    textColor: 'text-rose-500',
    fillColor: 'fill-rose-500',
  },
  'Engaged': {
    textColor: 'text-red-500',
    fillColor: 'fill-red-500',
  },
  'Married': {
    textColor: 'text-red-600',
    fillColor: 'fill-red-600',
  },
};

const DEFAULT_COLOR: StatusColorConfig = {
  textColor: 'text-muted-foreground',
  fillColor: 'fill-muted-foreground',
};

export function getRelationshipStatusColors(status: string | null | undefined): StatusColorConfig {
  if (!status) {
    return DEFAULT_COLOR;
  }

  return STATUS_COLOR_MAP[status as RelationshipStatusType] || DEFAULT_COLOR;
}
