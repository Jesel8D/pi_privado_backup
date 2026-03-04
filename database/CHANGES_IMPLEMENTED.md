# CHANGES_IMPLEMENTED

**Fecha:** 2026-03-02

## Resumen técnico

Se implementó una migración de alineación estructural para cerrar gaps entre dominio backend y esquema SQL:

1. Creación idempotente de `orders` y `order_items` con constraints e índices.
2. Normalización de naming `deliveryMessage` -> `delivery_message`.
3. Alineación de `daily_sales` con `is_closed`.
4. Reforzamiento de `total_profit` como columna generada en SQL.

## Archivos creados/modificados

### Creados
- `migrations/V009__align_financial_domain_and_orders.sql`

## Justificación funcional

- Se asegura soporte SQL real para transaccionalidad de órdenes y sus detalles.
- Se elimina discrepancia de naming entre migraciones y entidades TypeORM.
- Se deja explícito `is_closed` en base de datos para cierre operativo diario.
- Se garantiza consistencia financiera de utilidad (`total_profit`) como resultado derivado del motor SQL.

## Riesgos mitigados

- Riesgo de fallos por tablas de órdenes ausentes en despliegues solo-migraciones.
- Riesgo de incompatibilidad ORM/DB por nombres de columnas divergentes.
- Riesgo de inconsistencia de utilidad neta por columna no derivada.
- Riesgo de drift de esquema operativo en cierres diarios.
