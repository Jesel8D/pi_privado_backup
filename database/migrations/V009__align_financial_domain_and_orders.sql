-- ============================================================
-- TienditaCampus - Migración V009: Alineación financiera y órdenes
-- ============================================================

-- 1) Crear tablas transaccionales de órdenes si no existen
CREATE TABLE IF NOT EXISTS orders (
    id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    buyer_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    seller_id        UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    total_amount     DECIMAL(10,2) NOT NULL CHECK (total_amount >= 0),
    status           VARCHAR(20) NOT NULL DEFAULT 'requested'
                     CHECK (status IN ('requested', 'pending', 'accepted', 'completed', 'cancelled', 'rejected')),
    delivery_message TEXT,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
    id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id     UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id   UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    quantity     INTEGER NOT NULL CHECK (quantity > 0),
    unit_price   DECIMAL(10,2) NOT NULL CHECK (unit_price >= 0),
    subtotal     DECIMAL(10,2) NOT NULL CHECK (subtotal >= 0),
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_buyer ON orders(buyer_id);
CREATE INDEX IF NOT EXISTS idx_orders_seller ON orders(seller_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product ON order_items(product_id);

DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 2) Resolver mismatch de naming deliveryMessage -> delivery_message
DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'orders'
          AND lower(column_name) = 'deliverymessage'
    ) AND NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'orders'
          AND column_name = 'delivery_message'
    ) THEN
        ALTER TABLE public.orders RENAME COLUMN "deliveryMessage" TO delivery_message;
    END IF;
END
$$;

ALTER TABLE public.orders
    ALTER COLUMN status SET DEFAULT 'requested';

-- 3) Alinear daily_sales con modelo financiero esperado
ALTER TABLE public.daily_sales
    ADD COLUMN IF NOT EXISTS is_closed BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE public.daily_sales
    DROP COLUMN IF EXISTS total_profit;

ALTER TABLE public.daily_sales
    ADD COLUMN total_profit DECIMAL(10,2)
    GENERATED ALWAYS AS (total_revenue - total_investment) STORED;
