# Task Tracker

### Overview

This is a lightweight project management platform where authenticated users can create, view, and manage projects and associated tasks. The application uses a MERN stack and supports secure JWT-based authentication. There are only two primary pages:

* `/`: Login/Signup page
* `/home`: Dashboard for managing projects and tasks

> [!NOTE]
> The server may need about 50 seconds to initialize on first connection as it's hosted on Render's free tier.

---

### Pages

#### `/` – Auth Page

* Handles **user signup and login**
* Sets HTTP-only cookies: `accessToken`, `refreshToken`, `user`
* Automatically redirects to `/home` if user is already authenticated (based on cookie decryption)

#### `/home` – Dashboard

* Displays a list of projects
* Shows tasks under selected projects
* Allows project and task creation, update, and deletion
* Uses `axios` with `withCredentials` enabled to access protected backend routes

---

### Authentication Flow

1. **Signup** creates a new user with a hashed password and sets cookies
2. **Login** checks credentials and sets cookies
3. **Logout** clears cookies and refresh token in DB
4. All protected routes require a valid `accessToken` (via `verifyJWT` middleware)

---

## API Documentation

**Base URL:** `http://localhost:8000/api/users`

All protected routes require a valid JWT in cookies. Use `withCredentials: true` in frontend requests.

---

### Auth Routes

#### `POST /signup`

Registers a new user
**Body:**

```json
{
  "name": "Alice",
  "email": "alice@example.com",
  "password": "securepass123",
  "country": "USA"
}
```

#### `POST /login`

Logs in the user and sets tokens in cookies
**Body:**

```json
{
  "email": "alice@example.com",
  "password": "securepass123"
}
```

#### `GET /logout`

Logs out the user by clearing cookies and DB token
**Headers:** Requires `accessToken` cookie

#### `GET /`

Fetches current user’s basic info
**Headers:** Requires `accessToken` cookie

---

### Project Routes

#### `POST /project`

Creates a new project
**Headers:** Requires `accessToken`
**Body:**

```json
{
  "title": "New Project",
  "description": "This is a test project"
}
```

#### `DELETE /project/:projectId`

Deletes the project and all its tasks
**Params:** `projectId` – ID of the project to delete
**Headers:** Requires `accessToken`

---

### Task Routes

#### `POST /:projectId`

Creates a task under the specified project
**Params:** `projectId` – ID of the project
**Body:**

```json
{
  "title": "Setup Database",
  "description": "MongoDB setup with Mongoose"
}
```

#### `GET /:projectId`

Fetches all tasks for a project
**Params:** `projectId` – ID of the project
**Headers:** Requires `accessToken`

#### `PUT /:taskId`

Updates a task
**Params:** `taskId` – ID of the task
**Body:**

```json
{
  "title": "Setup DB Updated",
  "description": "Updated description"
}
```

#### `DELETE /:taskId`

Deletes a task
**Params:** `taskId` – ID of the task


---

### Cookies Set

* `accessToken` – HTTP-only, used for authentication
* `refreshToken` – HTTP-only, used for token refresh
* `user` – Encrypted user object for frontend access

