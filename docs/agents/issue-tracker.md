# Issue tracker: GitHub

Issues and specs live in this repo's GitHub Issues. Use `gh` from this checkout.

## Conventions

- Create: `gh issue create --title "..." --body "..."`
- Read: `gh issue view <number> --json number,title,body,labels,comments`
- List: `gh issue list --state open`
- Comment: `gh issue comment <number> --body "..."`
- Add/remove labels: `gh issue edit <number> --add-label "..."` / `--remove-label "..."`
- Close: comment with the resolution, then run `gh issue close <number>`.
- Use GitHub sub-issues for parent/child work where available. Represent blockers with GitHub issue dependencies; otherwise note them in the issue body.
- Infer the repository from `git remote -v`. Before creating issues, verify the target with `gh repo view --json nameWithOwner`.

## Pull requests as a triage surface

**PRs as a request surface: no.**

When a skill says to publish to the issue tracker, create a GitHub issue. When it says to fetch a ticket, read the corresponding issue.
