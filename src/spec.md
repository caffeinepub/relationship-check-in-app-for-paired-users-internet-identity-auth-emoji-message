# Specification

## Summary
**Goal:** Add premium gating so free users can submit only 1 check-in per day while premium users can submit multiple daily check-ins.

**Planned changes:**
- Add a persistent `premium` boolean flag to the backend user model (default false) and a query to fetch the current caller’s premium status.
- Add a backend method to set/update a user’s premium status under a controlled authorization rule (no payment integration).
- Enforce daily check-in limits in the backend: free users are limited to 1 check-in per day with a clear rejection message; premium users can submit multiple.
- Update frontend data fetching with a React Query hook for premium status and adjust the check-in composer UI to show a limit/completed state for free users after 1 check-in while keeping it available for premium users.
- Update “Today’s Status” UI to handle multiple same-day check-ins by showing the latest check-in per person (and optionally a count), without breaking for 0/1/many cases.

**User-visible outcome:** Free users can check in once per day and see an English message that additional same-day check-ins are a premium feature; premium users can submit multiple check-ins per day and the “Today’s Status” view reflects the latest updates correctly.
