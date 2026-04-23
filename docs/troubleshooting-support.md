# PartVault Inventory Troubleshooting and Support Reference

## Table of Contents

1. [Overview](#overview)
2. [Known Issues and Resolutions](#known-issues-and-resolutions)
3. [User Account Problems](#user-account-problems)
4. [Administrator and Operational Issues](#administrator-and-operational-issues)
5. [How to Request Support](#how-to-request-support)
6. [Support Strategy](#support-strategy)

## Overview

This document provides troubleshooting guidance for common problems that may occur while using or testing PartVault Inventory. Because this project is an educational application running in a local development environment, support is limited to documentation, self-service troubleshooting.

## Known Issues and Resolutions

### 1. Error: "Invalid credentials" during login

This usually means the username or email and password combination does not match an active account.

**Resolution**

1. Confirm that the username or email was entered correctly.
2. Confirm that the password was entered correctly.
3. Make sure Caps Lock is not turned on.
4. Try again using the exact credentials used during registration.
5. If the account still cannot log in, test with another known working account.

### 2. Error: Registration fails with a 400 response

Registration can fail if required fields are missing, the email format is invalid, or the password does not meet the current password rules.

**Resolution**

1. Make sure `username`, `email`, and `password` are all included.
2. Confirm that the email is in a valid format.
3. Make sure the password has at least 8 characters.
4. Make sure the password includes at least one uppercase letter, one lowercase letter, and one number.
5. Submit the registration request again.

### 3. Error: Registration fails with a 409 response

A `409 Conflict` during registration usually means the username or email address is already in use.

**Resolution**

1. Try a different username.
2. Try a different email address.
3. Confirm that a previous successful registration was not already completed with the same information.
4. If needed, check the users table locally to confirm whether the account already exists.

### 4. Error: "Unauthorized" or 401 on a protected route

A `401 Unauthorized` response usually means the request did not include a valid Bearer token or the token is no longer accepted.

**Resolution**

1. Make sure you are logged in successfully first.
2. Copy the JWT returned by the login route.
3. Add the token to the request header in this format: `Authorization: Bearer <token>`.
4. Confirm that there are no extra spaces or missing characters in the token.
5. If the token was issued before logout, log in again and use the new token.

### 5. Error: 403 Forbidden on an admin route

A `403 Forbidden` response means the user is authenticated but does not have the permission required for that route.

**Resolution**

1. Confirm that the account is signed in successfully.
2. Confirm that the account has the correct role or permissions.
3. Test the same request with an admin account if the route is admin-only.
4. Review the route protection rules before assuming the request is broken.

### 6. Error: Token stops working after logout

This behavior is expected in the current version. Logout adds the token to an in-memory denylist for the current server session.

**Resolution**

1. Log in again to receive a new token.
2. Replace the old token in your API client with the new one.
3. Do not continue testing with a token that was already used for logout.

### 7. Issue: Business route works but only returns placeholder data

Many of the inventory, checkout, reporting, and admin business routes are active but still stubbed in the current version of the project.

**Resolution**

1. Confirm that the route is returning the expected status code.
2. Check whether the route is documented as a stub.
3. Do not treat empty arrays or placeholder messages as a server crash.
4. Focus testing on access control, request format, and route reachability unless the backend logic has already been completed.

### 8. Error: Database initialization fails

Database initialization can fail if MySQL is not running or the environment variables do not match the local database configuration.

**Resolution**

1. Make sure MySQL Server is running.
2. Check the `.env` file values for `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, and `DB_NAME`.
3. Confirm that the database user has permission to create and use the database.
4. Run `npm run db:init` again.
5. If needed, review the console error output for the exact database failure.

### 9. Error: Database connection test fails

The database connection test script can fail when the app cannot connect to MySQL or when the schema has not been initialized yet.

**Resolution**

1. Confirm that MySQL is running.
2. Confirm that the `.env` file is present and correct.
3. Run `npm run db:init` before running the test.
4. Run `npm run db:test` again.
5. If it still fails, verify that the configured database actually exists.

### 10. Issue: Browser page loads but expected data is missing

A page may render successfully even when live business data is not fully connected yet.

**Resolution**

1. Refresh the page.
2. Confirm that the server is running.
3. Confirm that the database has been initialized.
4. Check whether the page currently depends on placeholder or hardcoded content.
5. Review the relevant API route to see whether it is still a stub.

## User Account Problems

### My account is locked or cannot log in

PartVault Inventory does not currently document a formal account lockout workflow. If login fails repeatedly, first treat the issue as a credentials problem.

**Resolution**

1. Re-enter the username or email carefully.
2. Re-enter the password carefully.
3. Try another known valid test account.
4. If the issue continues, inspect the user record in the local database to confirm that the account is active.

### I forgot my password

The project includes password reset request and confirmation routes, but the current implementation is still a stub.

**Resolution**

1. Open the reset password page if you are testing the page flow.
2. Do not expect a full production email reset workflow yet.
3. For local development, update the password directly through the database or through the next completed version of the auth flow.
4. After updating the password, log in again with the new credentials.

### My account exists but I still cannot access certain features

This usually means the account does not have the required permissions for that route or page.

**Resolution**

1. Confirm that the login succeeded.
2. Confirm whether the feature is user-only or admin-only.
3. Check the user’s assigned role in the database.
4. Test with an admin account if needed.

## Administrator and Operational Issues

### All API requests fail after startup

This usually points to a startup, environment, or database problem.

**Resolution**

1. Confirm that the server started without errors.
2. Confirm that MySQL is running.
3. Confirm that the `.env` file exists in the project root.
4. Run `npm run db:test` to verify the database connection.
5. Restart the local server after fixing any configuration issues.

### Performance seems slow or inconsistent in local development

Local development performance can vary based on machine resources, MySQL startup state, or repeated server restarts.

**Resolution**

1. Restart the Express server.
2. Restart MySQL if the connection appears unstable.
3. Close unnecessary background applications.
4. Re-test using a clean browser tab or API client session.

## How to Request Support

If you need help with PartVault Inventory, submit a support request by email to **support@partvault.com**.

When sending a support request, include the following details so the issue can be reviewed quickly:

1. Your username or registered email address
2. The page or API route where the issue occurred
3. A short description of what you were trying to do
4. The exact error message or HTTP status code, if available
5. The steps you completed right before the issue happened
6. Whether the issue happened in the browser or in an API tool such as Thunder Client
7. A screenshot of the error, if available
8. Whether the issue happens every time or only sometimes

### Example Support Request

**To:** support@partvault.com  
**Subject:** Unable to access Admin Users page

Hello PartVault Support,

I am signed in with the username `admin_test`, and I am having trouble accessing the **Admin Users** page. When I try to open `/admin/users`, I receive a **403 Forbidden** response.

Right before the issue happened, I logged in successfully and then used the navigation menu to open the admin section. I tested the same issue in the browser, and it happens every time.

I have attached a screenshot of the error page for reference.

Thank you,  
Alejandro Lopez

## Support Strategy

PartVault Inventory uses a tiered support strategy designed to resolve common problems efficiently while still providing a clear path for direct assistance when needed.

### 1. Self-Service Support

The first level of support is self-service. Users should begin by reviewing the troubleshooting steps in this document, confirming their login information, checking their permissions, and retrying the action carefully.

### 2. Documentation Support

The second level of support is the project documentation. The user guide, developer guide, API reference, and troubleshooting reference are intended to answer common questions about setup, usage, permissions, and expected system behavior.

### 3. Direct Support

The third level of support is direct support through **support@partvault.com**. This option should be used when the issue cannot be resolved through troubleshooting or documentation alone, such as account access problems, repeated system errors, or unclear application behavior.

### Why this strategy works

This support structure is effective because it:

- gives users a fast self-service path for common issues
- uses documentation to reduce repeated support requests
- provides a realistic escalation path through email support
- reflects how support is commonly handled in real-world software systems
