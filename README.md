# PartVault Inventory

PartVault Inventory is a parts inventory and checkout management web application. It allows guest users to view public pages, authenticated users to browse inventory and manage their own checkout activity, and administrators to manage users, roles, and permissions. The project combines server-rendered pages with protected backend API routes and a MySQL database foundation for future business logic expansion.

## Technology Stack

- **Backend:** Express.js
- **Template Engine:** EJS
- **Database:** MySQL
- **Database Driver:** mysql2
- **Authentication:** JSON Web Tokens (JWT)
- **Password Hashing:** bcryptjs
- **Layouts and Reusable UI:** express-ejs-layouts with shared partials
- **Styling:** Custom CSS
- **API Testing:** Thunder Client
- **Development Tooling:** nodemon

## Quick Start

These steps are enough for an experienced developer to clone and run the project locally in a few minutes.

### 1. Clone the repository

```bash
git clone https://github.com/alopez1293/PartVault-Inventory.git
cd <your-project-folder>
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create your `.env` file

Create a `.env` file in the project root based on `.env.example`.

Example values:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=parts_app
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=1h
```

### 4. Initialize the database

```bash
npm run db:init
```

### 5. Start the development server

```bash
npm run dev
```

### 6. Open the application

```text
http://localhost:3000
```

If needed, verify database connectivity with:

```bash
npm run db:test
```

## Project Features

### Guest Features

- View the Home page
- View the About page
- Register a new account
- Log in to an existing account
- Access the reset password page

### Authenticated User Features

- View the dashboard
- Browse the parts list
- View personal checkout activity
- Create checkout requests
- View the transactions log
- View reports available to the user role
- Access the profile page

### Admin Features

- Access the admin dashboard
- Manage users
- Manage roles
- Manage role permissions
- Access protected administrative API routes

## Implemented Pages

### Public Pages

- `/`
- `/about`
- `/login`
- `/register`
- `/reset-password`
- `/403`
- `/404`

### Signed-In Pages

- `/dashboard`
- `/parts-list`
- `/checkouts`
- `/checkouts/create`
- `/profile`
- `/transactions-log`
- `/reports`

### Admin Pages

- `/admin/dashboard`
- `/admin/users`
- `/admin/roles`
- `/admin/permissions`

## Documentation

All project documentation is stored in the `/docs` folder.

- [User Guide](docs/user-guide.md)
- [Developer Guide](docs/developer-guide.md)
- [API Reference](docs/api-reference-condensed.md)
- [Troubleshooting and Support Reference](docs/troubleshooting-support.md)

## API Summary

PartVault Inventory includes backend routes for:

- Authentication
- Users
- Parts
- Checkouts
- Locations and bins
- Reports
- Inventory transactions
- Admin user, role, and permission management

The full endpoint documentation is available in the API reference.

## Authentication and Authorization

The application uses JWT-based authentication and role-based access control.

- Users log in with a username or email and password
- Successful login returns a JWT
- Protected routes require a Bearer token
- Admin routes require additional permissions
- Passwords are hashed with bcryptjs before storage

Example authorization header:

```text
Authorization: Bearer <token>
```

## Project Structure

```text
auth/
config/
database/
  queries/
  connection.js
  init.js
  schema.sql
  testDb.js
public/
  css/
  images/
  js/
routes/
views/
  layouts/
  pages/
  partials/
.env.example
package.json
README.md
server.js
docs/
```

## Current Status

The authentication and authorization portions of the backend are the most complete parts of the application. Many business-data routes are active and protected, but some still return stub or placeholder responses while the full inventory and reporting workflows continue to be developed.

## License

Educational Use Only
