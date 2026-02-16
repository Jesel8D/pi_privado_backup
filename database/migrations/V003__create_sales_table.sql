-- ============================================================
-- TienditaCampus - Migración V003: Tablas de Ventas
-- ============================================================

-- Registro diario de ventas
CREATE TABLE IF NOT EXISTS daily_sales (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    seller_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    sale_date       DATE NOT NULL DEFAULT CURRENT_DATE,
    total_investment DECIMAL(10,2) NOT NULL CHECK (total_investment >= 0),
    total_revenue   DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (total_revenue >= 0),
    total_profit    DECIMAL(10,2) GENERATED ALWAYS AS (total_revenue - total_investment) STORED,
    profit_margin   DECIMAL(5,2),
    units_sold      INTEGER DEFAULT 0 CHECK (units_sold >= 0),
    units_lost      INTEGER DEFAULT 0 CHECK (units_lost >= 0),
    notes           TEXT,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(seller_id, sale_date)
);

-- Detalle de ventas por producto
CREATE TABLE IF NOT EXISTS sale_details (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    daily_sale_id   UUID NOT NULL REFERENCES daily_sales(id) ON DELETE CASCADE,
    product_id      UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    quantity_prepared INTEGER NOT NULL CHECK (quantity_prepared >= 0),
    quantity_sold   INTEGER NOT NULL DEFAULT 0 CHECK (quantity_sold >= 0),
    quantity_lost   INTEGER DEFAULT 0 CHECK (quantity_lost >= 0),
    unit_cost       DECIMAL(10,2) NOT NULL,
    unit_price      DECIMAL(10,2) NOT NULL,
    subtotal        DECIMAL(10,2) GENERATED ALWAYS AS (quantity_sold * unit_price) STORED,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_daily_sales_seller ON daily_sales(seller_id);
CREATE INDEX IF NOT EXISTS idx_daily_sales_date ON daily_sales(sale_date);
CREATE INDEX IF NOT EXISTS idx_daily_sales_seller_date ON daily_sales(seller_id, sale_date);
CREATE INDEX IF NOT EXISTS idx_sale_details_daily ON sale_details(daily_sale_id);
CREATE INDEX IF NOT EXISTS idx_sale_details_product ON sale_details(product_id);

-- Trigger
CREATE TRIGGER update_daily_sales_updated_at
    BEFORE UPDATE ON daily_sales
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
