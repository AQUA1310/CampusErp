# ARC Portal — Campus ERP System

A full-stack academic portal for managing student and teacher data, built for the Mathematics Department at NIT Warangal. Supports role-based dashboards, real authentication, and academic result tracking.

**Live Demo:** https://campus-erp-1ovn.vercel.app/
**Repository:** [Add your GitHub URL here]

## Overview

ARC Portal is a campus management system where students and teachers each get a dedicated dashboard. Students can view their academic results, and teachers can manage class-related data. The app supports real account creation and role-based access control, so students and teachers only ever see the parts of the system relevant to them.

## Tech Stack

- **Frontend:** React, TypeScript, Vite
- **Styling:** Tailwind CSS, shadcn/ui components
- **Backend:** Supabase (PostgreSQL database, Authentication, Row-Level Security)
- **Routing:** React Router
- **Deployment:** Vercel (with continuous deployment from GitHub)

## Key Features

- **Real authentication** — signup and login powered by Supabase Auth, not hardcoded credentials
- **Role-based access** — separate student and teacher dashboards, enforced both in the UI and at the database level
- **Relational database design** — normalized PostgreSQL schema linking student profiles, subjects, and exam results
- **Row-Level Security (RLS)** — database-enforced rules ensure a student can only ever access their own academic data, even if the frontend is bypassed
- **Academic results tracking** — semester results, minor exam scores, and grade breakdowns
- **Environment-based configuration** — API keys and secrets managed via environment variables, excluded from version control

## Architecture

The app follows a standard client + Backend-as-a-Service pattern rather than a custom Node/Express server:

1. The React frontend calls Supabase directly using the `@supabase/supabase-js` client library.
2. **Authentication** is handled by Supabase's built-in `auth.users` table (manages password hashing and sessions).
3. A separate `profiles` table stores app-specific user data (name, role, department, roll number), linked to the auth record via a shared UUID.
4. **Row-Level Security policies** at the database layer restrict data access by user identity and role, independent of any frontend logic.
5. Continuous deployment via Vercel means every push to the `main` branch automatically rebuilds and updates the live site.

## Database Schema

- `profiles` — user identity and role (student/teacher), linked to Supabase Auth
- `subjects` — course catalog
- `semester_results` — per-student, per-semester summary (SGPA/CGPA)
- `exam_results` — individual subject grades within a semester result
- `minor_results` — minor exam scores per subject

## Getting Started (Local Development)

```bash
# Clone the repo
git clone [your-repo-url]
cd [project-folder]

# Install dependencies
npm install

# Set up environment variables
# Create a .env file in the root with:
# VITE_SUPABASE_URL=your_supabase_project_url
# VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key

# Run the dev server
npm run dev
```

## Future Improvements

- Full CRUD for teachers to create/edit results and assignments directly
- Real assignment submission and attendance tracking (currently placeholder data)
- Email verification for new accounts
- Admin dashboard for department-wide oversight

## Notes

This project began as a UI prototype with hardcoded/mock data and was rebuilt to use a real Supabase backend, replacing fake authentication with a production-style auth and database architecture.