-- ============================================================
-- TienditaCampus - Seed: Categorías de Productos
-- ============================================================

INSERT INTO categories (name, description, icon) VALUES
    ('Snacks Empaquetados', 'Sabritas, galletas, dulces y productos empaquetados', '🍿'),
    ('Bebidas', 'Aguas, jugos, refrescos y bebidas preparadas', '🥤'),
    ('Frutas Preparadas', 'Fresas con crema, mangoneadas, coctelería de frutas', '🍓'),
    ('Postres', 'Carlotas, pay casero, gelatinas y postres artesanales', '🍰'),
    ('Comida Preparada', 'Tortas, tacos, quesadillas y alimentos calientes', '🌮'),
    ('Panadería', 'Pan artesanal, empanadas y bollería', '🍞'),
    ('Otros', 'Productos que no entran en las categorías anteriores', '📦')
ON CONFLICT (name) DO NOTHING;
