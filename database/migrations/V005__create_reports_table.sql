-- ============================================================
-- TienditaCampus - Migración V005: Tabla de Reportes
-- ============================================================

-- Resúmenes semanales generados automáticamente
CREATE TABLE IF NOT EXISTS weekly_reports (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    seller_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    week_start      DATE NOT NULL,
    week_end        DATE NOT NULL,
    total_investment DECIMAL(10,2) DEFAULT 0,
    total_revenue   DECIMAL(10,2) DEFAULT 0,
    total_profit    DECIMAL(10,2) DEFAULT 0,
    avg_profit_margin DECIMAL(5,2) DEFAULT 0,
    total_units_sold INTEGER DEFAULT 0,
    total_units_lost INTEGER DEFAULT 0,
    loss_percentage DECIMAL(5,2) DEFAULT 0,
    best_selling_product UUID REFERENCES products(id) ON DELETE SET NULL,
    demand_prediction JSONB,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(seller_id, week_start)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_reports_seller ON weekly_reports(seller_id);
CREATE INDEX IF NOT EXISTS idx_reports_week ON weekly_reports(week_start);

-- Índice GIN para búsquedas en JSONB de predicciones
CREATE INDEX IF NOT EXISTS idx_reports_predictions ON weekly_reports USING GIN (demand_prediction);
