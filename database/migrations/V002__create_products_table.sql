-- ============================================================
-- TienditaCampus - Migración V002: Tablas de Productos
-- ============================================================

-- Categorías de productos
CREATE TABLE IF NOT EXISTS categories (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name            VARCHAR(100) UNIQUE NOT NULL,
    description     TEXT,
    icon            VARCHAR(50),
    is_active       BOOLEAN DEFAULT true,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Productos
CREATE TABLE IF NOT EXISTS products (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    seller_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id     UUID REFERENCES categories(id) ON DELETE SET NULL,
    name            VARCHAR(200) NOT NULL,
    description     TEXT,
    unit_cost       DECIMAL(10,2) NOT NULL CHECK (unit_cost >= 0),
    sale_price      DECIMAL(10,2) NOT NULL CHECK (sale_price >= 0),
    is_perishable   BOOLEAN DEFAULT false,
    shelf_life_days INTEGER,
    image_url       VARCHAR(500),
    is_active       BOOLEAN DEFAULT true,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_products_seller ON products(seller_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);

-- Trigger para updated_at
CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
