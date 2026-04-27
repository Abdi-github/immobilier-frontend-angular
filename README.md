# immobilier-frontend-angular

Angular 21 frontend for the Swiss real estate platform. Consumes the `immobilier-api-node` REST API.

## Stack

- **Angular 21** — standalone components, functional guards, signal-based state
- **@ngrx/signals** — lightweight reactive store (no actions/effects boilerplate)
- **@ngx-translate/core** — multi-language support (en, fr, de, it)
- **Angular Material 21** — component library
- **Tailwind CSS v4** — utility-first CSS with CSS-first config
- **Leaflet** — interactive property maps
- **Docker + Nginx** — production deployment
- **Traefik** — reverse proxy / SSL termination

## Prerequisites

- Node.js 22+
- Docker & Docker Compose (for containerized dev/prod)
- Access to a running `immobilier-api-node` instance

## Local development

```bash
# Install dependencies
npm install

# Start the dev server (proxies /api/v1 → http://localhost:4003)
npm start
```

Open [http://localhost:4200](http://localhost:4200) for local `npm start`, or [http://localhost:4203](http://localhost:4203) for the Docker dev container.

## Available scripts

| Command | Description |
|---------|-------------|
| `npm start` | Dev server with hot reload |
| `npm run build` | Development build |
| `npm run build:prod` | Production build (output: `dist/`) |
| `npm run lint` | ESLint |
| `npm run type-check` | TypeScript type check (no emit) |
| `npm test` | Karma unit tests |

## Running with Docker

```bash
# Development (port 4203)
docker compose up --build

# Production (Traefik labels, domain immobilier-angular.swiftapp.ch)
docker compose -f docker-compose.prod.yml up -d --build
```

## Project structure

```
src/
  app/
    core/           Models, services, interceptors, guards
    state/          NgRx signal stores (auth, language, ui, search)
    shared/         Reusable pipes and components
    layouts/        Main, Auth, Dashboard layout shells
    features/
      home/
      properties/
      agencies/
      auth/
      dashboard/
      property-management/
      static/       About, Contact, Terms, Privacy
  assets/
    i18n/           Translation files (en/fr/de/it × 7 namespaces)
    leaflet/        Marker icons
```

## i18n

Translations live under `src/assets/i18n/{lang}/{namespace}.json`.
Namespaces: `common`, `home`, `properties`, `agencies`, `auth`, `dashboard`, `static`.

## Deployment

Pushes to `main` trigger the GitHub Actions workflow (`.github/workflows/deploy.yml`).
The workflow runs lint/type-check/build, then SSH-deploys to `/opt/apps/immobilier-frontend-angular` on the VPS.

Required GitHub secrets: `VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY`.

## Auth

JWT Bearer tokens stored in `localStorage`. The auth interceptor handles token refresh transparently on 401 responses.
