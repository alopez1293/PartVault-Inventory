# PartVault Inventory Developer Guide

## Table of Contents

1. [System Requirements](#system-requirements)
2. [Local Development Setup](#local-development-setup)
3. [Project Structure](#project-structure)
4. [Architecture Overview](#architecture-overview)
5. [Database Setup](#database-setup)
6. [Running Tests](#running-tests)
7. [Deployment Guide](#deployment-guide)
8. [Security Notes](#security-notes)

## System Requirements

PartVault Inventory is a Node.js web application that uses Express, EJS, and MySQL. A developer setting up this project should have a working local development environment with the tools needed to install dependencies, run the application server, and connect to a MySQL database.

### Required Tools

- Node.js
- npm
- MySQL Server
- A code editor such as Visual Studio Code
- A web browser such as Google Chrome or Microsoft Edge
- An API testing tool such as Thunder Client

### Required Libraries

This project uses the following major packages:

- express
- ejs
- express-ejs-layouts
- mysql2
- dotenv
- bcryptjs
- jsonwebtoken
- cors
- nodemon

### Operating System

This project is intended to run in a standard local development environment. It can be developed on Windows, macOS, or Linux as long as Node.js, npm, and MySQL are installed and configured correctly.

## Local Development Setup

This section explains how to clone, configure, and run PartVault Inventory on a local machine.

### 1. Clone the Repository

Clone the project repository to your local machine.

```bash
git clone <your-repository-url>
cd <your-project-folder>
```

### 2. Install Dependencies

Install the required Node.js packages.

```bash
npm install
```

### 3. Create the Environment File

Create a `.env` file in the project root based on the provided `.env.example` file.

Example environment variables:

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

### 4. Start MySQL

Make sure your MySQL server is running before initializing the database.

### 5. Initialize the Database

Run the database initialization script.

```bash
npm run db:init
```

This script creates the database if it does not already exist, selects it, and applies the schema from `database/schema.sql`.

### 6. Test the Database Connection

Optional but recommended:

```bash
npm run db:test
```

This verifies that the application can connect to MySQL and read sample user data.

### 7. Start the Development Server

Run the app in development mode.

```bash
npm run dev
```

This starts the Express server using nodemon.

### 8. Open the Application

Open your browser and go to:

```text
http://localhost:3000
```

If your local environment uses a different port, update the URL accordingly.

## Project Structure

PartVault Inventory is organized into folders that separate routing, database logic, authentication, static files, and EJS views.

### High-Level Structure

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
.env
.env.example
package.json
README.md
server.js
```

### Folder and File Purpose

#### `auth/`

Contains authentication and authorization helpers such as JWT validation, middleware protection, and permission checks.

#### `config/`

Stores central application configuration, including environment-based database and authentication settings.

#### `database/`

Contains the database connection layer, schema initialization logic, test scripts, and query modules.

- `connection.js` creates the MySQL connection pool.
- `init.js` creates the database and applies the schema.
- `schema.sql` defines tables, relationships, and seed/sample data.
- `testDb.js` verifies database connectivity and basic query functionality.
- `queries/` contains reusable database query modules.

#### `public/`

Stores static frontend assets.

- `css/` contains stylesheets
- `images/` contains image assets
- `js/` contains client-side JavaScript

#### `routes/`

Contains Express route modules for pages and API endpoints.

Examples include:

- `pages.js`
- `auth.js`
- `users.js`
- `parts.js`
- `checkouts.js`
- `locations.js`
- `reports.js`
- `inventoryTransactions.js`
- `admin.js`

#### `views/`

Contains EJS templates.

- `layouts/` stores the main layout wrapper
- `partials/` stores reusable shared UI pieces such as header, navigation, and footer
- `pages/` stores page-specific EJS templates

#### `server.js`

The main application entry point that starts the Express server and registers middleware, views, and routes.

#### `package.json`

Defines project metadata, dependencies, and npm scripts.

## Architecture Overview

PartVault Inventory uses a server-rendered web application architecture with an Express backend, EJS templates for page rendering, and a MySQL database for persistent storage.

### Request Flow

1. A user opens the application in a web browser.
2. The browser sends a request to the Express server.
3. The server either renders an EJS page or returns a JSON API response.
4. For protected routes, authentication middleware validates the JWT.
5. For permission-based routes, authorization middleware checks whether the authenticated user has the required permission.
6. If database access is needed, the server uses the MySQL connection layer and query modules to read or write data.
7. The server returns the rendered page or API response to the browser or client tool.

### Frontend, Backend, and Database Interaction

- The frontend layer is built with EJS templates, shared layouts, partials, custom CSS, and client-side assets in the `public` folder.
- The backend layer is built with Express route handlers and middleware that manage page rendering, authentication, authorization, and API behavior.
- The database layer is MySQL, which stores users, roles, permissions, parts, bins, locations, checkouts, transaction records, and audit logs.

### Authentication and Authorization Flow

1. A user registers or logs in through the auth API.
2. On successful login, the server returns a signed JWT.
3. The token is sent in the `Authorization` header using the Bearer format for protected API requests.
4. Middleware validates the token and identifies the current user.
5. Permission middleware checks whether the user may access the requested route.

### Architecture Summary Diagram

```text
Browser / Client
      |
      v
Express Server
  - Page Routes
  - API Routes
  - Auth Middleware
  - Permission Middleware
      |
      v
EJS Views / JSON Responses
      |
      v
MySQL Database
```

## Database Setup

This project uses MySQL for persistent storage.

### Schema Initialization

The database is initialized with:

```bash
npm run db:init
```

This process:

1. Connects to MySQL without selecting a database first
2. Creates the database if it does not already exist
3. Selects the configured database
4. Executes the SQL in `database/schema.sql`

### Main Database Areas

The schema includes tables for:

- users
- roles
- permissions
- user_roles
- role_permissions
- locations
- parts
- bins
- bin_parts
- checkouts
- checkout_items
- inventory_transactions
- audit_logs

### Seed and Sample Data

The schema file also includes sample or starter data for core records such as roles, permissions, users, locations, parts, bins, and inventory relationships. This helps support local development and early testing.

### Database Connection

The application uses a MySQL connection pool configured through environment variables. If the database connection fails, check that:

- MySQL is running
- the host, port, username, password, and database name are correct
- the `.env` file matches your local MySQL setup

## Running Tests

At the current stage of the project, testing is primarily manual, with a database connection script and API validation performed through Thunder Client.

### Database Connection Test

To verify the database connection and basic query behavior, run:

```bash
npm run db:test
```

This script checks the MySQL connection and attempts to read sample user data.

### API Testing

API behavior has been tested manually using Thunder Client.

Current testing focus includes:

- registration validation
- login success and failure cases
- protected route access
- permission-based access control
- logout behavior
- admin route protection

### Interpreting Results

Typical expected results include:

- `200 OK` for successful reads and valid requests
- `201 Created` for successful create actions
- `204 No Content` for successful delete actions
- `400 Bad Request` for missing or invalid input
- `401 Unauthorized` for missing or invalid authentication
- `403 Forbidden` for authenticated users without permission
- `409 Conflict` for duplicate registration values
- `500 Internal Server Error` for unexpected server failures

### Current Testing Limitation

This project does not currently include a formal automated test suite such as Jest, Mocha, or Supertest. Testing is currently a mix of manual endpoint validation and database verification.

## Deployment Guide

At this stage, PartVault Inventory is intended to run locally as an educational project.

### Current Deployment Status

- Local development deployment only
- No live production environment
- No cloud deployment pipeline currently configured

### Local Deployment Steps

To run the app in its current intended environment:

1. Install dependencies with `npm install`
2. Configure the `.env` file
3. Make sure MySQL is running
4. Initialize the database with `npm run db:init`
5. Start the app with `npm run dev` or `npm start`
6. Open `http://localhost:3000`

### Future Deployment Considerations

If the project is deployed later, the following areas should be addressed:

- production environment variables
- secure secret management
- database hosting
- HTTPS
- persistent token invalidation strategy
- production logging and monitoring
- automated deployment workflow

## Security Notes

PartVault Inventory includes several core security decisions that developers should understand before changing authentication, route protection, or database behavior.

### Password Storage

Passwords are never stored in plain text. User passwords are hashed with `bcryptjs` before being saved.

### JWT Authentication

Protected routes require a valid JWT sent in the `Authorization` header using Bearer format.

Example:

```text
Authorization: Bearer <token>
```

### Token Expiration

JWT expiration is controlled through environment configuration. Developers should keep token lifetimes reasonable and avoid hardcoding secrets or expiration settings directly in route files.

### Logout Behavior

Logout currently works through an in-memory token denylist. This means a logged-out token is blocked only for the current server session. Restarting the server clears the denylist.

### Route Protection

Sensitive routes use authentication and permission middleware. When adding new routes, developers should explicitly decide:

- whether the route is public or protected
- whether the route needs role or permission checks
- what failure response should be returned for unauthorized access

### Role-Based Access Control

The project uses RBAC with roles and permissions. Changes to role or permission logic should be made carefully because they can affect access across the application.

### Environment Variables and Secrets

Sensitive values such as database credentials and the JWT secret must be stored in environment variables, not hardcoded in the repository.

Important values include:

- `DB_HOST`
- `DB_PORT`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`

### Database Query Safety

The application uses MySQL through `mysql2`, and database access should continue using parameterized queries or controlled query helpers to reduce the risk of SQL injection.

### Security Caution for Future Development

If you expand this project in future sprints, prioritize the following:

- server-side validation for all user input
- stronger audit logging for admin actions
- persistent token invalidation
- stricter protection for rendered frontend pages
- production-safe error handling
