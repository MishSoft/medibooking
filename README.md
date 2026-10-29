# 🩺 MediBooking — One Hub for Patients, Doctors & Clinics

🔗 **Live Demo:** [medibooking-geo.vercel.app](https://medibooking-geo.vercel.app/)
🔌 **API:** [medibooking.onrender.com](https://medibooking.onrender.com/) · Swagger docs at [`/api-docs`](https://medibooking.onrender.com/api-docs)
📂 **Category:** Medical hub / multi-clinic appointment booking platform

![MediBooking sign-in screen](docs/medibooking-screenshot.png)

---

## 📋 About the Project

**MediBooking** is a full-stack appointment booking platform for multi-specialty medical hubs and clinic networks. It brings patients, doctors and clinic administrators together in one system. Patients find a specialist by specialty and clinic, book a free time slot, and keep their appointment history and prescriptions in one place. Doctors manage their daily schedule, record visit outcomes and diagnoses, and issue prescriptions. Clinic administrators register their facility, onboard doctors, set working hours, reschedule or cancel appointments, and track workload through reports.

---

## ✨ Key Features

- **Three role-based portals:** separate dashboards for **Patients**, **Doctors** and **Clinic Admins**, protected by React Router loaders (`requireRole`). A signed-in user is always redirected to their own dashboard.
- **Authentication:** JWT-based sign-in and registration (passwords hashed with `bcryptjs`). Logout revokes the token on the server, and expired revoked tokens are cleaned up periodically. The session is stored in `localStorage` behind a fail-safe wrapper (`auth.storage.ts`).
- **Step-by-step doctor search:** Specialty → Clinic → Doctor, with debounced live search (`useDebouncedValue`) and memoized filtering (`useMemo`).
- **Booking flow:** a booking modal with a date picker (`react-day-picker`), a time-slot picker based on each doctor's working hours, and a booking summary. The server enforces slot uniqueness with a database index to prevent double booking.
- **Doctor workspace:** daily appointments, visit records with diagnosis, patient visit history, and prescription create/edit (CRUD).
- **Clinic admin dashboard:** doctor management, weekly schedule editing, reschedule/cancel modals, an appointment-change log, and reports with stat tiles and a doctor workload table.
- **Server state & caching:** all API data goes through **TanStack Query** (custom hooks such as `useAppointments`, `useDoctors`, `useClinic`), with loading, error and empty states handled by a shared `QueryState` component.
- **Forms & validation:** **React Hook Form** + **Zod** schemas on the client (sign-in, patient/doctor/clinic registration, phone numbers) and Zod validation middleware on the server.
- **Feedback & resilience:** toast notifications (`sonner`), a typed `ApiError` class, automatic redirect to sign-in on an expired session, and submit buttons disabled while requests are pending.
- **Responsive design:** Tailwind CSS v4 with a custom design-token system (colors, typography, elevation), adapted for mobile, tablet and desktop.

---

## 🛠 Tech Stack

| Category | Technology |
| :--- | :--- |
| **Core (client)** | React 19, Vite 8, TypeScript, React Compiler (Babel plugin) |
| **Routing** | React Router (data router with role-guard loaders) |
| **Server State** | TanStack Query + `localStorage` (session) |
| **Forms & Validation** | React Hook Form + Zod (`@hookform/resolvers`) |
| **Styling & UI** | Tailwind CSS v4, CSS design tokens, custom SVG icon set, native `<dialog>` modals |
| **Dates & Notifications** | date-fns, react-day-picker, Sonner |
| **Backend** | Node.js, Express 5, TypeScript, Zod, Luxon |
| **Database** | PostgreSQL (Neon) + Prisma ORM 7 (`@prisma/adapter-pg`) |
| **Auth & API Docs** | JSON Web Tokens, bcryptjs, Swagger (swagger-jsdoc + swagger-ui-express) |
| **Tooling** | Turborepo (npm workspaces), Oxlint, nodemon, ts-node |
| **Deployment** | Vercel (client), Render (server) |

---

## 📁 Project Structure

The repository is a monorepo with two workspaces:

```text
medibooking/
├── client/                   # React + Vite frontend
│   └── src/
│       ├── api/              # Fetch client, ApiError, per-resource API modules, auth storage
│       ├── assets/icons/     # Custom SVG icon components
│       ├── components/       # Feature components (auth, booking, clinic, doctor, patient, ...)
│       ├── hooks/            # TanStack Query hooks + useDebouncedValue
│       ├── layouts/          # DashboardLayout shared by all dashboards
│       ├── pages/            # Path selector, registration pages, role dashboards
│       ├── router/           # Routes, role guards, QueryClient setup
│       ├── schemas/          # Zod form schemas
│       ├── shared/ui/        # Reusable UI kit (Button, Input, Modal, Select, DatePicker, ...)
│       ├── styles/tokens/    # Design tokens: colors, typography, elevation
│       ├── types/            # Domain types and enums (Role, appointment, doctor, ...)
│       └── utils/            # Schedule, appointment and notification helpers
│
└── server/                   # Express REST API
    ├── prisma/               # schema.prisma + migrations
    └── src/
        ├── config/           # Booking rules, Swagger setup
        ├── controllers/      # Auth, patient, doctor, clinic, appointment, prescription
        ├── db/               # Prisma client instance
        ├── middleware/       # JWT auth / role checks, Zod request validation
        ├── routes/           # REST route definitions (/api/...)
        ├── schemas/          # Zod request schemas
        ├── services/         # Auth service, revoked-token cleanup job
        ├── app.ts            # Express app setup
        └── index.ts          # Server entry point
```

---

## ⚙️ Getting Started

**Requirements:** Node.js 20+ and npm. Running the server locally also needs a PostgreSQL database.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/MishSoft/medibooking.git
   cd medibooking
   ```

2. **Install dependencies** (installs both workspaces and generates the Prisma client):
   ```bash
   npm install
   ```

3. **Run the frontend only** (uses the hosted API on Render):
   ```bash
   cd client
   npm run dev
   ```
   Open in the browser: `http://localhost:5173`

4. **(Optional) Run the backend locally.** Create `server/.env`:
   ```env
   DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DB_NAME"
   JWT_SECRET="your-secret"
   PORT=5000
   ```
   Then apply the migrations and start the server:
   ```bash
   cd server
   npx prisma migrate deploy
   npm run dev
   ```
   API: `http://localhost:5000/api` · Swagger: `http://localhost:5000/api-docs`

   > To point the client at your local server, change `BASE_URL` in `client/src/api/client.ts`.

To start both apps at once from the repo root, run `npm run dev` (Turborepo).

---

## 🔐 Test Accounts

All accounts use the password **`123xyzABC_`**.

| Role | Sign-in details | Password |
| :--- | :--- | :--- |
| **Clinic Admin** | Email: `bobclinic@clinic.ge`<br>Tax / MoH ID: `98345908-TMC` | `123xyzABC_` |
| **Doctor** | Email: `bobdoctor@clinic.ge`<br>Medical License: `GEO-MED-333` | `123xyzABC_` |
| **Patient** | Email: `bob@clinic.ge` | `123xyzABC_` |

---

## 📜 Available Scripts

**Root (Turborepo)**
- `npm run dev` — start client and server in development mode;
- `npm run build` — build both workspaces;
- `npm run lint` — lint all workspaces.

**Client (`client/`)**
- `npm run dev` — start the Vite dev server;
- `npm run build` — type-check (`tsc -b`) and build for production;
- `npm run preview` — preview the production build locally;
- `npm run lint` — lint the code with Oxlint.

**Server (`server/`)**
- `npm run dev` — start the API with nodemon + ts-node (auto-reload);
- `npm run build` — compile TypeScript to `dist/`;
- `npm start` — run the compiled server;
- `npm run prisma:generate` — regenerate the Prisma client.

---

## 👥 Authors

Built by the **MishSoft** team:

- **Mishiko Aspanidze** — [GitHub profile](https://github.com/MishSoft)
- **Mariami Lomsadze** — [GitHub profile](https://github.com/mariamilomsadze)
- **Demo Lomsadze** — [GitHub profile](https://github.com/Demsource)
