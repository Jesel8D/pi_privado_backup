-- ============================================================
-- TienditaCampus - Migración V004: Tabla de Inventario
-- ============================================================

CREATE TABLE IF NOT EXISTS inventory_records (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    seller_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id      UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    record_date     DATE NOT NULL DEFAULT CURRENT_DATE,
    quantity_initial INTEGER NOT NULL CHECK (quantity_initial >= 0),
    quantity_remaining INTEGER DEFAULT 0 CHECK (quantity_remaining >= 0),
    investment_amount DECIMAL(10,2) NOT NULL CHECK (investment_amount >= 0),
    status          VARCHAR(20) DEFAULT 'active'
                    CHECK (status IN ('active', 'sold_out', 'expired', 'closed')),
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_inventory_seller ON inventory_records(seller_id);
CREATE INDEX IF NOT EXISTS idx_inventory_product ON inventory_records(product_id);
CREATE INDEX IF NOT EXISTS idx_inventory_date ON inventory_records(record_date);
CREATE INDEX IF NOT EXISTS idx_inventory_status ON inventory_records(status);

-- Trigger
CREATE TRIGGER update_inventory_updated_at
    BEFORE UPDATE ON inventory_records
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
