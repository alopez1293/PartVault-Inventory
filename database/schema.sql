-- =========================================================
-- FILE: schema.sql
-- PROJECT: Parts Inventory + Check-out Log Application
-- PURPOSE: Creates the full database schema
-- AUTHOR: Alejandro Lopez
-- DATE: February 9, 2026
-- =========================================================

CREATE DATABASE IF NOT EXISTS parts_app;
USE parts_app;

-- Make script re-runnable
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS audit_logs;
DROP TABLE IF EXISTS inventory_transactions;
DROP TABLE IF EXISTS checkout_items;
DROP TABLE IF EXISTS checkouts;
DROP TABLE IF EXISTS bin_parts;
DROP TABLE IF EXISTS user_roles;
DROP TABLE IF EXISTS role_permissions;
DROP TABLE IF EXISTS bins;
DROP TABLE IF EXISTS parts;
DROP TABLE IF EXISTS permissions;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS locations;
DROP TABLE IF EXISTS users;

SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE users (
  user_id INT AUTO_INCREMENT,
  username VARCHAR(50) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (user_id),
  UNIQUE (username),
  UNIQUE (email)
);

CREATE TABLE roles (
  role_id INT AUTO_INCREMENT,
  role_name VARCHAR(50) NOT NULL,
  description VARCHAR(255) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (role_id),
  UNIQUE (role_name)
);

CREATE TABLE permissions (
  permission_id INT AUTO_INCREMENT,
  permission_name VARCHAR(100) NOT NULL,
  description VARCHAR(255) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (permission_id),
  UNIQUE (permission_name)
);

