# PostCraft Blog

A full-stack blog built with **React** (frontend) and **Laravel 12** (backend REST API).

Writers can sign up, write posts in Markdown, add a cover image, pick a category and tags, and save drafts or publish. Readers can browse, search, filter and comment.

---

## Features

- **Authentication**: register, log in and log out with API tokens (Laravel Sanctum)
- **Posts**: create, edit and delete posts, written in Markdown with a live preview
- **Drafts and publishing**: drafts are only visible to their author
- **Cover images**: upload, replace or remove a post's cover image
- **Categories and tags**: filter posts by either; tags are created automatically
- **Search**: search post titles, excerpts and content
- **Comments**: logged-in users can comment. A comment can be deleted by its author, the post's author or an admin.
- **Author pages**: each author has a profile page with their bio and posts
- **Dashboard**: manage your posts, edit your profile, and (admins only) manage categories
- **Pagination**, responsive layout, and automatic dark mode

---

## Tech stack

| Part     | Technology                                              |
| -------- | ------------------------------------------------------- |
| Frontend | React 18, React Router 6, Axios, React Markdown, Vite   |
| Backend  | Laravel 12, PHP 8.2+, Laravel Sanctum                   |
| Database | SQLite by default (MySQL also works)                    |

---

## Requirements

Install these first:

- **PHP 8.2 or newer**, with the `sqlite3`, `mbstring`, `xml`, `curl` and `fileinfo` extensions
- **Composer**: <https://getcomposer.org>
- **Node.js 18 or newer** (includes npm): <https://nodejs.org>

Check that they are installed:

```bash
php -v
composer -V
node -v
```

> **Ubuntu/Debian quick install:**
> `sudo apt install php php-sqlite3 php-mbstring php-xml php-curl composer`

---

## How to run the project

You need **two terminals**, one for the backend and one for the frontend.

### 1. Start the backend (Laravel API)

```bash
cd backend
composer run setup      # first time only
php artisan serve
```

The API now runs at **http://localhost:8000**.

`composer run setup` does all of this for you:
installs PHP packages → creates `.env` → generates the app key → creates the SQLite database → creates the tables and adds demo data → links the image storage folder.

### 2. Start the frontend (React)

Open a **new terminal**:

```bash
cd frontend
npm install             # first time only
cp .env.example .env    # first time only
npm run dev
```

Open **http://localhost:5173** in your browser. 🎉

### 3. Log in with a demo account

| Role   | Email               | Password   |
| ------ | ------------------- | ---------- |
| Admin  | `admin@example.com` | `password` |
| Author | `jane@example.com`  | `password` |

You can also create your own account with **Sign up**.

---

## Everyday commands

| What                                 | Command (run inside the folder shown)            |
| ------------------------------------ | ------------------------------------------------ |
| Start API                            | `backend` → `php artisan serve`                  |
| Start React app                      | `frontend` → `npm run dev`                       |
| Reset database and demo data         | `backend` → `php artisan migrate:fresh --seed`   |
| Run backend tests                    | `backend` → `php artisan test`                   |
| Build frontend for production        | `frontend` → `npm run build` (output in `dist/`) |

---

## Using MySQL instead of SQLite (optional)

1. Create an empty database, for example `blog`.
2. Edit `backend/.env`:
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=blog
   DB_USERNAME=root
   DB_PASSWORD=your_password
   ```
3. Run `php artisan migrate:fresh --seed`.

---

## Project structure

```
blog/
├── backend/                         # Laravel REST API
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/Api/     # Auth, Post, Comment, Category, Tag, User
│   │   │   ├── Middleware/          # EnsureUserIsAdmin
│   │   │   ├── Requests/            # Validation rules
│   │   │   └── Resources/           # JSON response format
│   │   ├── Models/                  # User, Post, Category, Tag, Comment
│   │   ├── Policies/                # Who can edit or delete what
│   │   └── Services/PostService.php # Post create/update logic (tags, images)
│   ├── config/cors.php              # Allows the React app to call the API
│   ├── database/
│   │   ├── migrations/              # Table definitions
│   │   ├── factories/               # Fake data generators
│   │   └── seeders/                 # Demo data
│   ├── routes/api.php               # All API endpoints
│   └── tests/Feature/               # API tests
│
└── frontend/                        # React app (Vite)
    └── src/
        ├── api/                     # All HTTP calls (axios)
        ├── components/
        │   ├── common/              # Button, Input, Modal, Pagination…
        │   ├── layout/              # Navbar, Footer, Sidebar, MainLayout
        │   ├── posts/               # PostCard, PostList, PostForm, Markdown
        │   └── comments/            # CommentList, CommentForm
        ├── context/AuthContext.jsx  # Logged-in user and token
        ├── hooks/                   # useAuth, useFetch, useDebounce…
        ├── pages/                   # One file per screen
        │   ├── auth/                # Login, Register
        │   └── dashboard/           # MyPosts, CreatePost, EditPost, Profile, Categories
        ├── routes/                  # Router and protected routes
        └── assets/styles/global.css # All styling
