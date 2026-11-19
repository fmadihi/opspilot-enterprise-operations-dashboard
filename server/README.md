# OpsPilot API

A dependency-free Node.js HTTP API for the portfolio demo. It uses Node's built-in `http`, `crypto`, and filesystem modules, with JSON-file persistence for local development.

## Run

```bash
npm run server
```

Health check: `GET http://localhost:4000/api/health`

Demo credentials: `demo@opspilot.dev` / `OpsPilot!2026`

## Routes

- `POST /api/auth/login` — returns an 8-hour signed bearer token
- `GET /api/tasks` — authenticated task list
- `POST /api/tasks` — authenticated task creation
- `PATCH /api/tasks/:id` — update task status
- `DELETE /api/tasks/:id` — delete task

## Security notes

This is a learning/demo API, not production authentication. Before deployment, set a long random `JWT_SECRET`, restrict `CORS_ORIGIN`, use HTTPS, add rate limiting and audit logging, store secrets outside source control, and replace JSON-file persistence with a managed database. The demo account is seeded for local evaluation only.
