# PartVault Inventory API Reference

## Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Auth Endpoints](#auth-endpoints)
4. [Core API Endpoints](#core-api-endpoints)
5. [Admin API Endpoints](#admin-api-endpoints)
6. [Common Response Patterns](#common-response-patterns)
7. [Current Implementation Notes](#current-implementation-notes)

## Overview

This document describes the current backend API for PartVault Inventory.

**Local Base URL**

```text
http://localhost:3000
```

Most protected endpoints require a JWT in the `Authorization` header:

```text
Authorization: Bearer <token>
```

## Authentication

### Auth Rules

- Public endpoints do not require a token.
- Protected endpoints require a valid JWT.
- Permission-protected endpoints require both a valid JWT and the correct permission.
- The current role model is centered on `user` and `admin`.

### Content Type

Unless otherwise noted, request bodies should be sent as JSON.

```text
Content-Type: application/json
```

## Auth Endpoints

### POST /api/auth/register

Creates a new user account.

**Auth:** Public

**Required fields**

- `username` (string)
- `email` (string, valid email)
- `password` (string, at least 8 characters with uppercase, lowercase, and a number)

**Example request**

```json
{
  "username": "alex",
  "email": "alex@example.com",
  "password": "StrongPass1"
}
```

**Success**

- `201 Created`

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user_id": 3,
    "username": "alex",
    "email": "alex@example.com"
  }
}
```

**Common errors**

- `400 Bad Request` for missing fields, invalid email, or weak password
- `409 Conflict` for duplicate username or email
- `500 Internal Server Error`

---

### POST /api/auth/login

Authenticates a user with username or email plus password.

**Auth:** Public

**Required fields**

- `login` (string)
- `password` (string)

**Example request**

```json
{
  "login": "alex",
  "password": "StrongPass1"
}
```

**Success**

- `200 OK`

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "<jwt>",
    "token_type": "Bearer",
    "expires_in": "1h",
    "user": {
      "user_id": 1,
      "username": "alex",
      "email": "alex@example.com",
      "roles": ["user"]
    }
  }
}
```

**Common errors**

- `400 Bad Request` for missing login or password
- `401 Unauthorized` for invalid credentials
- `500 Internal Server Error`

---

### POST /api/auth/logout

Logs out the current user by invalidating the current token for the active server session.

**Auth:** Requires JWT

**Success**

- `200 OK`

```json
{
  "success": true,
  "message": "Logout successful"
}
```

**Common errors**

- `401 Unauthorized`

---

### POST /api/auth/password-reset/request

Stub endpoint for a future password reset request flow.

**Auth:** Public

**Example request**

```json
{
  "email": "alex@example.com"
}
```

**Success**

- `200 OK`

```json
{
  "success": true,
  "message": "POST /api/auth/password-reset/request - Route working",
  "note": "Stub: will send reset link/code later",
  "received": {
    "email": "alex@example.com"
  }
}
```

---

### POST /api/auth/password-reset/confirm

Stub endpoint for a future password reset confirmation flow.

**Auth:** Public

**Example request**

```json
{
  "token": "reset-token",
  "newPassword": "StrongPass1"
}
```

**Success**

- `200 OK`

```json
{
  "success": true,
  "message": "POST /api/auth/password-reset/confirm - Route working",
  "note": "Stub: will verify token + set password later",
  "received": {
    "token": "reset-token",
    "newPassword": "StrongPass1"
  }
}
```

---

### GET /api/auth/me

Returns the currently authenticated user.

**Auth:** Requires JWT

**Success**

- `200 OK`

```json
{
  "success": true,
  "message": "Authenticated user retrieved successfully",
  "data": {
    "sub": 1,
    "username": "alex",
    "email": "alex@example.com"
  }
}
```

**Common errors**

- `401 Unauthorized`

## Core API Endpoints

### Users

#### GET /api/users/ping

Simple route check.

**Auth:** Public  
**Success:** `200 OK`

```json
{
  "success": true,
  "message": "GET /api/users/ping - working"
}
```

### Parts

#### GET /api/parts

Lists parts.

**Auth:** Requires JWT  
**Current state:** Stub  
**Success:** `200 OK`

#### GET /api/parts/:id

Gets one part by ID.

**Auth:** Requires JWT  
**Current state:** Stub  
**Success:** `200 OK`

#### POST /api/parts

Creates a part.

**Auth:** Requires JWT + `part.add`  
**Current state:** Stub that echoes request body  
**Success:** `201 Created`

#### PATCH /api/parts/:id

Updates a part.

**Auth:** Requires JWT + `part.edit`  
**Current state:** Stub that echoes request body  
**Success:** `200 OK`

#### DELETE /api/parts/:id

Deletes or deactivates a part.

**Auth:** Requires JWT + `part.delete`  
**Success:** `204 No Content`

### Checkouts

#### GET /api/checkouts

Lists checkout requests visible to the current user.

**Auth:** Requires JWT + `checkout.read.own`  
**Current state:** Stub  
**Success:** `200 OK`

#### GET /api/checkouts/:id

Gets one checkout by ID.

**Auth:** Requires JWT  
**Current state:** Stub  
**Success:** `200 OK`

#### POST /api/checkouts

Creates a checkout request.

**Auth:** Requires JWT + `checkout.add`  
**Current state:** Stub that echoes request body  
**Success:** `201 Created`

#### PATCH /api/checkouts/:id

Updates a checkout request.

**Auth:** Requires JWT  
**Current state:** Stub that echoes request body  
**Success:** `200 OK`

#### DELETE /api/checkouts/:id

Cancels a checkout request.

**Auth:** Requires JWT  
**Success:** `204 No Content`

#### POST /api/checkouts/:id/fulfill

Fulfills a checkout request.

**Auth:** Requires JWT + `checkout.fulfill`  
**Current state:** Stub that echoes request body  
**Success:** `200 OK`

#### POST /api/checkouts/:id/return

Processes returned items.

**Auth:** Requires JWT + `checkout.return`  
**Current state:** Stub that echoes request body  
**Success:** `200 OK`

### Locations and Bins

#### GET /api/locations

Lists locations.

**Auth:** Requires JWT  
**Current state:** Stub  
**Success:** `200 OK`

#### GET /api/bins

Lists bins.

**Auth:** Requires JWT  
**Current state:** Stub  
**Success:** `200 OK`

### Reports

#### GET /api/reports/low-stock

Returns low-stock report data.

**Auth:** Requires JWT + `report.read`  
**Current state:** Stub  
**Success:** `200 OK`

#### GET /api/reports/open-checkouts

Returns open-checkout report data.

**Auth:** Requires JWT + `report.read`  
**Current state:** Stub  
**Success:** `200 OK`

### Inventory Transactions

#### GET /api/inventory-transactions

Lists inventory transactions.

**Auth:** Requires JWT + `report.read`  
**Current state:** Stub  
**Success:** `200 OK`

#### GET /api/inventory-transactions/:id

Gets one inventory transaction by ID.

**Auth:** Requires JWT + `report.read`  
**Current state:** Stub  
**Success:** `200 OK`

#### POST /api/inventory-transactions/adjust

Creates a stock adjustment transaction.

**Auth:** Requires JWT + `stock.adjust`  
**Current state:** Stub that echoes request body  
**Success:** `201 Created`

## Admin API Endpoints

#### GET /api/admin/users

Lists users.

**Auth:** Requires JWT + `admin.users.read`  
**Current state:** Stub  
**Success:** `200 OK`

#### GET /api/admin/users/:id

Gets one user and role details.

**Auth:** Requires JWT + `admin.users.read`  
**Current state:** Stub  
**Success:** `200 OK`

#### PATCH /api/admin/users/:id/role

Changes a user's role.

**Auth:** Requires JWT + `admin.users.update`  
**Current state:** Stub that echoes request body  
**Success:** `200 OK`

#### PATCH /api/admin/users/:id/deactivate

Deactivates a user.

**Auth:** Requires JWT + `admin.users.update`  
**Current state:** Stub that echoes request body  
**Success:** `200 OK`

#### GET /api/admin/roles

Lists roles.

**Auth:** Requires JWT + `role.read`  
**Current state:** Stub  
**Success:** `200 OK`

#### POST /api/admin/roles

Creates a role.

**Auth:** Requires JWT + `role.add`  
**Current state:** Stub that echoes request body  
**Success:** `201 Created`

#### PATCH /api/admin/roles/:id

Updates a role.

**Auth:** Requires JWT + `role.edit`  
**Current state:** Stub that echoes request body  
**Success:** `200 OK`

#### DELETE /api/admin/roles/:id

Deletes a role.

**Auth:** Requires JWT + `role.delete`  
**Success:** `204 No Content`

#### GET /api/admin/permissions

Lists permissions.

**Auth:** Requires JWT + `role.read`  
**Current state:** Stub  
**Success:** `200 OK`

#### PUT /api/admin/roles/:id/permissions

Replaces permissions for a role.

**Auth:** Requires JWT + `role.edit`  
**Current state:** Stub that echoes request body  
**Success:** `200 OK`

## Common Response Patterns

Common status patterns in the current API:

- `200 OK` for successful reads and standard non-create actions
- `201 Created` for successful create actions
- `204 No Content` for successful delete actions
- `400 Bad Request` for implemented input validation failures
- `401 Unauthorized` for missing or invalid authentication
- `403 Forbidden` for authenticated users without the required permission
- `409 Conflict` for duplicate registration data
- `500 Internal Server Error` for unexpected server failures

## Current Implementation Notes

1. The authentication endpoints are the most complete part of the current backend.
2. Many business routes are active but still stubbed.
3. Most stubbed POST, PATCH, and PUT routes currently echo the submitted JSON under a `received` field.
4. Logout currently relies on an in-memory denylist, so token invalidation lasts only for the current server session.
5. This reference documents the API as it currently exists, not as a finished production API.
