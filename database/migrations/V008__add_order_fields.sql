ALTER TABLE public.orders
ADD COLUMN deliveryMessage TEXT NULL,
ALTER COLUMN status SET DEFAULT 'pending';

-- Actualizar órdenes existentes que puedan estar como null
UPDATE public.orders SET status = 'pending' WHERE status IS NULL;
