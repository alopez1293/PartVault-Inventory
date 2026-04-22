# PartVault Inventory

## Project Overview

PartVault Inventory is a parts inventory and checkout management web application built with Express.js, EJS, MySQL, and custom CSS. The project began with a frontend implementation based on approved wireframes and has now been extended with backend authentication and authorization features.

The application supports public pages, signed-in user pages, and admin pages. It also includes a database-backed user system with registration, login, logout, JWT-based authentication, and role-based access control (RBAC).

Current goals of the project:

- Render all required pages through the backend server
- Use shared layouts and partials for consistent UI
- Support responsive desktop, tablet, and mobile layouts
- Provide working backend authentication and authorization
- Protect sensitive API routes with real access control
- Establish a foundation for future database-driven business logic

## Tech Stack

- Backend framework: Express.js
- Template engine: EJS
- Database: MySQL
- Database driver: mysql2
- Authentication: JSON Web Tokens (JWT)
- Password hashing: bcryptjs
- Layout approach: shared main layout with reusable partials
- Styling: custom CSS with responsive media queries
- API testing: Thunder Client

## How to Start the Server and View the Site

1. Open a terminal in the project root.
2. Install dependencies if needed:
   npm install
3. Make sure your environment variables are configured in a `.env` file.
4. Initialize the database if needed:
   npm run db:init
5. Start the development server:
   npm run dev
6. Open the local site in your browser:
   http://localhost:3000

If your local environment uses a different port, update the URL accordingly.

## Template Inheritance / Layout Approach

This project uses Express + EJS.

Shared rendering structure:

- `views/layouts/main.ejs` - main layout wrapper
- `views/partials/header.ejs` - shared site header
- `views/partials/nav.ejs` - shared navigation
- `views/partials/footer.ejs` - shared footer

Each page template renders inside the shared layout, which keeps the header, navigation, footer, CSS links, and JavaScript consistent across the site.

## Templates / Pages Implemented

### Guest Pages

- `/` - Home
- `/about` - About
- `/login` - Login
- `/register` - Register
- `/reset-password` - Reset Password
- `/403` - Forbidden page
- `/404` - Not Found page

### Signed-In User Pages

- `/dashboard` - User dashboard
- `/parts-list` - Parts list
- `/checkouts` - Checkouts overview
- `/checkouts/create` - Create checkout form
- `/profile` - User profile
- `/transactions-log` - Transactions log
- `/reports` - Reports

### Admin Pages

- `/admin/dashboard` - Admin dashboard
- `/admin/users` - User management
- `/admin/roles` - Role management
- `/admin/permissions` - Permission assignment

## API Route Overview

### Auth Routes

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

### User and Inventory Routes

- `GET /api/users/ping`
- `GET /api/parts`
- `GET /api/parts/:id`
- `POST /api/parts`
- `PATCH /api/parts/:id`
- `DELETE /api/parts/:id`
- `GET /api/checkouts`
- `POST /api/checkouts`
- `GET /api/checkouts/:id`
- `PATCH /api/checkouts/:id`
- `DELETE /api/checkouts/:id`
- `POST /api/checkouts/:id/fulfill`
- `POST /api/checkouts/:id/return`
- `GET /api/locations`
- `GET /api/bins`
- `GET /api/reports/low-stock`
- `GET /api/reports/open-checkouts`
- `GET /api/inventory-transactions`
- `GET /api/inventory-transactions/:id`
- `POST /api/inventory-transactions/adjust`

### Admin Routes

- `GET /api/admin/users`
- `GET /api/admin/users/:id`
- `PATCH /api/admin/users/:id/role`
- `PATCH /api/admin/users/:id/deactivate`
- `GET /api/admin/roles`
- `POST /api/admin/roles`
- `PATCH /api/admin/roles/:id`
- `DELETE /api/admin/roles/:id`
- `GET /api/admin/permissions`
- `PUT /api/admin/roles/:id/permissions`

## Authentication and Authorization

### Authentication Strategy

This application uses JSON Web Tokens (JWT) for authentication.

Users log in with a username or email and password. If the credentials are valid, the server returns a signed JWT. Protected routes require the token in the `Authorization` header using the Bearer format.

Example:

`Authorization: Bearer <token>`

