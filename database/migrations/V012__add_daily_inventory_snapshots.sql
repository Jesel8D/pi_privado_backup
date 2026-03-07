-- ============================================================
-- TienditaCampus - Migración V012: Daily Inventory Snapshots (GAP-01)
-- ============================================================

CREATE TABLE IF NOT EXISTS daily_inventory_snapshots (
  id                UUID          PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id         UUID          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id        UUID          NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  snapshot_date     DATE          NOT NULL DEFAULT CURRENT_DATE,
  opening_stock     INT           NOT NULL,
  units_sold        INT           NOT NULL DEFAULT 0,
  units_wasted      INT           NOT NULL DEFAULT 0,
  closing_stock     INT           NOT NULL DEFAULT 0,
  waste_value       NUMERIC(10,2) NOT NULL DEFAULT 0,
  waste_percentage  NUMERIC(5,2)  GENERATED ALWAYS AS
    (CASE WHEN opening_stock > 0 THEN (units_wasted::NUMERIC / opening_stock) * 100 ELSE 0 END) STORED,
  created_at        TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  UNIQUE (seller_id, product_id, snapshot_date)
);

-- Comentarios
COMMENT ON COLUMN daily_inventory_snapshots.opening_stock IS 'quantity_initial del día';
COMMENT ON COLUMN daily_inventory_snapshots.closing_stock IS 'opening - sold - wasted';
COMMENT ON COLUMN daily_inventory_snapshots.waste_value IS 'units_wasted × unit_cost';
