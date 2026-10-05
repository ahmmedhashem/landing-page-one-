# Open House Landing Page

A single landing page (Laravel 13 + React via Inertia) with a registration form and an admin dashboard to edit the page content and view incoming leads.

## Features

- **Landing page** – header, hero image, title, description, details list, "Register now" button, footer.
- **Registration form** (modal) – Name, Mobile and a dropdown question. Submissions are validated and stored as leads.
- **Dashboard** (`/dashboard`, login required)
  - **Leads** – list with search, pagination, new/unread markers, delete and CSV export. Auto-refreshes every 30 seconds.
  - **Page content** – edit every text on the page, the details list, the dropdown question and its options, the success message, header/footer text, and upload the hero image.

## Setup

Requirements: PHP 8.3+, Composer, Node 20+.

```bash
composer install
npm install
cp .env.example .env
php artisan key:generate
touch database/database.sqlite
php artisan migrate --seed
php artisan storage:link
npm run build
php artisan serve
```

Open http://localhost:8000 for the landing page and http://localhost:8000/login for the dashboard.

Default admin login (set `ADMIN_EMAIL` / `ADMIN_PASSWORD` in `.env` before seeding to change it):

- Email: `admin@example.com`
- Password: `password`

For development with hot reload run `npm run dev` alongside `php artisan serve`.

## Tests

```bash
php artisan test
```

## Structure

| Path | Purpose |
| --- | --- |
| `app/Http/Controllers/LandingController.php` | Public page + lead submission |
| `app/Http/Controllers/Dashboard/` | Leads list/export and content editor |
| `app/Models/PageContent.php` | Page content (with defaults) |
| `app/Models/Lead.php` | Submitted leads |
| `resources/js/pages/Landing.jsx` | Landing page |
| `resources/js/components/RegisterModal.jsx` | Registration form |
| `resources/js/pages/Dashboard/` | Dashboard screens |