```

---

## API endpoints

Base URL: `http://localhost:8000/api`.
Protected routes need the header `Authorization: Bearer <token>`. You get the token from login or register.

| Method | Endpoint                    | Auth  | Description                                              |
| ------ | --------------------------- | ----- | -------------------------------------------------------- |
| POST   | `/register`                 | —     | Create account → `{ user, token }`                       |
| POST   | `/login`                    | —     | Log in → `{ user, token }`                               |
| POST   | `/logout`                   | ✅    | Revoke current token                                     |
| GET    | `/user`                     | ✅    | Current user                                             |
| PUT    | `/user`                     | ✅    | Update name, email, bio                                  |
| GET    | `/posts`                    | —     | Published posts. Query: `search`, `category`, `tag`, `author`, `page` |
| GET    | `/posts/{slug}`             | —     | Single post (drafts only for their author)               |
| POST   | `/posts`                    | ✅    | Create post (multipart, `cover_image` optional)          |
| PUT    | `/posts/{id}`               | ✅    | Update post (send as POST with `_method=PUT` when uploading a file) |
| DELETE | `/posts/{id}`               | ✅    | Delete post                                              |
| GET    | `/me/posts`                 | ✅    | Your posts, including drafts                             |
| GET    | `/posts/{slug}/comments`    | —     | Comments for a post                                      |
| POST   | `/posts/{slug}/comments`    | ✅    | Add a comment                                            |
| DELETE | `/comments/{id}`            | ✅    | Delete a comment                                         |
| GET    | `/categories`               | —     | All categories with post counts                          |
| GET    | `/categories/{slug}`        | —     | One category                                             |
| POST   | `/categories`               | Admin | Create category                                          |
| DELETE | `/categories/{id}`          | Admin | Delete category                                          |
| GET    | `/tags`                     | —     | Tags in use                                              |
| GET    | `/users/{id}`               | —     | Public author profile                                    |

Quick test from the terminal:

```bash
curl http://localhost:8000/api/posts
```

---

## Troubleshooting

| Problem | Fix |
| ------- | --- |
| **"Cannot reach the server"** in the browser | The API isn't running. Run `php artisan serve` in `backend/`. |
| **CORS error** in the browser console | Make sure `FRONTEND_URL=http://localhost:5173` is set in `backend/.env`, then restart `php artisan serve`. |
| **Cover images don't show** | Run `php artisan storage:link` and check that `APP_URL=http://localhost:8000` is set in `backend/.env`. |
| **`could not find driver`** | Install the PHP SQLite extension, e.g. `sudo apt install php-sqlite3`. |
| **Port already in use** | Use another port, e.g. `php artisan serve --port=8001`, and update `VITE_API_URL` in `frontend/.env`. |
| **Changed `frontend/.env` but nothing happened** | Stop and restart `npm run dev`. Vite only reads `.env` on startup. |
| **`composer install` / `npm install` time out** | Your network's IPv6 may be broken. Force IPv4: `COMPOSER_IPRESOLVE=4 composer install` and `NODE_OPTIONS=--dns-result-order=ipv4first npm install --maxsockets=3` |
| **Want a clean start** | Run `php artisan migrate:fresh --seed`, and clear the site's localStorage in your browser. |

---

## License

MIT
