---
name: user-tech-preferences
description: User's stack preferences — JS/TS over Python, and no-extra-toolchain solutions
metadata:
  type: user
---

Prefers **JavaScript/TypeScript** over Python for application/UI work. Strongly favors solutions that need **no extra toolchain or system installs** — on the life-expenses project the user chose WASM SQLite (`node-sqlite3-wasm`) specifically to avoid installing Visual Studio Build Tools for a native module.

Machine baseline (Windows 11): Node, npm, Python, Git, winget present; **no Rust, no .NET, no Visual Studio**. Rule out approaches that require those unless the user agrees to install them.

See [[project-life-expenses]].
