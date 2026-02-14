# Specification

## Summary
**Goal:** Simplify country selection to a searchable selector and surface paired users’ countries in the global header with a relationship-status-colored heart.

**Planned changes:**
- Remove the interactive world map from country selection and replace it with a searchable country selector (dropdown/command search) in both profile setup and Settings > Country edit, using the existing ISO-3166-1 alpha-2 dataset and existing save flow.
- Update English helper text in country selection screens to remove any mention of interacting with a map.
- Add a conditional global header element that shows the current user’s flag, a heart icon, and the partner’s flag only when authenticated, paired, and both users have saved countries.
- Color the heart icon based on the current shared relationship status (Friendship, Almost Something, Situationship, Relationship, Engaged, Married), falling back to a neutral/default color when status is absent.

**User-visible outcome:** Users pick their country via a searchable selector (no map). When paired and both have selected countries, the app header displays both flags with a heart between them whose color reflects the relationship status.
