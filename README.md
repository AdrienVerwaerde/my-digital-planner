# 🎉 Event Planning App

This project is a full-stack event management application built with **Next.js (App Router)**, **NextAuth** for authentication, **Prisma** for database access, and **PostgreSQL** for data persistence. It allows users to view and participate in events, and lets admins manage events and review user-submitted suggestions.

---

## 📦 Tech Stack

- **Frontend:** React (Next.js App Router), Material UI (MUI)
- **Backend:** Next.js API Routes, Prisma ORM
- **Database:** PostgreSQL
- **Authentication:** NextAuth (Google OAuth + Credentials)
- **Testing:** Jest, Supertest

---

## ⚙️ Configuration

Before running the app, make sure you have:

- **Node.js** v18+
- **PostgreSQL** installed locally or use a hosted database (e.g., Supabase, Railway)
- `.env` file configured

### 1. Install dependencies

```bash
npm install
```

### 2. Set up the `.env` file

Create a `.env` file at the root of the project:

```env
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

> Replace the database URL and Google credentials with your own.

---

## 🗃️ Database Setup

### 1. Generate Prisma client

```bash
npx prisma generate
```

### 2. Run migrations

```bash
npx prisma migrate dev --name init
```

### 3. Optional: Seed the database

If you have a seed file:

```bash
npx prisma db seed
```

---

## 🚀 Running the App

### In development:

```bash
npm run dev
```

This will start the app at [http://localhost:3000](http://localhost:3000).

### In production:

```bash
npm run build
npm start
```

---

## 🔐 Authentication

This app uses **NextAuth** with:

- Email/password login (Credentials Provider)
- Google OAuth login

Make sure Google credentials are configured correctly in your `.env`.

---

## 🧪 Running Tests

Tests are written with **Jest** and **Supertest** for API route validation.

```bash
npm run test
```

---

## 📁 Project Structure

```
/app
  /api
    /admin        → Admin-only routes
    /user-events  → Event creation and participation
    /event-types  → Event type listings
    /locations    → Location queries
  /dashboard      → Admin UI
  /components     → Shared components
/lib              → authOptions, Prisma client
/prisma           → schema.prisma, migrations
/public           → Static files
/tests            → Jest + Supertest test cases
```

---

## 👥 Roles

- **STUDENT**: Can propose and join events.
- **ADMIN**: Can manage all events, users, locations and review suggestions.

---

## 💡 Features

- Google and email authentication
- Create, edit, delete events/users/locations (admin)
- Join/leave events (student)
- Propose new event ideas with validation
- Full dashboard for event and suggestion management
- Responsive UI with Material UI

---
