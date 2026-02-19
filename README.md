# TaskFlow - Task Management System

A full-stack task management application built with **Next.js 16**, **TypeScript**, **Prisma 7**, and **NeonDB**. Features secure JWT authentication with refresh token rotation, full CRUD operations, pagination, filtering, search, and a responsive UI.

## Tech Stack

| Layer        | Technology                                        |
| ------------ | ------------------------------------------------- |
| Framework    | Next.js 16 (App Router, Turbopack)                |
| Language     | TypeScript                                        |
| Database     | PostgreSQL (NeonDB - serverless)                  |
| ORM          | Prisma 7 with `@prisma/adapter-neon`              |
| Auth         | JWT (access + refresh tokens), bcrypt             |
| Validation   | Zod                                               |
| UI           | shadcn/ui, Tailwind CSS 4, Radix UI, Lucide Icons |
| Notifications| Sonner                                            |

## Features

- **Authentication** - Register, login, logout with JWT access/refresh token flow
- **Refresh Token Rotation** - Secure token cycling with hashed storage in DB
- **Task CRUD** - Create, read, update, delete tasks
- **Status Toggle** - Cycle task status (Pending → In Progress → Completed)
- **Pagination** - Paginated task listing
- **Filtering** - Filter tasks by status (Pending, In Progress, Completed)
- **Search** - Search tasks by title
- **Dashboard** - Overview with task statistics
- **Responsive Design** - Mobile-first with sidebar navigation and sheet menu
- **Error Handling** - Error boundaries, form validation, toast notifications
- **Route Protection** - Middleware-based auth guard on protected routes

## Project Structure

```
tms2026/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── register/route.ts    # POST - register new user
│   │   │   ├── login/route.ts       # POST - authenticate user
│   │   │   ├── refresh/route.ts     # POST - refresh access token
│   │   │   └── logout/route.ts      # POST - clear session
│   │   └── tasks/
│   │       ├── route.ts             # GET (list) / POST (create)
│   │       └── [id]/
│   │           ├── route.ts         # GET / PATCH / DELETE
│   │           └── toggle/route.ts  # PATCH - cycle task status
│   ├── (auth)/                      # Auth pages (login, register)
│   ├── (dashboard)/                 # Protected pages (dashboard, tasks)
│   ├── layout.tsx                   # Root layout
│   └── page.tsx                     # Redirects to /dashboard
├── components/
│   ├── ui/                          # shadcn/ui primitives
│   ├── auth/                        # Login & register forms
│   ├── tasks/                       # Task card, list, form, filters
│   ├── layout/                      # Header, sidebar
│   └── shared/                      # Pagination, empty state, spinner
├── lib/
│   ├── prisma.ts                    # Prisma client singleton (NeonDB adapter)
│   ├── auth.ts                      # JWT sign/verify, cookie helpers
│   ├── api-client.ts                # Fetch wrapper with auto token refresh
│   ├── validations/                 # Zod schemas (auth, task)
│   ├── constants.ts                 # App constants
│   └── utils.ts                     # cn() helper
├── hooks/
│   └── use-auth.tsx                 # Auth context provider
├── types/
│   └── index.ts                     # Shared TypeScript types
├── prisma/
│   └── schema.prisma                # Database schema
├── proxy.ts                         # Next.js 16 route protection middleware
├── .env.example                     # Environment variable template
└── package.json
```

## Database Schema

```
┌─────────────┐       ┌─────────────────┐
│    User      │       │      Task       │
├─────────────┤       ├─────────────────┤
│ id (cuid)   │──┐    │ id (cuid)       │
│ email       │  │    │ title           │
│ name        │  │    │ description?    │
│ password    │  │    │ status (enum)   │
│ refreshToken│  │    │ priority (enum) │
│ createdAt   │  └───>│ userId (FK)     │
│ updatedAt   │       │ dueDate?        │
└─────────────┘       │ createdAt       │
                      │ updatedAt       │
                      └─────────────────┘

TaskStatus: PENDING | IN_PROGRESS | COMPLETED
Priority:   LOW | MEDIUM | HIGH
```

## Getting Started

### Prerequisites

- **Node.js** 18.18+ (recommended: 20+)
- **npm** or **yarn**
- **NeonDB** account - [neon.tech](https://neon.tech) (free tier available)

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd tms
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
# NeonDB connection string (get from Neon dashboard)
DATABASE_URL="postgresql://username:password@ep-xxx.region.neon.tech/dbname?sslmode=require"

# JWT secrets - generate with: openssl rand -hex 64
ACCESS_TOKEN_SECRET="your-access-token-secret"
REFRESH_TOKEN_SECRET="your-refresh-token-secret"

# Token expiry
ACCESS_TOKEN_EXPIRY="15m"
REFRESH_TOKEN_EXPIRY="7d"
```

### 4. Set up the database

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# (Optional) Open Prisma Studio to inspect data
npx prisma studio
```

### 5. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Build for production

```bash
npm run build
npm start
```

## API Reference

### Authentication

| Method | Endpoint             | Description             | Auth     |
| ------ | -------------------- | ----------------------- | -------- |
| POST   | `/api/auth/register` | Register a new user     | Public   |
| POST   | `/api/auth/login`    | Login and get tokens    | Public   |
| POST   | `/api/auth/refresh`  | Refresh access token    | Cookie   |
| POST   | `/api/auth/logout`   | Logout and clear tokens | Public   |

### Tasks

| Method | Endpoint                  | Description          | Auth     |
| ------ | ------------------------- | -------------------- | -------- |
| GET    | `/api/tasks`              | List tasks (paginated, filterable, searchable) | Bearer |
| POST   | `/api/tasks`              | Create a new task    | Bearer   |
| GET    | `/api/tasks/:id`          | Get a single task    | Bearer   |
| PATCH  | `/api/tasks/:id`          | Update a task        | Bearer   |
| DELETE | `/api/tasks/:id`          | Delete a task        | Bearer   |
| PATCH  | `/api/tasks/:id/toggle`   | Toggle task status   | Bearer   |

**Query parameters for `GET /api/tasks`:**

| Param    | Type   | Description                          |
| -------- | ------ | ------------------------------------ |
| `page`   | number | Page number (default: 1)             |
| `status` | string | Filter by status (`PENDING`, `IN_PROGRESS`, `COMPLETED`) |
| `search` | string | Search tasks by title                |

## Security

- **Access tokens** are short-lived (15 min) and stored in memory only (never in localStorage)
- **Refresh tokens** are long-lived (7 days), stored in HTTP-only, Secure, SameSite=Strict cookies
- **Passwords** are hashed with bcrypt (12 salt rounds)
- **Refresh token rotation** - a new refresh token is issued on each refresh, previous token is invalidated
- **Input validation** on every API endpoint using Zod
- **Route protection** via Next.js proxy middleware - unauthenticated users are redirected to `/login`
- **Ownership checks** - users can only access and modify their own tasks
