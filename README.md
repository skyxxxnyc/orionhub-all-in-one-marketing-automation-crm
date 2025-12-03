# OrionHub

OrionHub is a fully-featured, enterprise-grade marketing automation + CRM platform built to run at the Cloudflare edge using Cloudflare Workers and a single Durable Object for storage. The product targets agencies and SMBs that need contact management, sales pipelines, automations, email & SMS campaigns, funnels/landing pages, scheduling, a unified inbox, multi-tenant (agency + sub-account) workflows and actionable analytics.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/skyxxxnyc/orionhub-all-in-one-marketing-automation-crm)

## Features

- **Auth & Identity**: Secure authentication with role-based access control (Admin, User, Client) and workspace switching.
- **Contacts & CRM**: Contact lists, detailed profiles, activity timelines, CSV import/export, tagging, custom fields, deduplication, and bulk actions.
- **Sales Pipeline**: Visual kanban boards with drag-and-drop stages, deal management, revenue forecasting, and analytics.
- **Automations & Workflow Builder**: Drag-and-drop visual builder for triggers, actions, conditional logic, A/B testing, and journey visualization.
- **Email & SMS Marketing**: Template libraries, drag-and-drop builders, campaign scheduling, delivery tracking, analytics, and compliance features.
- **Funnels & Landing Pages**: Responsive page builder with templates, A/B testing, conversion analytics, and custom domain support.
- **Calendar & Scheduling**: Team calendars, booking widgets, availability management, reminders, and sync integrations.
- **Unified Inbox**: Aggregated conversations across channels, threading, assignments, status tracking, and response analytics.
- **Reporting & Dashboard**: Customizable widgets, performance metrics, forecasting reports, and data exports.
- **Integrations & API**: Webhooks, API keys, Stripe payments, third-party connectors (Zapier-style), and data import/export.
- **Multi-Tenant & White-Label**: Agency sub-accounts, branding customization, resource tracking, and data isolation.
- **Edge-Optimized**: Serverless architecture with low-latency data persistence via Cloudflare Durable Objects.

The project follows an iterative delivery roadmap, starting with a polished frontend foundation and expanding to full backend integrations.

## Tech Stack

- **Frontend**: React 18, React Router 6, TypeScript, shadcn/ui (Radix UI primitives), Tailwind CSS 3, Framer Motion (animations), Lucide React (icons), TanStack React Query (data fetching), React Hook Form + Zod (forms), Recharts (charts), Sonner (toasts), Cmdk (command palette), Date-fns (dates).
- **Backend**: Hono (routing), Cloudflare Workers (serverless runtime), Durable Objects (stateful storage), Immer (immutable updates).
- **Tools & Utilities**: Vite (build tool), Bun (package manager), ESLint + TypeScript (linting/type safety), PapaParse (CSV handling), UUID (IDs), Zustand (state management).
- **Integrations**: Stripe (payments, placeholders), React Flow (workflow builder), @dnd-kit (drag-and-drop).

Full dependencies are listed in `package.json`.

## Quick Start

### Prerequisites

- [Bun](https://bun.sh/) (recommended for fast installs and dev server)
- [Cloudflare Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) (for deployment)
- Node.js 18+ (if using alternatives to Bun)

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd orionhub
   ```

2. Install dependencies with Bun:
   ```
   bun install
   ```

3. Generate TypeScript types from Wrangler bindings:
   ```
   bun run cf-typegen
   ```

The project is now ready for development.

## Development

### Running the Dev Server

Start the local development server (frontend + mocked worker APIs):

```
bun run dev
```

- Opens at `http://localhost:3000` (or configured port).
- Hot reload enabled for React changes.
- Worker routes (`/api/*`) are handled by the bundled Hono app with mock data persistence via Durable Objects.

### Key Development Commands

- **Build for Production**:
  ```
  bun run build
  ```

- **Preview Production Build**:
  ```
  bun run preview
  ```

- **Lint Code**:
  ```
  bun run lint
  ```

- **Type Check**:
  ```
  bunx tsc --noEmit
  ```

### Project Structure

- `src/`: React frontend (pages, components, hooks, lib).
- `worker/`: Hono-based backend (routes, entities, utils).
- `shared/`: Shared types and mock data between frontend/backend.
- `src/components/ui/`: shadcn/ui components (do not modify).
- `src/pages/`: Main application pages (extend/replace as needed).

### Adding Features

1. **Frontend Pages**: Use React Router in `src/main.tsx`. Wrap authenticated routes with `AppLayout` for sidebar/header.
2. **API Endpoints**: Extend `worker/user-routes.ts` using entity patterns from `worker/entities.ts` and helpers in `worker/core-utils.ts`.
3. **Data Models**: Define types in `shared/types.ts`. Create entities extending `IndexedEntity` for CRUD with indexing.
4. **Mock Data**: Seed initial data in `shared/mock-data.ts` and use in entity `seedData`.
5. **State Management**: Use Zustand for global state (follow primitive selector rules to avoid re-render loops).
6. **Styling**: Leverage Tailwind utilities and shadcn components. Custom themes in `tailwind.config.js`.

### Testing Locally

- Use browser dev tools for React debugging.
- Test API routes with tools like Postman or curl (e.g., `curl http://localhost:8787/api/users`).
- Mock auth with localStorage tokens for Phase 1 flows.

Ensure no infinite loops: Follow React/Zustand best practices (e.g., primitive selectors only).

## Deployment

Deploy to Cloudflare Workers for edge execution:

1. **Login to Cloudflare**:
   ```
   wrangler login
   ```

2. **Configure Secrets** (if needed, e.g., API keys):
   ```
   wrangler secret put <SECRET_NAME>
   ```

3. **Deploy**:
   ```
   bun run deploy
   ```

   This builds the frontend assets, bundles the worker, and deploys to your Cloudflare account. The app will be available at `<your-worker>.<your-subdomain>.workers.dev`.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/skyxxxnyc/orionhub-all-in-one-marketing-automation-crm)

### Post-Deployment

- **Custom Domain**: Use Wrangler to bind a custom domain.
- **Environment Variables**: Manage via Wrangler secrets for production configs (e.g., Stripe keys).
- **Migrations**: Durable Object schemas auto-migrate on deploy.
- **Monitoring**: Enable Cloudflare observability in `wrangler.jsonc` for logs and metrics.

For production, replace mock auth/data with real integrations (e.g., Bolt DB for auth, external ESPs for email/SMS).

## Contributing

1. Fork the repo and create a feature branch (`git checkout -b feature/amazing-feature`).
2. Commit changes (`git commit -m 'Add some amazing feature'`).
3. Push to the branch (`git push origin feature/amazing-feature`).
4. Open a Pull Request.

Follow the roadmap in the blueprint for phase-based contributions. Ensure code adheres to TypeScript strict mode and no runtime errors.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- Issues: [GitHub Issues](https://github.com/issues)
- Discussions: [GitHub Discussions](https://github.com/discussions)
- For commercial support or custom features, contact the development team.

Built with ❤️ at Cloudflare.