# Separate Apps for Document Generators

Each PaperKit document generator is a separate Next.js app under `apps/<slug>`. `apps/web` owns the platform shell and catalog, not generator screens; workspace packages provide shared foundations. This preserves distinct tool applications instead of adding every generator as a route inside the shell.

Each tool has its own app build and independent deployment when ready, with its verified destination recorded in the shared tool registry. All source stays in this monorepo. The shell links to tools rather than composing their runtimes; shared packages are build-time dependencies.

This phase adds no hosting configuration, shared-domain routing, or microfrontends and invents no destination URLs. Specific hosting providers, domains, and URLs are deferred until deployment is needed.
