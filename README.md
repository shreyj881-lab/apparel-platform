# Apparel Platform

Production-ready apparel industry platform for managing styles and fabric libraries.

**Stack:** Next.js 15 · NestJS · PostgreSQL · Cloudinary · JWT + RBAC

---

## Quick Start (Docker)

```bash
# 1. Clone and configure
cp .env.example .env
# Edit .env with your Cloudinary credentials and a strong JWT_SECRET

# 2. Start everything
docker-compose up -d

# 3. Access
#   Frontend:  http://localhost:3000
#   API:       http://localhost:3001/api/v1
#   Swagger:   http://localhost:3001/api/docs

# Default admin login:
#   email:    admin@appareltek.in
#   password: Admin@123   ← change immediately in production
```

---

## Local Development

### Backend

```bash
cd backend
npm install
cp .env.example .env    # fill in DATABASE_URL, JWT_SECRET, Cloudinary creds
npm run start:dev       # starts on :3001
```

### Frontend

```bash
cd frontend
npm install
cp .env.local.example .env.local
# Set NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
npm run dev             # starts on :3000
```

### PostgreSQL (local)

```bash
# Using Docker for just the DB:
docker run -d --name apparel_pg \
  -e POSTGRES_DB=apparel_platform \
  -e POSTGRES_USER=apparel_user \
  -e POSTGRES_PASSWORD=apparel_pass \
  -p 5432:5432 postgres:16-alpine
```

---

## Environment Variables

### Backend `.env`

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | 64+ char random string |
| `JWT_EXPIRES_IN` | Token TTL (default: `7d`) |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud |
| `CLOUDINARY_API_KEY` | Cloudinary key |
| `CLOUDINARY_API_SECRET` | Cloudinary secret |
| `PORT` | API port (default: `3001`) |
| `FRONTEND_URL` | CORS origin |

### Frontend `.env.local`

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API base URL |

---

## API Endpoints

All endpoints are prefixed with `/api/v1`.

### Auth
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/auth/register` | Public | Create account |
| POST | `/auth/login` | Public | Login, get JWT |
| GET | `/auth/profile` | JWT | Get current user |
| PATCH | `/auth/change-password` | JWT | Change password |

### Styles
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/styles` | Public | List with filters + pagination |
| GET | `/styles/filter-options` | Public | Available filter values |
| GET | `/styles/:id` | Public | Style detail (increments view count) |
| POST | `/styles` | JWT | Create style |
| PUT | `/styles/:id` | JWT | Update style |
| DELETE | `/styles/:id` | JWT | Soft-delete style |
| POST | `/styles/:id/images` | JWT | Upload images (multipart) |
| DELETE | `/styles/:id/images/:imgId` | JWT | Remove image |
| GET | `/styles/export` | JWT | Export as Excel |

### Fabrics
Same pattern as Styles, plus:

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/fabrics/:id/colorways` | JWT | Add colorway |

### Users (Admin only)
| Method | Path | Auth |
|---|---|---|
| GET | `/users` | Admin |
| PATCH | `/users/:id/role` | Admin |
| PATCH | `/users/:id/status` | Admin |
| DELETE | `/users/:id` | Admin |

### Other
| Method | Path | Description |
|---|---|---|
| GET | `/dashboard/stats` | Aggregated stats |
| GET | `/search?q=` | Global search across styles + fabrics |

---

## Project Structure

```
apparel-platform/
├── backend/
│   └── src/
│       ├── auth/           # JWT, Passport strategies
│       ├── users/          # User CRUD (admin)
│       ├── styles/         # Style management
│       ├── fabrics/        # Fabric library
│       ├── upload/         # Cloudinary integration
│       ├── search/         # Global search
│       ├── dashboard/      # Stats aggregation
│       ├── common/         # Guards, decorators, filters
│       └── database/       # TypeORM entities
├── frontend/
│   └── app/
│       ├── (auth)/         # Login, Register (no sidebar)
│       └── (app)/          # Protected app routes
│           ├── dashboard/
│           ├── styles/
│           ├── fabrics/
│           ├── search/
│           └── admin/users/
├── docker/
│   └── init.sql            # DB extensions + seed
└── docker-compose.yml
```

---

## Features

- **Style Library** — Grid view with image zoom/fullscreen, filter by gender, wear category, brick name, fabric type, GSM range
- **Fabric Library** — Color swatches, supplier info, pricing, MOQ
- **Global Search** — Cross-entity search across styles and fabrics
- **Image Viewer** — Fullscreen lightbox with zoom, keyboard navigation
- **Admin Panel** — User management, role assignment, activate/deactivate
- **Excel Export** — Bulk export styles or fabrics as .xlsx
- **Dashboard** — Upload trends, brick distribution, most-used fabrics charts
- **Dark Mode** — Full theme support via next-themes
- **JWT Auth** — Access token stored in localStorage, auto-refresh on 401

---

## Production Checklist

- [ ] Change default admin password
- [ ] Set `JWT_SECRET` to a strong 64+ character random string
- [ ] Configure Cloudinary credentials
- [ ] Set `NODE_ENV=production` (disables Swagger, enables SSL for DB)
- [ ] Set up a reverse proxy (nginx/Caddy) in front of both services
- [ ] Enable HTTPS
- [ ] Run database migrations instead of `synchronize: true`
