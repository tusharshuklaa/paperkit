# Single-Domain Tool Routes

PaperKit hosts its catalog and document tools under one domain in one Next.js deployment. Tool-specific code remains in its own workspace, while `apps/web` exposes each tool through a route and declares its workspace dependency. The platform header and footer have one implementation shared across routes and development previews.

This supersedes [Separate Apps for Document Generators](0001-separate-tool-apps.md). A single deployment avoids coordinating multiple deployments, proxies, and Next.js asset routing for a product that has not yet launched. Independent tool previews may remain useful during development, but are not the public deployment model.

The registry can reference same-origin paths. A working local route is required before marking a tool Live; the actual HTTPS deployment and canonical origin must still be verified before release.