### Environment Variables

The application requires environment variables for server, database, and authentication configuration.

Required variables:

- `PORT`
- `DB_HOST`
- `DB_PORT`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`

Example `.env.example` values:

- `PORT=3000`
- `DB_HOST=localhost`
- `DB_PORT=3306`
- `DB_USER=root`
- `DB_PASSWORD=your_password_here`
- `DB_NAME=parts_app`
- `JWT_SECRET=replace_with_a_long_random_secret`
- `JWT_EXPIRES_IN=1h`

### Password Hashing

User passwords are never stored in plain text.

Passwords are hashed using `bcryptjs` before being saved to the database. During login, the submitted password is compared against the stored password hash.

### Roles and Permissions Model

The application uses role-based access control (RBAC).

Main tables:

- `users`
- `roles`
- `permissions`
- `user_roles`
- `role_permissions`

Current roles:

- `admin`
- `user`

Example permissions:

- `user.read`
- `user.update`
- `part.read`
- `part.add`
- `part.edit`
- `part.delete`
- `checkout.read.own`
- `checkout.add`
- `checkout.fulfill`
- `checkout.return`
- `admin.users.read`
- `admin.users.update`
- `role.read`
- `role.add`
- `role.edit`
- `role.delete`
- `report.read`
- `stock.adjust`

### Auth Endpoints

- `POST /api/auth/register`  
  Creates a new user account, validates input, hashes the password, and assigns the default `user` role.

- `POST /api/auth/login`  
  Validates username/email and password, then returns a JWT on success.

- `POST /api/auth/logout`  
  Invalidates the current token using an in-memory denylist for the current server session.

- `GET /api/auth/me`  
  Returns the currently authenticated user.

### Protected Routes Demonstrated

The following routes were used to demonstrate authentication and authorization behavior:

- `GET /api/auth/me` - authentication only
- `GET /api/checkouts` - user-level permission
- `POST /api/checkouts` - user-level permission
- `GET /api/admin/users` - admin-level permission
- `PATCH /api/admin/users/:id/role` - admin-level permission

## Security Practices Implemented

- Plain-text passwords are never stored
- Passwords are hashed with bcryptjs
- JWT secrets are stored in environment variables
- Protected routes require valid Bearer tokens
- Token expiration is enforced through JWT configuration
- Logout has real effect through token invalidation
- Parameterized queries are used with mysql2
- Generic auth failure messages are returned for invalid login attempts

## How to Test Authentication and Authorization

Testing was performed using Thunder Client.

### Registration Tests

- Successful registration returns `201`
- Missing required field returns `400`
- Weak password returns `400`
- Duplicate username or email returns `409`

### Login Tests

- Successful login returns `200` and a JWT
- Invalid credentials return `401`

### Protected Route Tests

- Accessing a protected route without a token returns `401`
- Accessing a protected admin route with a normal user token returns `403`
- Accessing a permitted route with a valid user token returns `200`

### Logout Tests

- Successful logout returns `200`
- Accessing a protected route after logout with the same token returns `401`

## Browser Compatibility Notes

Tested in:

- Google Chrome
- Microsoft Edge

## Special Features / Notes

- Responsive navigation with a mobile hamburger menu
- Reusable cards, buttons, forms, tables, badges, and alerts
- Shared layout and partial structure for consistent page rendering
- Public, signed-in, and admin page groups are represented
- JWT-based authentication is fully implemented
- RBAC-based route protection is fully implemented
- Backend is connected to a MySQL schema for users, roles, and permissions

## Known Limitations

- Some business-data routes still return placeholder or stub response bodies while access control is fully functional
- JWT logout currently uses an in-memory denylist, so logged-out tokens are blocked only for the current server session
- Restarting the server clears the in-memory denylist
- Some UI pages still use hardcoded or placeholder content while full database-backed page rendering is completed in future sprints
- Additional admin, reporting, and inventory workflows can be expanded further in a future sprint

## Future Improvements

- Replace in-memory token denylist with database-backed or Redis-backed token invalidation
- Connect more business routes to full database CRUD logic
- Expand audit logging for auth and admin actions
- Add automated API tests
- Add refresh token support for longer-lived authentication flows
- Enforce route protection on rendered frontend pages as well as API endpoints
