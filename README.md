# 🚀 TaskForge — Micro-Task Freelancing Platform

> A full-stack freelancing platform connecting clients with high-performance freelance talent for micro-tasks. Built with React, Flask, Supabase, and TailwindCSS.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [1. Clone the Repository](#1-clone-the-repository)
  - [2. Supabase Setup](#2-supabase-setup)
  - [3. Frontend Setup](#3-frontend-setup)
  - [4. Backend Setup](#4-backend-setup)
- [Environment Variables](#environment-variables)
- [Database Schema](#database-schema)
- [Available Scripts](#available-scripts)
- [Pages & Routes](#pages--routes)
- [Authentication Flow](#authentication-flow)
- [SMTP & Email Configuration](#smtp--email-configuration)
- [Network Access (Mobile Testing)](#network-access-mobile-testing)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [License](#license)

---

## Overview

**TaskForge** is a micro-task economy platform where:
- **Clients** can post small tasks (₹100–₹1000 range) and hire freelancers.
- **Freelancers** can discover tasks, submit work, and get paid securely.

The platform features role-based authentication, a modern dashboard, real-time messaging, task posting/searching, and a full settings panel with bank/UPI payment management.

---

## Features

### 🔐 Authentication & Security
- Email/Password sign-up and login via Supabase Auth
- Role selection during sign-up (Freelancer / Client)
- Password reset via email with secure token-based flow
- Email change with double-confirmation
- Protected routes (redirect to login if unauthenticated)

### 📊 Dashboard
- Task overview with status indicators
- Earnings summary
- Quick actions for common workflows

### 🔍 Task Management
- Browse and search available tasks
- Post new tasks with title, description, and budget
- Task detail view with full information
- Work submission flow for freelancers

### 💬 Messaging
- Real-time messaging between clients and freelancers

### ⚙️ Settings
- Profile management (name, bio, avatar, skills)
- Email change with inline validation
- Password update
- Bank account management with Indian bank dropdown
- UPI ID verification flow
- Notification preferences
- 2FA toggle

### 💰 Payments & Payouts
- Bank account linking (supports 20+ major Indian banks)
- UPI ID verification
- Automated payout information

---

## Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 19.2.5 | UI library |
| React Router DOM | 7.15.0 | Client-side routing |
| Vite | 8.0.10 | Build tool & dev server |
| TailwindCSS | 3.4.19 | Utility-first CSS framework |
| Supabase JS | 2.105.3 | Authentication & database client |
| Google Material Symbols | Latest | Icon system |
| Plus Jakarta Sans / Inter | Latest | Typography |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Python | 3.x | Runtime |
| Flask | 3.0.3 | REST API framework |
| Flask-CORS | 4.0.1 | Cross-origin resource sharing |
| Supabase Python | 2.4.5 | Server-side Supabase client |
| python-dotenv | 1.0.1 | Environment variable management |

### Infrastructure
| Service | Purpose |
|---|---|
| Supabase | Auth, PostgreSQL database, Row Level Security |
| Resend / Gmail SMTP | Transactional email delivery |

---

## Project Structure

```
taskforge/
├── backend/                    # Flask API server
│   ├── .env                    # Backend environment variables
│   ├── app.py                  # Flask application entry point
│   ├── requirements.txt        # Python dependencies
│   ├── test_supabase.py        # Supabase connection test script
│   └── venv/                   # Python virtual environment
│
├── src/                        # React frontend source
│   ├── main.jsx                # React entry point
│   ├── App.jsx                 # Root component with routing
│   ├── App.css                 # Global app styles
│   ├── index.css               # Base CSS imports
│   ├── supabaseClient.js       # Supabase client configuration
│   │
│   ├── components/
│   │   └── Layout.jsx          # App shell (sidebar, topbar, Outlet)
│   │
│   └── pages/
│       ├── Auth.jsx            # Login & Sign-up (combined)
│       ├── Login.jsx           # Legacy login page
│       ├── SignUp.jsx           # Legacy sign-up page
│       ├── ResetPassword.jsx   # Password reset (request + update)
│       ├── Dashboard.jsx       # Main dashboard
│       ├── SearchResults.jsx   # Task search results
│       ├── TaskDetail.jsx      # Individual task view
│       ├── PostTask.jsx        # Create a new task
│       ├── WorkSubmission.jsx  # Submit work for a task
│       ├── MyProjects.jsx      # User's projects
│       ├── Messages.jsx        # Messaging interface
│       ├── Settings.jsx        # Full settings panel
│       ├── NoTasks.jsx         # Empty state
│       └── Loading.jsx         # Loading spinner
│
├── public/                     # Static assets
├── index.html                  # HTML entry point
├── package.json                # Node.js dependencies
├── vite.config.js              # Vite configuration
├── tailwind.config.js          # TailwindCSS theme & design tokens
├── postcss.config.js           # PostCSS configuration
├── eslint.config.js            # ESLint configuration
├── database_schema.sql         # Supabase SQL schema
└── .env.local                  # Frontend environment variables
```

---

## Prerequisites

Ensure the following are installed on your system:

- **Node.js** ≥ 18.x — [Download](https://nodejs.org/)
- **npm** ≥ 9.x (comes with Node.js)
- **Python** ≥ 3.9 — [Download](https://python.org/)
- **Git** — [Download](https://git-scm.com/)
- **Supabase Account** — [Sign up (free)](https://supabase.com/)

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/taskforge.git
cd taskforge
```

### 2. Supabase Setup

1. Create a new project at [supabase.com/dashboard](https://supabase.com/dashboard).
2. Go to **SQL Editor** and run the contents of `database_schema.sql` to create the required tables and triggers.
3. Go to **Settings** → **API** and copy:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key**
   - **service_role key** (for backend only — keep this secret!)
4. Go to **Authentication** → **URL Configuration**:
   - Set **Site URL** to `http://localhost:5173` (or your network IP for mobile testing)
   - Add redirect URLs: `http://localhost:5173/*`

### 3. Frontend Setup

```bash
# Install dependencies
npm install

# Create environment file
# Copy .env.local.example to .env.local and fill in your Supabase credentials
```

Create a `.env.local` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Start the development server:

```bash
# Standard (localhost only)
npm run dev

# With network access (for mobile testing)
npm run dev -- --host
```

The frontend will be available at:
- **Local:** `http://localhost:5173`
- **Network:** `http://your-ip:5173` (when using `--host`)

### 4. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

Create a `.env` file inside the `backend/` directory:

```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key-here
```

Start the Flask server:

```bash
python app.py
```

The backend API will be running at `http://0.0.0.0:5000`.

---

## Environment Variables

### Frontend (`.env.local` — project root)

| Variable | Description | Example |
|---|---|---|
| `VITE_SUPABASE_URL` | Your Supabase project URL | `https://abc123.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous/public key | `eyJhbGciOi...` |

### Backend (`backend/.env`)

| Variable | Description | Example |
|---|---|---|
| `SUPABASE_URL` | Your Supabase project URL | `https://abc123.supabase.co` |
| `SUPABASE_SERVICE_KEY` | Supabase service role key (**keep secret!**) | `eyJhbGciOi...` |

> ⚠️ **Never commit `.env` files to version control.** Both `.env.local` and `backend/.env` should be listed in `.gitignore`.

---

## Database Schema

The application uses two main tables in Supabase with Row Level Security (RLS) enabled:

### `profiles`
| Column | Type | Description |
|---|---|---|
| `id` | UUID (PK) | References `auth.users` |
| `email` | TEXT | User's email address |
| `role` | TEXT | `'freelancer'` or `'client'` |
| `full_name` | TEXT | Display name |
| `created_at` | TIMESTAMPTZ | Account creation time |

### `tasks`
| Column | Type | Description |
|---|---|---|
| `id` | UUID (PK) | Auto-generated |
| `client_id` | UUID (FK) | References `profiles.id` |
| `title` | TEXT | Task title |
| `description` | TEXT | Task description |
| `budget` | NUMERIC | Task budget (₹) |
| `status` | TEXT | `'open'`, `'in_progress'`, `'completed'`, `'cancelled'` |
| `created_at` | TIMESTAMPTZ | Task creation time |

### Automated Trigger
A database trigger (`on_auth_user_created`) automatically creates a profile entry in the `profiles` table whenever a new user signs up through Supabase Auth.

---

## Available Scripts

### Frontend

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server (localhost) |
| `npm run dev -- --host` | Start with network access (for mobile) |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

### Backend

| Command | Description |
|---|---|
| `python app.py` | Start Flask API server |
| `python test_supabase.py` | Test Supabase connection |

---

## Pages & Routes

### Public Routes (no authentication required)

| Route | Component | Description |
|---|---|---|
| `/login` | `Auth.jsx` | Login form |
| `/signup` | `Auth.jsx` | Sign-up form (shared component) |
| `/reset-password` | `ResetPassword.jsx` | Password reset request & update |

### Protected Routes (requires authentication)

| Route | Component | Description |
|---|---|---|
| `/` | `Dashboard.jsx` | Main dashboard |
| `/search` | `SearchResults.jsx` | Search for tasks |
| `/no-tasks` | `NoTasks.jsx` | Empty state |
| `/loading` | `Loading.jsx` | Loading state |
| `/task-detail` | `TaskDetail.jsx` | View task details |
| `/work-submission` | `WorkSubmission.jsx` | Submit work |
| `/post-task` | `PostTask.jsx` | Create a new task |
| `/settings` | `Settings.jsx` | Profile & account settings |
| `/projects` | `MyProjects.jsx` | User's projects |
| `/messages` | `Messages.jsx` | Messaging |

All protected routes are wrapped in a `<ProtectedRoute>` component that checks for an active Supabase session and redirects to `/login` if unauthenticated.

---

## Authentication Flow

### Sign Up
1. User visits `/signup`
2. Selects role (Freelancer or Client)
3. Enters email and password
4. Supabase sends confirmation email
5. User clicks confirmation link → account activated
6. Database trigger auto-creates a `profiles` row

### Login
1. User visits `/login`
2. Enters email and password
3. Supabase validates credentials
4. Session stored in browser → redirected to dashboard

### Password Reset
1. User clicks "Forgot Password?" on login page → navigates to `/reset-password`
2. Enters email → Supabase sends reset email
3. User clicks link in email → returns to `/reset-password` with recovery token
4. Component detects `PASSWORD_RECOVERY` event → shows "Set New Password" form
5. User enters new password → `supabase.auth.updateUser()` updates it

### Email Change
1. User goes to Settings → Security → "Change Email"
2. Enters new email → `supabase.auth.updateUser({ email })` sends confirmation
3. User confirms on both old and new email addresses

---

## SMTP & Email Configuration

By default, Supabase uses its built-in email service with strict rate limits (3 emails/hour on free plan). For development and production, configure a custom SMTP provider.

### Setup in Supabase Dashboard

Go to **Authentication** → **Email** → **SMTP Settings** → Enable Custom SMTP

### Recommended Providers

#### Resend (Recommended for production)
```
Host: smtp.resend.com
Port: 465
Username: resend
Password: <your-resend-api-key>
Sender Email: onboarding@resend.dev (testing) or your-verified@domain.com
Sender Name: TaskForge
```

#### Gmail SMTP (Quick local testing)
```
Host: smtp.gmail.com
Port: 587
Username: your@gmail.com
Password: <gmail-app-password>
Sender Email: your@gmail.com
Sender Name: TaskForge
```

> To generate a Gmail App Password: Google Account → Security → 2-Step Verification → App Passwords

#### Mailtrap (Development/sandbox testing)
```
Host: sandbox.smtp.mailtrap.io
Port: 2525
Username: <from-mailtrap-inbox>
Password: <from-mailtrap-inbox>
```

> ⚠️ Mailtrap intercepts all emails — they appear in the Mailtrap inbox, not the recipient's real inbox.

---

## Network Access (Mobile Testing)

To test on a mobile device connected to the same Wi-Fi network:

### 1. Start with network access
```bash
npm run dev -- --host
```

### 2. Find your local IP
```bash
# Windows
ipconfig
# Look for "IPv4 Address" under your Wi-Fi adapter (e.g., 192.168.1.44)
```

### 3. Access from mobile
Open `http://192.168.1.44:5173` on your phone's browser.

### 4. Update Supabase URL Configuration
In Supabase Dashboard → Authentication → URL Configuration:
- **Site URL:** `http://192.168.1.44:5173`
- **Redirect URLs:** Add `http://192.168.1.44:5173/*`

This ensures auth emails (password reset, email change) redirect to your network IP instead of `localhost`.

---

## API Endpoints (Backend)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Health message |
| `GET` | `/api/health` | Health check |
| `GET` | `/api/admin/users` | List all registered users (admin) |

---

## Design System

TaskForge uses a custom Material Design 3-inspired token system configured in `tailwind.config.js`:

- **Colors:** 30+ semantic color tokens (primary, secondary, surface, error, etc.)
- **Typography:** Plus Jakarta Sans (headings), Inter (body text)
- **Spacing:** Custom tokens (`stack-sm`, `stack-md`, `gutter`, etc.)
- **Icons:** Google Material Symbols (Outlined, variable weight/fill)

---

## Deployment

### Frontend (Vercel / Netlify)

```bash
npm run build
```

The `dist/` folder contains the production build. Deploy to:
- **Vercel:** Connect your GitHub repo → auto-deploys
- **Netlify:** Drag and drop `dist/` folder or connect repo

> Remember to add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as environment variables in your deployment platform.

### Backend (Railway / Render)

Deploy the `backend/` directory to Railway or Render with:
- **Start command:** `python app.py`
- **Environment variables:** `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`

---

## Troubleshooting

| Issue | Solution |
|---|---|
| Blank page on load | Check that all page components export a valid React component (not just a function) |
| `localhost` in email links | Update Supabase Site URL and Redirect URLs to your network IP |
| Email rate limit exceeded | Configure custom SMTP (Resend or Gmail) in Supabase SMTP settings |
| CORS errors on API calls | Ensure Flask-CORS is installed and `CORS(app)` is called |
| `.env` variables undefined | Restart the dev server after changing `.env.local` files |
| Mobile can't reach dev server | Run `npm run dev -- --host` and use your IP address, not `localhost` |

---

## License

This project is private. All rights reserved.

---

<p align="center">
  Built with ❤️ by the TaskForge Team
</p>
