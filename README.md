# Internal Ticketing System (ITS)

[![Laravel](https://img.shields.io/badge/Laravel-13.2.0-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)](https://laravel.com)
[![PHP](https://img.shields.io/badge/PHP-8.5.4-777BB4?style=for-the-badge&logo=php&logoColor=white)](https://www.php.net)
[![Composer](https://img.shields.io/badge/Composer-2.9.5-885630?style=for-the-badge&logo=composer&logoColor=white)](https://getcomposer.org)
[![React](https://img.shields.io/badge/React-19.x-149ECA?style=for-the-badge&logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-7.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![License](https://img.shields.io/badge/License-Internal%20Use%20Only-222?style=for-the-badge)](#license)

Production-focused internal web platform for managing service tickets across systems, categories, and teams.

## Overview

ITS is built for internal operations where fast triage, clear assignment, and consistent ticket lifecycle tracking are critical.

The app covers:
- Ticket creation, assignment, follow-up, closure, and archival
- Role-based access flows (Admin, support roles, etc.)
- Maintenance modules for core dropdown data (systems, categories, priorities, ownerships, store types)
- Dashboard and reporting views for operations visibility

## Tech Stack

### Backend
- Laravel 13.2.0
- PHP 8.5.4
- MySQL / MariaDB
- Spatie Permission
- Ziggy + Inertia (Laravel adapter)

### Frontend
- React 19 + TypeScript
- Inertia.js (React adapter)
- Material UI + Tailwind CSS
- TanStack Query + Zustand
- React Hook Form + Zod
- Vite + PNPM

## Current Runtime (Verified)

| Tool | Version |
|---|---|
| Laravel Framework | `13.2.0` |
| PHP | `8.5.4` |
| Composer | `2.9.5` |
| Node.js | `22.x` |
| PNPM | `10.x` |

## Project Structure

```text
app/                    # Laravel application code
database/               # Migrations, seeders, factories
resources/js/           # React + TypeScript frontend
resources/css/          # Global styles
routes/                 # Web/API route definitions
public/                 # Public assets
```

## Local Setup

### Prerequisites
- PHP `8.5+`
- Composer `2.9+`
- Node.js `22+`
- PNPM `10+`
- MySQL/MariaDB

### 1) Clone

```bash
git clone https://github.com/limportugal/its-.git
cd its-
```

### 2) Install Dependencies

```bash
composer install
pnpm install
```

### 3) Environment

```bash
cp .env.example .env
php artisan key:generate
```

Update your database credentials in `.env`, then run:

```bash
php artisan migrate --seed
```

### 4) Run Dev Servers

```bash
php artisan serve
pnpm dev
```

## Useful Commands

```bash
# Type safety
pnpm typecheck

# Linting
pnpm lint
pnpm lint:fix

# Build
pnpm build
pnpm build:strict

# Queue worker
php artisan queue:work
```

## Production Notes

- Keep `.env` out of git history.
- Use queue workers and process supervisor in production.
- Build frontend assets with `pnpm build`.
- Run `php artisan optimize` after deployment.
- Keep secrets in environment variables only (never in committed files).

## Security

If credentials are exposed in commits:
- Rotate secrets immediately.
- Remove leaked files/values from git history.
- Push only after repository push-protection checks pass.

## Contributing

1. Create a feature branch
2. Commit with clear scope (`feat:`, `fix:`, `refactor:`)
3. Open a pull request with testing notes and screenshots (if UI changes)

## License

Internal Use Only.  
Copyright (c) Phillogix / ITS Team.
