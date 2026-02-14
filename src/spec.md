# Specification

## Summary
**Goal:** Remove the “© {year} HeartSync. Built with [heart icon] using caffeine.ai” attribution line from the shared app footer while keeping “Created by Angelica Arboleda”.

**Planned changes:**
- Update the shared layout/footer component to stop rendering the HeartSync/caffeine.ai attribution text.
- Remove the heart icon and the outbound caffeine.ai link from the footer across all screens using the shared layout.
- Verify the footer still displays “Created by Angelica Arboleda”.

**User-visible outcome:** The footer no longer shows any HeartSync/caffeine.ai “Built with … using caffeine.ai” attribution (including icon/link), and still shows “Created by Angelica Arboleda”.
