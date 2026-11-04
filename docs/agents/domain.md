# Domain Docs

## Before exploring

- Read `GLOSSARY-MAP.md` at the repo root and the glossary for each context relevant to the task.
- Read relevant system-wide decisions in `docs/adr/`.
- Check the context's `docs/adr/` for context-specific decisions.
- If these docs do not exist yet, proceed; create them when terminology or decisions are resolved.

## Layout

This is a multi-context repo. `GLOSSARY-MAP.md` points to context glossaries, such as those belonging to `apps/web` or domain-bearing packages under `packages/`. Keep system-wide ADRs in `docs/adr/`; keep context-specific ADRs under that context's `docs/adr/`.

## Vocabulary and decisions

Use glossary terms in issue titles, hypotheses, refactor proposals, and tests. If a needed concept is missing, note the gap for domain modeling.

When a proposal conflicts with an existing ADR, identify the ADR and explain why it may be worth revisiting.
