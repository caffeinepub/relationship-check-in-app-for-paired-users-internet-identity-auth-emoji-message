# Specification

## Summary
**Goal:** Let paired users change their relationship status after it has been initially set, while keeping the initial selection restricted to the invited user.

**Planned changes:**
- Backend: adjust relationship-status update rules so only the invited user can set the initial status, but either paired user can change it once a status exists; persist updates to both user profiles and return clear errors for unauthorized calls.
- Frontend: update relationship-status mutation handling to support both initial-set and subsequent-change flows, including clear English errors and React Query invalidation/refetch so the status and heart color update immediately.
- Frontend Settings: add a “Change Relationship Status” control visible only when paired and a status exists, reuse the existing status options, and show an English success toast after saving.

**User-visible outcome:** If you’re paired and a relationship status is already set, you can change it from Settings and both profiles (and the heart/status UI) update immediately; if it’s not set yet, only the invited user can set it initially.
