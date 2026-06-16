---
name: handoff-md-source-of-truth
description: handoff.md is the project's single source of truth; update it after every meaningful task
metadata:
  type: feedback
---

The user runs a strict persistent-memory contract: a `handoff.md` file is the **single source of truth for cross-session memory**. Anything not written to it is treated as lost.

**Why:** Sessions are assumed to have no memory beyond what's in the repo.

**How to apply:** Read `handoff.md` first each session; after every meaningful task update it — research log, decisions, a dated session-memory entry, TODOs, and the `# Session Handoff` snapshot (kept at the end of Part I). See [[project-life-expenses]].
