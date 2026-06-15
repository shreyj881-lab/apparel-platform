-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Seed admin user (password: Admin@123)
-- bcrypt hash generated externally; change before production
INSERT INTO users (id, name, email, password, role, "isActive", "createdAt", "updatedAt")
VALUES (
  uuid_generate_v4(),
  'Admin',
  'admin@appareltek.in',
  '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewL.9z2Unh1QlJRy',
  'admin',
  true,
  NOW(),
  NOW()
) ON CONFLICT (email) DO NOTHING;

-- Full-text search trigger for styles
CREATE OR REPLACE FUNCTION update_style_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW."searchVector" :=
    to_tsvector('english',
      COALESCE(NEW.name, '') || ' ' ||
      COALESCE(NEW."brickName", '') || ' ' ||
      COALESCE(NEW."fabricUsed", '') || ' ' ||
      COALESCE(NEW."fabricContent", '') || ' ' ||
      COALESCE(NEW.description, '') || ' ' ||
      COALESCE(NEW."styleCode", '')
    );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER style_search_vector_update
  BEFORE INSERT OR UPDATE ON styles
  FOR EACH ROW EXECUTE FUNCTION update_style_search_vector();

-- Index for full-text search
CREATE INDEX IF NOT EXISTS idx_styles_search ON styles USING GIN("searchVector");
CREATE INDEX IF NOT EXISTS idx_styles_fabric ON styles("fabricUsed");
CREATE INDEX IF NOT EXISTS idx_fabrics_name ON fabrics USING GIN(to_tsvector('english', name));
