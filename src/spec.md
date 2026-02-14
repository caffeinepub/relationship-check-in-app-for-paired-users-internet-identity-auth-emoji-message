# Specification

## Summary
**Goal:** Let users select a country via an interactive map (with a searchable fallback) and persist the selected country on their user profile.

**Planned changes:**
- Extend the backend `UserProfile` model to include an optional persisted `country` field and return it from existing profile query methods.
- Update `saveCallerUserProfile` to allow updating user-editable fields (at minimum: `name` and `country`) while preserving server-managed/pairing-related fields (`premium`, `partner_ref`, `relationship_status`, `can_set_relationship_status`, `streak_count`, `last_checkin_date`).
- Add a safe backend migration (only if needed) to initialize `country` to `null`/unset for existing users without changing other fields.
- Add a frontend country selector using a map-based interaction with a searchable dropdown/list fallback, wired into the existing profile save flow and React Query refresh.
- Add a Settings area for already-onboarded users to view and update their saved country (English UI text).

**User-visible outcome:** Users can choose their country during profile setup (via map or searchable list) and later change it in Settings; the chosen country is saved to their profile and persists across reloads.
