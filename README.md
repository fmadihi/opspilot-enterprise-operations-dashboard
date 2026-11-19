# OpsPilot — Enterprise Operations Management Platform

A portfolio-grade full-stack operations dashboard built to demonstrate frontend architecture, typed UI development, schema-driven forms, REST integration, authentication, automated testing, and performance-conscious React patterns.

> **Portfolio honesty:** OpsPilot is a fictional product with sample operational data. The API and authentication are working local-demo implementations. It is not a production-ready enterprise system; see the security notes below.

## What is included

### Frontend
- Responsive operations dashboard with KPI cards, analytics, project overview, and activity feed
- Project and task workspaces with search, filters, task creation, and status workflows
- JSON/schema-driven dynamic form renderer with typed field definitions and native validation
- Extended field support: text, email, select, date, textarea, number, and checkbox
- Reusable UI patterns, typed domain models, memoized KPI cards, and memoized task filtering
- PWA manifest and service worker registration for production builds
- API Integration page to authenticate, fetch tasks, create tasks, and update task statuses

### Backend API
- Dependency-free Node.js HTTP server (built-in `http`, `crypto`, and filesystem modules)
- Signed bearer-token authentication with an 8-hour expiry
- Protected task list, create, update, and delete endpoints
- Input validation and JSON-file persistence under `server/data/db.json`
- Health endpoint for service checks

### Quality
- Vitest test runner and Testing Library dependencies
- Unit tests for dynamic form schema and value validation
- Coverage command and combined quality-check script

## Technology

- React 18, TypeScript, Vite 6
- React Router, Recharts, Lucide React
- Node.js built-in HTTP and Crypto APIs
- Vitest, Testing Library, jsdom

## Requirements

- Node.js 20.19+ or 22.12+
- npm

## Quick start

### 1. Install dependencies

```bash
npm install
```

### 2. Start the frontend

```bash
npm run dev
```

Open the local URL printed by Vite (normally `http://localhost:5173`).

### 3. Start the API in a second terminal

```bash
npm run server
```

The API listens at `http://localhost:4000`.

### 4. Try the API integration page

In the app, open **API Integration** and use:

- Email: `demo@opspilot.dev`
- Password: `OpsPilot!2026`

The page signs in, loads tasks from the API, creates tasks, and updates task statuses. The API creates `server/data/db.json` automatically on first startup.

## Quality checks

```bash
npm test
npm run test:coverage
npm run build
```

Or run tests and production build together:

```bash
npm run check
```

## Useful API routes

| Method | Endpoint | Auth | Purpose |
|---|---|---:|---|
| GET | `/api/health` | No | Health check |
| POST | `/api/auth/login` | No | Authenticate demo user |
| GET | `/api/tasks` | Yes | List tasks |
| POST | `/api/tasks` | Yes | Create task |
| PATCH | `/api/tasks/:id` | Yes | Update task status |
| DELETE | `/api/tasks/:id` | Yes | Delete task |

### Example login request

```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "content-type: application/json" \
  -d '{"email":"demo@opspilot.dev","password":"OpsPilot!2026"}'
```

## Environment configuration

Copy `.env.example` to `.env` if you want to customize the API:

```env
API_PORT=4000
JWT_SECRET=replace-with-a-long-random-secret
CORS_ORIGIN=http://localhost:5173
```

The API reads environment variables from the process. For local use, set them in your terminal before running `npm run server`, or use your preferred environment loader.

## Project structure

```text
opspilot-portfolio/
├── public/
│   ├── manifest.webmanifest
│   └── sw.js
├── server/
│   ├── server.mjs
│   └── README.md
├── src/
│   ├── App.tsx
│   ├── api.ts
│   ├── data.ts
│   ├── main.tsx
│   ├── styles.css
│   ├── types.ts
│   └── validation.ts
├── tests/
│   ├── setup.ts
│   └── validation.test.ts
├── index.html
├── package.json
├── vitest.config.ts
├── tsconfig*.json
└── vite.config.ts
```

## Architecture and engineering notes

- **UI and domain types:** `src/types.ts` defines the core domain models shared by UI features.
- **Schema-driven rendering:** the form UI iterates over typed field configuration rather than hardcoding each field's markup.
- **Validation separation:** `src/validation.ts` contains pure validation functions that can be tested independently from React.
- **API boundary:** `src/api.ts` centralizes HTTP requests, bearer-token handling, and API error propagation.
- **Backend separation:** the Node API is isolated in `server/` and can be replaced with a database-backed service without coupling route logic to React components.
- **Performance:** task filtering is memoized, KPI cards are memoized, and API code is loaded on demand from the integration page.

## Production hardening checklist

This repository is intended as a local portfolio demonstration. Before real-world deployment:

1. Replace JSON-file persistence with PostgreSQL or another managed database.
2. Use a maintained authentication framework and secure, HTTP-only cookies where appropriate.
3. Hash passwords with a production password-hashing algorithm and unique salts (for example Argon2id or bcrypt).
4. Add rate limiting, CSRF protections where relevant, audit logs, schema validation, and security headers.
5. Store secrets in deployment environment variables or a secrets manager; never commit them.
6. Enforce HTTPS and a strict CORS allowlist.
7. Add end-to-end tests, accessibility checks, and CI workflows.

## Suggested CV / LinkedIn project description

**OpsPilot — Enterprise Operations Management Platform**  
Designed and developed a responsive operations dashboard using React and TypeScript. Implemented reusable UI components, a schema-driven dynamic form renderer, task workflows, and analytics views. Built a Node.js REST API with signed-token authentication and persistent task endpoints, and added unit tests for form validation using Vitest.

Only claim features you have personally reviewed, run, and can confidently explain in an interview.