CREATE TABLE user_roles (
  user_id INT NOT NULL,
  role_id INT NOT NULL,
  assigned_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (user_id, role_id),

  CONSTRAINT fk_user_roles_user
    FOREIGN KEY (user_id) REFERENCES users(user_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,

  CONSTRAINT fk_user_roles_role
    FOREIGN KEY (role_id) REFERENCES roles(role_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE role_permissions (
  role_id INT NOT NULL,
  permission_id INT NOT NULL,
  assigned_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (role_id, permission_id),

  CONSTRAINT fk_role_permissions_role
    FOREIGN KEY (role_id) REFERENCES roles(role_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,

  CONSTRAINT fk_role_permissions_permission
    FOREIGN KEY (permission_id) REFERENCES permissions(permission_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE locations (
  location_id INT AUTO_INCREMENT,
  location_name VARCHAR(50) NOT NULL,
  description TEXT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (location_id)
);

CREATE TABLE parts (
  part_id INT AUTO_INCREMENT,
  part_number VARCHAR(50) NOT NULL,
  part_name VARCHAR(120) NOT NULL,
  description TEXT NULL,
  unit VARCHAR(20) NOT NULL,
  reorder_point INT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (part_id),
  UNIQUE (part_number)
);

CREATE TABLE bins (
  bin_id INT AUTO_INCREMENT,
  location_id INT NOT NULL,
  bin_code VARCHAR(40) NOT NULL,
  description TEXT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (bin_id),

  CONSTRAINT fk_bins_location
    FOREIGN KEY (location_id) REFERENCES locations(location_id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,

  UNIQUE (location_id, bin_code)
);

CREATE TABLE bin_parts (
  bin_id INT NOT NULL,
  part_id INT NOT NULL,
  qty_on_hand INT NOT NULL,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (bin_id, part_id),

  CONSTRAINT fk_bin_parts_bin
    FOREIGN KEY (bin_id) REFERENCES bins(bin_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,

  CONSTRAINT fk_bin_parts_part
    FOREIGN KEY (part_id) REFERENCES parts(part_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE checkouts (
  checkout_id INT AUTO_INCREMENT,
  requested_by_user_id INT NOT NULL,
  fulfilled_by_user_id INT NULL,
  status VARCHAR(20) NOT NULL,
  requested_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  approved_at DATETIME NULL,
  fulfilled_at DATETIME NULL,
  notes TEXT NULL,

  PRIMARY KEY (checkout_id),

  CONSTRAINT fk_checkouts_requested_by
    FOREIGN KEY (requested_by_user_id) REFERENCES users(user_id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,

  CONSTRAINT fk_checkouts_fulfilled_by
    FOREIGN KEY (fulfilled_by_user_id) REFERENCES users(user_id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
);

CREATE TABLE checkout_items (
  checkout_item_id INT AUTO_INCREMENT,
  checkout_id INT NOT NULL,
  part_id INT NOT NULL,
  bin_id INT NOT NULL,
  qty_requested INT NOT NULL,
  qty_issued INT NOT NULL DEFAULT 0,
  qty_returned INT NOT NULL DEFAULT 0,

  PRIMARY KEY (checkout_item_id),

  CONSTRAINT fk_checkout_items_checkout
    FOREIGN KEY (checkout_id) REFERENCES checkouts(checkout_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,

  CONSTRAINT fk_checkout_items_part
    FOREIGN KEY (part_id) REFERENCES parts(part_id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,

  CONSTRAINT fk_checkout_items_bin
    FOREIGN KEY (bin_id) REFERENCES bins(bin_id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
);

CREATE TABLE inventory_transactions (
  transaction_id INT AUTO_INCREMENT,
  part_id INT NOT NULL,
  from_bin_id INT NULL,
  to_bin_id INT NULL,
  checkout_id INT NULL,
  performed_by_user_id INT NOT NULL,
  transaction_type VARCHAR(20) NOT NULL,
  quantity INT NOT NULL,
  reason TEXT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (transaction_id),

  CONSTRAINT fk_inv_tx_part
    FOREIGN KEY (part_id) REFERENCES parts(part_id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,

  CONSTRAINT fk_inv_tx_from_bin
    FOREIGN KEY (from_bin_id) REFERENCES bins(bin_id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,

  CONSTRAINT fk_inv_tx_to_bin
    FOREIGN KEY (to_bin_id) REFERENCES bins(bin_id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,

  CONSTRAINT fk_inv_tx_checkout
    FOREIGN KEY (checkout_id) REFERENCES checkouts(checkout_id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,

  CONSTRAINT fk_inv_tx_performed_by
    FOREIGN KEY (performed_by_user_id) REFERENCES users(user_id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
);

CREATE TABLE audit_logs (
  audit_log_id INT AUTO_INCREMENT,
  actor_user_id INT NOT NULL,
  action VARCHAR(50) NOT NULL,
  table_name VARCHAR(50) NOT NULL,
  record_pk VARCHAR(50) NOT NULL,
  details TEXT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (audit_log_id),

  CONSTRAINT fk_audit_logs_actor
    FOREIGN KEY (actor_user_id) REFERENCES users(user_id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
);

-- ====================
-- SAMPLE DATA
-- ======================
INSERT INTO users (username, email, password_hash, is_active)
VALUES
('alex', 'alex@example.com', '$2b$12$examplehashstring', TRUE),
('tech1', 'tech1@example.com', '$2b$12$examplehashstring', TRUE);

INSERT INTO roles (role_name, description)
VALUES
('admin', 'Full administrative access'),
('user', 'Standard authenticated user');

INSERT INTO permissions (permission_name, description)
VALUES
('user.read', 'View own user profile or basic user data'),
('user.update', 'Update own user profile'),
('admin.users.read', 'View all users as admin'),
('admin.users.update', 'Manage users as admin'),
('part.read', 'View parts'),
('part.add', 'Add parts'),
('part.edit', 'Edit parts'),
('part.delete', 'Delete parts'),
('checkout.read.own', 'View own checkouts'),
('checkout.add', 'Create checkout requests'),
('checkout.fulfill', 'Fulfill checkout requests'),
('checkout.return', 'Process returned checkout items'),
('report.read', 'View reports'),
('role.read', 'View roles and permissions'),
('role.add', 'Create roles'),
('role.edit', 'Edit roles'),
('role.delete', 'Delete roles'),
('stock.adjust', 'Create stock adjustment transactions');

-- Link users to roles
INSERT INTO user_roles (user_id, role_id)
VALUES
(1, 1),
(2, 2);

-- Link roles to permissions
-- role_id 1 = admin
-- role_id 2 = user

INSERT INTO role_permissions (role_id, permission_id)
VALUES
-- admin permissions
(1, 1),   -- user.read
(1, 2),   -- user.update
(1, 3),   -- admin.users.read
(1, 4),   -- admin.users.update
(1, 5),   -- part.read
(1, 6),   -- part.add
(1, 7),   -- part.edit
(1, 8),   -- part.delete
(1, 9),   -- checkout.read.own
(1, 10),  -- checkout.add
(1, 11),  -- checkout.fulfill
(1, 12),  -- checkout.return
(1, 13),  -- report.read
(1, 14),  -- role.read
(1, 15),  -- role.add
(1, 16),  -- role.edit
(1, 17),  -- role.delete
(1, 18),  -- stock.adjust

-- user permissions
(2, 1),   -- user.read
(2, 2),   -- user.update
(2, 5),   -- part.read
(2, 9),   -- checkout.read.own
(2, 10);  -- checkout.add

INSERT INTO locations (location_name, description)
VALUES ('Maintenance Crib', 'Main parts storage area for maintenance');

INSERT INTO parts (part_number, part_name, description, unit, reorder_point, is_active)
VALUES
('ABC-12345', 'M8x20 Socket Head Cap Screw', 'Stainless steel', 'each', 50, TRUE),
('DEF-67890', 'Blue Loctite 242 (10ml)', 'Threadlocker', 'bottle', 10, TRUE);

INSERT INTO bins (location_id, bin_code, description, is_active)
VALUES (1, 'A2-B14', 'Fasteners bin', TRUE);

INSERT INTO bin_parts (bin_id, part_id, qty_on_hand)
VALUES
(1, 1, 120),
(1, 2, 15);

-- Create a checkout requested by user_id 1, fulfilled by user_id 2
INSERT INTO checkouts (requested_by_user_id, fulfilled_by_user_id, status, notes)
VALUES (1, 2, 'requested', 'Need parts for a quick repair');

-- Add two line items referencing existing part_id and bin_id
INSERT INTO checkout_items (checkout_id, part_id, bin_id, qty_requested)
VALUES
(1, 1, 1, 10),
(1, 2, 1, 1);

-- Inventory transaction example
INSERT INTO inventory_transactions
(part_id, from_bin_id, to_bin_id, checkout_id, performed_by_user_id, transaction_type, quantity, reason)
SELECT
  p.part_id,
  b.bin_id,
  NULL,
  (SELECT MIN(checkout_id) FROM checkouts),
  u.user_id,
  'issue',
  10,
  'Issued for repair'
FROM parts p
JOIN bins b ON b.bin_code = 'A2-B14'
JOIN users u ON u.username = 'tech1'
WHERE p.part_number = 'ABC-12345'
LIMIT 1;

-- Audit log example
INSERT INTO audit_logs (actor_user_id, action, table_name, record_pk, details)
SELECT
  u.user_id,
  'checkout.add',
  'checkouts',
  CAST((SELECT MIN(checkout_id) FROM checkouts) AS CHAR),
  'Created checkout request'
FROM users u
WHERE u.username = 'alex'
LIMIT 1;