-- Create the products table
CREATE TABLE products (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  category TEXT NOT NULL,
  tag TEXT NOT NULL,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on category for faster filtering
CREATE INDEX idx_products_category ON products(category);

-- Create an index on created_at for sorting
CREATE INDEX idx_products_created_at ON products(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow public read access (for the storefront)
CREATE POLICY "Allow public read access" ON products
  FOR SELECT
  TO public
  USING (true);

-- Create a policy to allow authenticated users to insert (for admin)
CREATE POLICY "Allow authenticated insert" ON products
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create a policy to allow authenticated users to update (for admin)
CREATE POLICY "Allow authenticated update" ON products
  FOR UPDATE
  TO authenticated
  USING (true);

-- Create a policy to allow authenticated users to delete (for admin)
CREATE POLICY "Allow authenticated delete" ON products
  FOR DELETE
  TO authenticated
  USING (true);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update updated_at on row updates
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data (optional - remove in production)
INSERT INTO products (title, price, category, tag, image_url) VALUES
  ('Premium Wireless Headphones', 149.99, 'Electronics', 'Bestseller', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop'),
  ('Smart Watch Pro', 299.99, 'Electronics', 'New', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop'),
  ('Leather Luxury Bag', 189.99, 'Accessories', 'Rare', 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop'),
  ('Designer Sunglasses', 129.99, 'Accessories', 'Trending', 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop'),
  ('Mechanical Keyboard', 179.99, 'Electronics', 'Popular', 'https://images.unsplash.com/photo-1587829741301-dc798b91add1?w=400&h=400&fit=crop'),
  ('Portable Speaker', 89.99, 'Electronics', 'Sale', 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop');
