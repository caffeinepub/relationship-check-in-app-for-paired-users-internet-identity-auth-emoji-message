# Specification

## Summary
**Goal:** Add persisted profile avatars so users can create/select an avatar, save it to their profile, and see both their own and their partner’s avatar in paired UI contexts.

**Planned changes:**
- Extend the backend `UserProfile` model to include a persisted avatar field and return it from `getCallerUserProfile` and `getUserProfile`.
- Update `saveCallerUserProfile` to allow setting/updating the avatar while preserving all server-managed and pairing/relationship/streak fields as currently handled.
- Add a conditional backend migration to safely initialize the new avatar field for existing persisted profiles during upgrade.
- Add frontend UI in profile setup and/or Settings to create/select an avatar and save it through the existing profile save flow, with React Query refetch/invalidation to show changes without full reload.
- Render the caller and partner avatars in paired identity contexts (e.g., header/connection area) using existing profile queries, with consistent fallback when an avatar is unset.

**User-visible outcome:** Authenticated users can choose/change an avatar in their profile, and when paired they will see both their own and their partner’s avatar displayed with sensible placeholders when missing.
