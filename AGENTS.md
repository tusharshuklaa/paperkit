## Agent Behavior
- Think and state assumptions before coding; ask if requirements or behavior are ambiguous. If multiple interpretations exist, present them - don't pick silently.
- Match existing style; mention unrelated issues instead of fixing them. If you notice unrelated dead code, mention it; don't delete it.
- Define success criteria. Loop until verified. Strong success criteria let you loop independently; weak criteria ("make it work") require constant clarification.

## Coding Discipline

- Use existing helpers, standard library, native platform features, then installed dependencies before new code.
- Fix root cause once in shared owner. Search every caller before changing shared behavior.
- Avoid unrequested abstractions, dependencies, boilerplate, and unrelated refactors.
- Keep changes small. Validate affected behavior with one runnable check for non-trivial logic.
- Validate trust boundaries, data-loss paths, security, and accessibility.
- One export per file. Allowed companions: that export's Props/param/result types, a type derived from it, Next `metadata` beside a page/layout, a context hook beside its provider. Barrels (`index.ts`) re-export only.
- File names: components `PascalCase.tsx`, hooks `useX.ts` in `src/hooks/`, everything else kebab-case named after its export. A private hook used by one component may stay in that component's file.
- Layout stability: reserve space for content that appears later (errors, status, async data); `tabular-nums` for changing numbers; same font weight and border width across states (change color, not size); fixed media dimensions; animate `transform`/`opacity` only.
- Forms: one Zod schema per form in `lib/<area>/`. Client form and Server Action parse with that schema; server parse decides.
- Tests go in the nearest `__tests__/` folder, one `<module>.test.ts` per module.

## Response Style
- Drop articles (a/an/the), filler (just/really/basically/actually/simply), pleasantries (sure/certainly/happy to), and hedging. Fragments OK. Short synonyms (big not extensive; fix not "implement a solution for").
- Pattern: [thing] [action] [reason]. [next step]. Prefer bullets and short tables over long prose.
- Abbreviate prose words (DB/auth/config/req/res/fn/impl); use arrows for causality (X → Y); one word when one word does.
- Keep code, commands, errors, paths, env vars, identifiers, and technical terms exact; never abbreviate or rephrase these.
- For risky, destructive, or security-sensitive actions, prefer clarity over compression.
- Example. Bad: "Sure! The component re-renders because the parent passes a new object prop on every render, so React sees a change." Good: "New object ref each render → re-render. Wrap prop in useMemo."

---

<!-- fallow:setup-hooks:start -->
## Fallow checks

Use fallow for code-quality, cleanup, and setup tasks in this repository. Fallow checks the changed code before each `git commit` and `git push`. In Claude Code and Codex, a PreToolUse hook from `fallow agent install` runs this check and blocks the command when the verdict is `fail`. Other agents run the check themselves: `fallow audit --format json --quiet --explain --gate-marker agent`. If the verdict is `fail`, fix the reported findings before you try again. A JSON runtime error such as `{ "error": true, ... }` does not block.

Audit defaults to `gate=new-only`: only findings introduced by the current changeset affect the verdict. Inherited findings on touched files are reported under `attribution` and annotated with `introduced: false`, but do not block the commit. Set `[audit] gate = "all"` in `fallow.toml` to gate every finding in changed files.

For non-skill agents, treat the task map below as the local onboarding source: run the listed fallow command before destructive edits, before commits, and before pull request handoff.

## Fallow task map

| When the agent is about to... | Run |
|---|---|
| delete an "unused" export or file | `fallow dead-code --trace <file>:<export>` |
| prove a TypeScript symbol's exact consumers before refactoring | `fallow dead-code --type-aware --symbol-impact <file>:<export-or-class.method>` |
| find how one module reaches another | `fallow trace --path <from> <to>` (Reports `reachable: false` instead of failing when no import path exists; type-only hops are reported, not skipped.) |
| delete an "unused" dependency | `fallow dead-code --trace-dependency <name>` |
| migrate a dependency | `fallow trace --dependency <name> --sites` (Counts each imported name, follows one hop through project wrappers, and counts each use that it cannot resolve.) |
| commit or open a PR | `fallow audit --base <ref>` |
| read a diff before approving it | `fallow review --base <ref> --brief` (orientation, never gates: deterministic and always exit 0, unlike the audit row) |
| prioritize refactoring | `fallow health --hotspots --targets` |
| ask who owns code | `fallow health --ownership` |
| check untested-but-reachable code | `fallow health --coverage-gaps` |
| consolidate duplication | `fallow dupes --trace dup:<fingerprint>` |
| find feature flags | `fallow flags` |
| check which architecture rules apply to a file before changing it | `fallow guard <files>` |
| check import cycles, boundaries and policy rules after changing code | `fallow architecture` |
| surface security candidates | `fallow security` |
| understand a finding | `fallow explain <issue-type>` |
| scope a monorepo | `--workspace <glob> / --changed-workspaces <ref>` (global flags, prefix any command) |
<!-- fallow:setup-hooks:end -->

## Agent skills

### Issue tracker

Issues live in this repo's GitHub Issues; use `gh`. See `docs/agents/issue-tracker.md`.

### Triage labels

Use `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, and `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Use the multi-context layout. See `docs/agents/domain.md`.
