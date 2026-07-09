# ARC Portal — Campus ERP System

A full-stack academic portal for managing student and teacher data, built for the Mathematics Department at NIT Warangal. Supports role-based dashboards, secure authentication, live communication pipelines, and academic tracking.

**Live Demo:** https://campus-erp-1ovn.vercel.app/  
**Repository:** [Add your GitHub URL here]

## Overview

ARC Portal is a modern campus management system tailored for higher education workflows. The platform provides secure, decoupled workspaces for students and teachers. Students can check exam results, track CGPA progression, submit assignments, and communicate with instructors. Teachers have unified oversight to manage class rosters, filter student groups by core branches, and handle data pipelines.

## Tech Stack

- **Frontend:** React (Hooks, Context Architecture), TypeScript, Vite
- **Styling:** Tailwind CSS, shadcn/ui component primitive library
- **Icons & UI:** Lucide React, Sonner (Toasts)
- **Backend-as-a-Service (BaaS):** Supabase (PostgreSQL Database, Auth, Realtime Engine)
- **Routing:** React Router v6
- **Deployment:** Vercel (CI/CD Pipeline)

## Key Features

- **Production Authentication Engine** — Real-world user provisioning managed via Supabase Auth, completely moving away from client-side mock configurations.
- **Dual-Provider Login Systems** — Supports classic email/password authentication alongside native **Google OAuth 2.0** federated single sign-on.
- **Strict Institution Email Validation** — Enforces institutional constraints via structured frontend RegExp validation matching NITW Mathematics formats:
  - *Format Example:* `[initials][year]ma[code]@student.nitw.ac.in` (e.g., `pz24mab0a21@student.nitw.ac.in`)
  - *Faculty Whitelisting:* Only pre-authorized institutional faculty emails are allowed to register administrative/teacher roles.
- **Role-Based Access Control (RBAC)** — Strict separation between student and faculty view states, enforced at both the application router layer and database storage layer.
- **Live Real-Time Chat Engine** — Event-driven chat workspace allowing instantaneous messaging between students and professors, leveraging Supabase PostgreSQL Replication Realtime streams.
- **Row-Level Security (RLS)** — Secure data multi-tenancy. Policies defined inside PostgreSQL ensure students can exclusively query their personal records even if the client app is completely bypassed.

## Architecture & Data Flow

The portal leverages a modern, event-driven serverless pattern removing the overhead of an intermediary server:

1. **Authentication State:** User sessions are handled securely by Supabase inside the protected `auth.users` schema, abstraction-hiding password salting (`bcrypt`) and JWT issuance.
2. **Profile Extensibility:** Upon successful sign-up, user profiles automatically bind application metadata (e.g., specific engineering/science branches, unique roll numbers) to a public schema table linked directly via the account's underlying `UUID`.
3. **Branch Specialization Routing:** Academic structures map students straight into official, filtered branch views matching true registration options (`M.Sc. Mathematics`, `Mathematics & Scientific Computing`, `B.Tech Mathematics & Computing`, `Int Msc Mathematics`).

## Database Schema

- `profiles` — Core identity mapping. Tracks user metadata (`id` linked to Auth UUID, `name`, `role`, `roll_number`, `branch`).
- `subjects` — Academic course inventory catalog.
- `semester_results` — Higher-level student academic standings tracking localized SGPA/CGPA variables across semesters.
- `exam_results` — Normalized course-level grade entries mapped to broad semester tracking records.
- `minor_results` — Granular test results capturing mid-term evaluation points per class code.
- `messages` — Real-time chat payload repository (`id`, `sender_id`, `receiver_id`, `content`, `created_at`).

## Getting Started (Local Development)

```bash
# 1. Clone the repository repository
git clone [your-repo-url]
cd [project-folder]

# 2. Install modern dependencies 
npm install

# 3. Establish environmental variables 
# Create a localized `.env` tracking configuration file at your root directory:
# VITE_SUPABASE_URL=your_supabase_project_url
# VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key

# 4. Initialize development compiler server
npm run dev