---
name: commit-only-on-go-ahead
description: Never create git commits without the user's explicit authorization
metadata:
  type: feedback
---

Do **not** create git commits unless the user explicitly authorizes it.

**Why:** On life-expenses the user deliberately left the entire MVP uncommitted; the handoff records "commit on the user's go-ahead."

**How to apply:** Prepare or stage changes if useful, but pause for an explicit "commit" / "go ahead" before running `git commit`.
