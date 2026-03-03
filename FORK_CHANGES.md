# Archevi Support - Fork Changes from Peppermint

**Base version:** v0.5.5
**Upstream:** https://github.com/Peppermint-Lab/peppermint
**Fork:** https://github.com/robhdsndsn/archevi-support
**Branch:** `archevi-brand`

## What Changed

### Removed
- `apps/docs/` -- documentation site (unused)
- `apps/landing/` -- marketing landing page (unused)
- `nextra` and `nextra-theme-docs` from root `package.json` dependencies
- GitHub releases links, Discord links, "Send Feedback" buttons from all layouts
- "Built with ... by Peppermint Labs" footer from auth pages

### Rebranded (~20 files)
| File | Changes |
|------|---------|
| `apps/client/pages/_document.js` | Title: "Archevi Support", meta description |
| `apps/client/pages/auth/login.tsx` | Heading, footer link to archevi.com |
| `apps/client/pages/auth/register.tsx` | Footer link to archevi.com |
| `apps/client/pages/auth/reset-password.tsx` | Footer link to archevi.com |
| `apps/client/pages/auth/forgot-password.tsx` | Logo/link, footer link |
| `apps/client/pages/onboarding.tsx` | Welcome text, links to archevi.com |
| `apps/client/pages/admin/index.js` | Brand name "Archevi Support" |
| `apps/client/pages/index.tsx` | Version badge (no external link) |
| `apps/client/layouts/newLayout.tsx` | Sidebar "Archevi", removed feedback/releases links |
| `apps/client/layouts/shad.tsx` | Removed feedback/releases links |
| `apps/client/layouts/adminLayout.tsx` | Sidebar "Archevi", removed feedback/releases links |
| `apps/client/layouts/portalLayout.tsx` | Sidebar "Archevi" |
| `apps/client/@/shadcn/components/app-sidebar.tsx` | Header "Archevi", team name |
| `apps/client/components/ThemeSettings/index.tsx` | "Light" / "Dark" (no "Peppermint" prefix) |
| `apps/client/components/AccountDropdown/index.tsx` | GitHub link -> archevi.com |
| `apps/client/components/NotificationsSettingsModal/index.js` | Placeholder email |
| `apps/client/public/manifest.json` | PWA name "Archevi Support" |
| `apps/client/styles/globals.css` | Primary color -> Archevi blue (217 91% 60%) |
| `apps/api/src/prisma/seed.js` | Email template branding (4 templates) |
| `apps/api/src/lib/nodemailer/auth/forgot-password.ts` | Password reset email footer |
| `apps/api/src/controllers/ticket.ts` | Webhook username |
| `apps/api/src/lib/notifications/webhook.ts` | Discord embed author |

### Assets Replaced
| File | Description |
|------|-------------|
| `static/logo.svg` | Archevi logo |
| `static/black-logo.svg` | Archevi logo |
| `static/black-side-logo.svg` | Archevi logo |
| `apps/client/public/logo.svg` | Archevi logo |
| `apps/client/public/favicon/favicon.ico` | Generated from Archevi logo |
| `apps/client/public/favicon/favicon-16x16.png` | Generated from Archevi logo |
| `apps/client/public/favicon/favicon-32x32.png` | Generated from Archevi logo |
| `apps/client/public/favicon/android-chrome-192x192.png` | Generated from Archevi logo |
| `apps/client/public/favicon/android-chrome-512x512.png` | Generated from Archevi logo |
| `apps/client/public/favicon/apple-touch-icon.png` | Generated from Archevi logo |

## What Stays Unchanged
- All Peppermint API routes (`/api/v1/*`)
- i18n namespace: `peppermint` (internal, changing would touch dozens of files)
- Database name: `peppermint` (renaming would break Prisma migrations)
- Env vars: `PEPPERMINT_URL`, `PEPPERMINT_EMAIL`, `PEPPERMINT_PASSWORD`
- Root package.json `workspaces` narrowed to `apps/api`, `apps/client`, `packages/*`

## Syncing with Upstream
```bash
git fetch upstream
git merge upstream/main --no-commit
# Resolve conflicts in branded files (~20 files)
git commit -m "sync: merge upstream changes"
```
