-- Activar extensión para UUID (si tu Postgres la necesita)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE roles (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  role_name varchar(255) UNIQUE NOT NULL,
  description varchar(255)
);

CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email varchar(255) UNIQUE NOT NULL,
  password varchar(255) NOT NULL,
  name varchar(255),
  phone varchar(50),
  is_active boolean DEFAULT true,
  created_at timestamp DEFAULT now()
);

CREATE TABLE users_roles (
  user_id uuid NOT NULL,
  role_id uuid NOT NULL,
  PRIMARY KEY (user_id, role_id),
  CONSTRAINT fk_users_roles_user
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT fk_users_roles_role
    FOREIGN KEY (role_id) REFERENCES roles (id) ON DELETE CASCADE
);
