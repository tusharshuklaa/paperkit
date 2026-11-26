# Agent Tooling

## First-Time Setup

1. Run `bun install` for repo-local Fallow and existing JS tools.
2. Install Context7 from VS Code's recommended extensions (`upstash.context7-mcp`).
3. Keep `context7.apiKey` in user settings or ignored `.vscode/settings.json`.
4. Install Graphify with `uv tool install 'graphifyy[mcp]==0.9.102'` (Python 3.10+).
5. Use shared Graphify and Context7 instructions in `AGENTS.md` with any harness.
6. Run `bun run graphify:build` to create the local code graph.
7. Open **MCP: List Servers** in VS Code and start/trust Fallow, Graphify, and Context7.

Context7 registers through its extension, not `.vscode/mcp.json`. Fallow and
Graphify use repo-scoped stdio servers in that file. VS Code must inherit a PATH
containing `graphify-mcp`; after a fresh uv install, run `uv tool update-shell`
and restart VS Code if needed.

## Commands

| Command | Purpose |
| --- | --- |
| `bun run fallow` | Full repo analysis |
| `bun run fallow:audit` | Changed-code quality gate |
| `bun run fallow:audit --base <ref>` | Compare against a chosen Git ref |
| `bun run graphify:build` | Build code-only graph locally; no API key or LLM calls |
| `bun run graphify:update` | Refresh code graph after edits |
| `bun run graphify:query "<question>"` | Query graph from terminal |

Fallow auto-detects Next.js, React, and workspace entry points. Biome remains
responsible for lint/format, TypeScript for types. Default cleanup/style warnings
remain advisory; opt-in checks stay off. CI runs only after a PR from `develop`
into `main` is merged. It audits the exact merge commit against the PR base,
without a baseline file. This post-merge check does not block the merge.

Graph files and caches stay local under ignored `graphify-out/`. Scripted builds
skip clustering and semantic extraction; `/graphify` supports richer agent-driven
graphs. `.graphifyignore` excludes Markdown, template docs, agent tooling, and
design references. After deleting source or narrowing scope, run
`bun run graphify:build --force` to allow the generated graph to shrink.

If Fallow's agent status reports stale hooks because PATH resolves an older
global binary, align it with the repo version or remove that global installation
so hooks can fall back to `node_modules/.bin/fallow`.
