# Specification

## Summary
**Goal:** Ensure the app supports selecting any country worldwide and enforces country selection as a mandatory part of user profile setup.

**Planned changes:**
- Expand the frontend `COUNTRIES` dataset to a complete ISO 3166-1 alpha-2 list, ensuring unique codes, non-empty names, and alphabetical sorting.
- Update the onboarding gating logic so authenticated users without a saved country are forced into the profile setup flow and cannot access normal app views until a country is selected and saved.
- Keep the Profile Setup submit action disabled until both a non-empty name and a selected country are provided, with all validation/error messaging in English.
- Enforce backend validation in `saveCallerUserProfile` to reject saves with missing/empty `country`, while preserving existing server-managed fields on save.
- Update the frontend profile save flow to always submit a valid selected country when required and to display a clear English error message if the backend rejects a save due to missing country.

**User-visible outcome:** Users can search and select from all world countries, and they must choose and save a country (and name) before they can use the app; attempts to save without a country are blocked with clear English feedback.
