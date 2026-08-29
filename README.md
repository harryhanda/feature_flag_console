# Feature Flag Console

A MERN feature-flag management platform: React admin dashboard + Express/MongoDB API with JWT auth, role-based access control, percentage rollouts, per-environment overrides, audit logging, and a public read-only evaluation API consumed by a demo client.

This README reflects what is **actually implemented** in this repo — not aspirational features.

## Architecture

```
feature-flag-dashboard/   React (Create React App) admin UI — never talks to MongoDB directly
backend/                  Express + Mongoose API — the only thing that talks to MongoDB
demo_client/              Static HTML/JS page that demonstrates flags changing app behavior
                           live, without redeploying, via the public evaluation API
```

## What's implemented

- JWT auth: register (always creates a `viewer`), login, logout, change password, `/me`
- RBAC: `admin` > `developer` > `viewer`, enforced **server-side** on every route
- Feature flags: CRUD, `enabled`, `rollout` (0-100), optional per-environment overrides
  (`development` / `staging` / `production`)
- Deterministic percentage rollout (SHA-256 based on feature name + a stable bucket key —
  no `Math.random()`, so a given user always gets the same result)
- Audit log for create/update/delete/role-change, with filtering by user/action/feature/date
- Public, unauthenticated evaluation API (`/api/public/features`) that exposes only
  `{ name, enabled }` — used by the demo client instead of any hardcoded token
- Centralized error handling, `/health` check, CORS allowlist, rate limiting, security headers
- Self-role-change / self-delete protection for admins

## Not implemented (by design, to avoid overengineering)

- Redis (nothing in this codebase referenced it; nothing to remove or fake)
- Swagger/OpenAPI UI — see `backend/API.md` for a plain-text API reference instead
- Real-time push updates — the demo client polls the public API every few seconds instead

## Local development

### Backend
```bash
cd backend
cp .env.example .env       # then fill in MONGO_URI and JWT_SECRET
npm install
npm run dev                 # http://localhost:5001
```

### Frontend
```bash
cd feature-flag-dashboard
cp .env.example .env        # REACT_APP_API_URL=http://localhost:5001/api
npm install
npm start                   # http://localhost:3000
```

### Demo client
It's a static file — no build step. Serve it with any static server, e.g.:
```bash
cd demo_client
npx serve .                 # or VS Code "Live Server"
```
Then open it with `?api=http://localhost:5001/api` if your backend isn't on the default URL, e.g.:
`http://localhost:3000/site.html?api=http://localhost:5001/api`

### Tests
```bash
cd backend
npm install    # pulls in jest, supertest, mongodb-memory-server
npm test
```

## Environment variables

**backend/.env**
```
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/featureflags
JWT_SECRET=<long random string>
PORT=5001
FRONTEND_URL=http://localhost:3000
DEMO_CLIENT_URL=http://localhost:5500
NODE_ENV=development
```

**feature-flag-dashboard/.env**
```
REACT_APP_API_URL=http://localhost:5001/api
```

Never commit real values for these — only `.env.example` files with placeholders belong in git.

## Deployment

```
GitHub → Vercel  → React dashboard (feature-flag-dashboard)
       → Vercel  → Demo client (demo_client) — served as a static site
       → Render  → Express API (backend)
                 → MongoDB Atlas
```

**Render (backend)**
- Root directory: `backend`
- Build command: `npm install`
- Start command: `npm start`
- Env vars: `MONGO_URI`, `JWT_SECRET`, `FRONTEND_URL`, `DEMO_CLIENT_URL`, `NODE_ENV=production`
  (Render sets `PORT` itself)

**Vercel (dashboard)**
- Root directory: `feature-flag-dashboard`
- Framework preset: Create React App
- Env var: `REACT_APP_API_URL=https://<your-backend>.onrender.com/api`

**Vercel (demo client)**
- Root directory: `demo_client`
- Framework preset: Other / static
- No env vars needed — pass `?api=https://<your-backend>.onrender.com/api` in the URL, or
  edit `API_BASE_URL` at the top of the `<script>` in `site.html` before deploying.

**MongoDB Atlas**
- Database name: `featureflags`
- Network access: allow Render's outbound IPs (or `0.0.0.0/0` if you're on a dynamic-IP
  Render plan — restrict later once you're on a static-IP add-on)
- The React dashboard and demo client never connect to Atlas directly — only the backend does.

## API reference

See [`backend/API.md`](backend/API.md).

## Known limitations / next steps

- Rate limiting and MongoDB-connection state are per-instance (in-memory); if you scale
  the backend horizontally, move rate limiting to Redis and rely on Atlas for connection
  state instead of a single process's `mongoose.connection.readyState`.
- No refresh-token rotation — JWTs are long-lived (7 days) and can't be revoked
  server-side before they expire. Add a token blocklist (e.g. in Redis) if you need
  instant revocation.
- No automated CI pipeline running `npm test` on push — worth adding a GitHub Actions
  workflow.
- Passwords are validated for minimum length only; consider adding complexity rules if
  this becomes a public-facing product.
