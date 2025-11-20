-- Activa la extensión para UUID si es necesario:
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Crear roles de ejemplo
INSERT INTO roles (id, role_name, description)
VALUES
  (uuid_generate_v4(), 'admin', 'Administrador del sistema'),
  (uuid_generate_v4(), 'doctor', 'Rol doctor'),
  (uuid_generate_v4(), 'user', 'Usuario estándar');

-- Usuario admin (password "admin123" hasheada con bcrypt)
INSERT INTO users (id, email, password, name, is_active)
VALUES (
  uuid_generate_v4(),
  'admin@example.com',
  '$2b$10$DHW4G8uERZZ2Hb3mfa7y6e3ugvE5LwqKzTIxZxPWc2fVuz4SOXQmK',
  'Admin',
  true
);

-- Asignar rol admin al usuario admin
INSERT INTO users_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u, roles r
WHERE u.email = 'admin@example.com'
  AND r.role_name = 'admin';
