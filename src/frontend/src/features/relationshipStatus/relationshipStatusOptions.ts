export const RELATIONSHIP_OPTIONS = [
  'Friendship',
  'Almost Something',
  'Situationship',
  'Relationship',
  'Engaged',
  'Married',
] as const;

export type RelationshipOption = typeof RELATIONSHIP_OPTIONS[number];
