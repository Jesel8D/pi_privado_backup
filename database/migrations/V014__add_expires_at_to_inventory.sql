-- ============================================================
-- V014: Agrega columna expires_at a inventory_records
-- Propósito: Permitir tracking de caducidad por lote (FIFO)
--            expires_at = record_date + product.shelf_life_days
-- ============================================================

ALTER TABLE inventory_records
    ADD COLUMN IF NOT EXISTS expires_at DATE NULL;

COMMENT ON COLUMN inventory_records.expires_at IS
    'Fecha de caducidad del lote. Calculada como record_date + product.shelf_life_days. NULL para productos no perecederos.';

-- Backfill: calcular expires_at para registros existentes de productos perecederos
UPDATE inventory_records ir
SET expires_at = ir.record_date + p.shelf_life_days
FROM products p
WHERE ir.product_id = p.id
  AND p.is_perishable = TRUE
  AND p.shelf_life_days IS NOT NULL
  AND ir.expires_at IS NULL;
