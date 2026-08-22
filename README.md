# ExpenseVault

A modern personal expense tracking and analytics platform built with React and Node.js.

## Features

- Expense management (CRUD)
- Categories and payment methods
- Search and filtering (by category, month, amount range)
- Monthly spending summaries with budget tracking
- Analytics dashboard with charts (bar, area, donut)
- User authentication with secure sessions
- Profile management with avatar upload
- Notification system with browser notifications
- Responsive design (mobile + desktop)

## Tech Stack

### Frontend

- React 19
- Vite
- React Router
- Axios
- Recharts
- Lucide Icons
- CSS (custom design system)

### Backend

- Node.js
- Express
- PostgreSQL
- pg (node-postgres)
- bcrypt
- express-session
- connect-pg-simple
- Helmet (security headers)
- CORS

## Project Structure

```
ExpenseVault/
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Route pages
│   │   ├── context/        # React context (auth, notifications)
│   │   ├── services/       # API service layer
│   │   ├── layouts/        # Layout components
│   │   └── utils/          # Constants, formatters
│   └── public/             # Static assets
├── backend/                # Express API server
│   ├── controllers/        # Request handlers
│   ├── services/           # Business logic
│   ├── routes/             # API routes
│   ├── middleware/          # Auth, error handling
│   ├── db/                 # Database pool, schema, seeds
│   └── utils/              # Response handlers, validation
└── README.md
```

## Local Setup

### Prerequisites

- Node.js 18+
- PostgreSQL 14+

### 1. Clone the repository

```bash
git clone <repository-url>
cd ExpenseVault
```

### 2. Backend setup

```bash
cd backend
cp .env.example .env
# Edit .env with your PostgreSQL credentials
npm install
npm run seed    # Creates tables + demo data
npm run dev     # Starts dev server on port 5000
```

### 3. Frontend setup

```bash
cd frontend
cp .env.example .env
# Set VITE_API_URL=http://localhost:5000/api
npm install
npm run dev     # Starts dev server on port 5173
```

### 4. Open

Visit `http://localhost:5173`

Demo login: `demo@expensevault.io` / `Demo@1234`

## Environment Variables

### Backend (`.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `SESSION_SECRET` | Random string for session encryption | `<long-random-string>` |
| `FRONTEND_URL` | Frontend origin for CORS | `http://localhost:5173` |
| `NODE_ENV` | `development` or `production` | `development` |

### Frontend (`.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000/api` |

## Production Deployment

Recommended architecture:

```
Frontend (Vercel) → Backend (Render) → PostgreSQL (Render)
```

### Backend (Render)

1. Create a PostgreSQL database on Render
2. Create a Web Service from your GitHub repo
3. Set build command: `cd backend && npm install`
4. Set start command: `cd backend && npm start`
5. Add environment variables:
   - `DATABASE_URL` — from Render PostgreSQL
   - `SESSION_SECRET` — generate a long random string
   - `FRONTEND_URL` — your Vercel frontend URL
   - `NODE_ENV` — `production`

### Frontend (Vercel)

1. Import the GitHub repo
2. Set root directory to `frontend`
3. Add environment variable:
   - `VITE_API_URL` — your Render backend URL + `/api`

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/health` | No | Health check |
| POST | `/api/auth/register` | No | Create account |
| POST | `/api/auth/login` | Yes | Login |
| POST | `/api/auth/logout` | Yes | Logout |
| GET | `/api/auth/me` | Yes | Get current user |
| PUT | `/api/auth/profile` | Yes | Update profile |
| GET | `/api/auth/settings` | Yes | Get user settings |
| PUT | `/api/auth/settings` | Yes | Update settings |
| GET | `/api/expenses` | Yes | List expenses |
| POST | `/api/expenses` | Yes | Create expense |
| GET | `/api/expenses/:id` | Yes | Get expense |
| PUT | `/api/expenses/:id` | Yes | Update expense |
| DELETE | `/api/expenses/:id` | Yes | Delete expense |
| GET | `/api/analytics/summary` | Yes | Monthly summary |
| GET | `/api/analytics/categories` | Yes | Category breakdown |
| GET | `/api/analytics/monthly` | Yes | Monthly aggregates |
| GET | `/api/analytics/trend` | Yes | Spending trend |

## License

Private
