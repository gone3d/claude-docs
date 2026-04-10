INSERT INTO categories (name, color, sort_order) VALUES
  ('Work', '#3B82F6', 1),
  ('Personal', '#10B981', 2),
  ('Urgent', '#EF4444', 3),
  ('Ideas', '#8B5CF6', 4)
ON CONFLICT (name) DO NOTHING;
