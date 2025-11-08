# West Recovery Map

The **West Recovery Map** is a lightweight crisis-mapping tool to track community-level damage and urgent needs in western Jamaica after the recent Category 5 hurricane.

It has two main parts:

- `backend/` – Laravel API that stores reports and provides aggregated community-level data
- `frontend/` – React app for:
  - A public, mobile-friendly report form
  - An admin dashboard (map + table) for planners and responders

## Repos / Folders

- **Backend** – see [`backend/README.md`](backend/README.md) for:
  - Setup (PHP, composer, DB)
  - API docs (`POST /api/reports`, `GET /api/admin/communities/summary`)

- **Frontend** – see [`frontend/README.md`](frontend/README.md) for:
  - Setup (Node, npm)
  - Environment variables
  - How to run the public form + admin dashboard

## Quick Start (for devs)

```bash
# Backend
cd backend
cp .env.example .env
# configure DB in .env
composer install
php artisan key:generate
php artisan migrate
php artisan serve

# Frontend (in a second terminal)
cd ../frontend
npm install
npm run dev
