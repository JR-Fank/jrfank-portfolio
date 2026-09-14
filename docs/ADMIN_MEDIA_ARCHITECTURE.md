# Future Online Media Admin Architecture

Status: contract only; no Admin UI, authentication, upload endpoint, Worker, Pages Function, or GitHub integration is implemented in this phase.

The future Admin is a separate protected runtime surface. Cloudflare Access authenticates the owner before a trusted backend issues narrowly scoped, short-lived upload authorization. The browser uploads directly to R2, while all R2 and GitHub credentials remain in the trusted runtime—not JavaScript, HTML, local storage, or public environment variables.

```text
protected browser Admin
  → Cloudflare Access identity
  → trusted Admin backend validates project/role/size/type
  → short-lived authorization for one immutable R2 object key
  → browser uploads derivative directly to R2
  → backend verifies object and prepares metadata/manifest Git commit
  → GitHub pull request / Cloudflare Pages preview
  → owner review
  → separately approved production merge
```

The owner experience should eventually be: select project, drag photos/video, assign a constrained role, enter English and Traditional Chinese metadata, reorder, save, review upload/manifest changes, inspect a Pages preview, and approve production.

The Admin must reuse the repository intake schema and finite role vocabulary. It may edit semantic metadata and order, but never layout coordinates, CSS, GSAP settings, raw HTML, arbitrary object keys, or camera filenames. Upload authorization must bind a normalized content hash to a single `v1/<scope>/<project>/<role>/...` key and must never allow overwriting an existing hashed object.

The public portfolio remains the current static Next.js export. It imports the committed manifest during build, performs no R2 query at build/runtime, and gains no authentication, Server Actions, API routes, SSR, ISR, database, or embedded GitHub/R2 credential as a consequence of the Admin.

Open decisions for the later subphase: Admin hostname/runtime, Access policy, GitHub App versus other server-side commit integration, preview-domain policy, object-size limits, resumable video upload, approval roles, audit log/retention, and recovery from an uploaded object whose Git commit is rejected.
