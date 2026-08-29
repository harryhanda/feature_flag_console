# Feature Flag Console — API Reference

Base URL (local dev): `http://localhost:5001/api`

All responses use the shape:
```json
{ "success": true, "data": ... }
```
or on error:
```json
{ "success": false, "message": "..." }
```

Authenticated routes require:
```
Authorization: Bearer <jwt>
```

Roles: `admin` > `developer` > `viewer`.

---

## Auth (`/api/auth`)

| Method | Endpoint | Auth | Body | Notes |
|---|---|---|---|---|
| POST | `/register` | none | `{ email, password, name? }` | Always creates a `viewer`. Rate limited. |
| POST | `/login` | none | `{ email, password }` | Returns `{ token, user }`. Rate limited. |
| POST | `/logout` | Bearer | — | Stateless JWT; client just discards the token. |
| GET | `/me` | Bearer | — | Returns the current user. |
| PUT | `/change-password` | Bearer | `{ oldPassword, newPassword }` | |

Errors: `400` bad input, `401` invalid credentials/token, `409` duplicate email.

---

## Features (`/api/features`) — requires login

| Method | Endpoint | Min role | Body |
|---|---|---|---|
| GET | `/` | any | — |
| GET | `/:id` | any | — |
| POST | `/` | developer | `{ name, description?, enabled?, rollout?, environments? }` |
| PUT | `/:id` | developer | any subset of the above |
| DELETE | `/:id` | admin | — |

`environments` is an optional map, e.g. `{ "development": true, "staging": true, "production": false }`. Any environment not listed falls back to the top-level `enabled` flag.

Every create/update/delete writes an audit log entry.

Errors: `400` validation, `401` no/invalid token, `403` wrong role, `404` not found, `409` duplicate name.

---

## Users (`/api/users`) — admin only

| Method | Endpoint | Body |
|---|---|---|
| GET | `/` | — |
| PUT | `/role/:id` | `{ role: "admin" \| "developer" \| "viewer" }` |
| DELETE | `/:id` | — |

An admin cannot change their own role or delete their own account (`403`) — this prevents accidental lockout.

---

## Audit Logs (`/api/audit`) — admin or developer

| Method | Endpoint | Query params |
|---|---|---|
| GET | `/` | `user`, `action`, `feature`, `from`, `to` (ISO dates), `limit` (max 500) |

Returns the most recent matching entries, newest first.

---

## Public Feature Evaluation (`/api/public`) — no auth

For the demo client / any external app. Never returns anything beyond `name` + resolved `enabled`.

| Method | Endpoint | Query params |
|---|---|---|
| GET | `/features` | `environment` (default `production`), `userId` (stable bucket key for rollout) |
| GET | `/features/:name` | same |

Example:
```
GET /api/public/features/premiumBanner?environment=production&userId=visitor-abc123
```
```json
{ "success": true, "data": { "name": "premiumBanner", "enabled": true } }
```

Rollout is evaluated deterministically from `sha256(featureName + ":" + userId)`, so the same `userId` always gets the same result for a given feature — no flicker between requests, and no `Math.random()`.

---

## Health check

`GET /health` → `{ "status": "ok" | "unhealthy", "database": "connected" | "disconnected" }`, HTTP 200 or 503.
