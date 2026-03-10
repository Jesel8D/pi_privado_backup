SET session_replication_role = replica;

UPDATE users SET id = 'ffffffff-ffff-4fff-afff-ffffffffffff' WHERE id = 'd1b3b3b3-b3b3-b3b3-b3b3-d1b3b3b3b3b3';
UPDATE products SET seller_id = 'ffffffff-ffff-4fff-afff-ffffffffffff' WHERE seller_id = 'd1b3b3b3-b3b3-b3b3-b3b3-d1b3b3b3b3b3';
UPDATE daily_sales SET seller_id = 'ffffffff-ffff-4fff-afff-ffffffffffff' WHERE seller_id = 'd1b3b3b3-b3b3-b3b3-b3b3-d1b3b3b3b3b3';
UPDATE inventory_records SET seller_id = 'ffffffff-ffff-4fff-afff-ffffffffffff' WHERE seller_id = 'd1b3b3b3-b3b3-b3b3-b3b3-d1b3b3b3b3b3';
UPDATE weekly_reports SET seller_id = 'ffffffff-ffff-4fff-afff-ffffffffffff' WHERE seller_id = 'd1b3b3b3-b3b3-b3b3-b3b3-d1b3b3b3b3b3';
UPDATE orders SET buyer_id = 'ffffffff-ffff-4fff-afff-ffffffffffff' WHERE buyer_id = 'd1b3b3b3-b3b3-b3b3-b3b3-d1b3b3b3b3b3';
UPDATE orders SET seller_id = 'ffffffff-ffff-4fff-afff-ffffffffffff' WHERE seller_id = 'd1b3b3b3-b3b3-b3b3-b3b3-d1b3b3b3b3b3';
UPDATE daily_inventory_snapshots SET seller_id = 'ffffffff-ffff-4fff-afff-ffffffffffff' WHERE seller_id = 'd1b3b3b3-b3b3-b3b3-b3b3-d1b3b3b3b3b3';

SET session_replication_role = DEFAULT;
