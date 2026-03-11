# 🗂️ **CARPETAS Y FRAGMENTOS DE CÓDIGO - ARQUITECTURA COMPLETA**

## 🎯 **ORGANIZACIÓN DE CARPETAS Y CONSULTAS SQL**

---

## 📁 **ESTRUCTURA DE CARPETAS PRINCIPALES**

```
pi_privado_backup/
├── backend/                    # 🚀 API REST (NestJS)
│   ├── src/
│   │   ├── modules/           # 📦 Módulos de negocio
│   │   │   ├── sales/         # 💰 Ventas
│   │   │   ├── inventory/     # 📦 Inventario
│   │   │   ├── products/      # 🛍️ Productos
│   │   │   ├── auth/          # 🔐 Autenticación
│   │   │   ├── benchmarking/  # 📊 Benchmarking
│   │   │   └── audit/         # 📋 Auditoría
│   │   ├── common/            # 🔧 Componentes comunes
│   │   ├── config/            # ⚙️ Configuración
│   │   └── main.ts            # 🎯 Punto de entrada
├── database/                  # 🗄️ Base de Datos (PostgreSQL)
│   ├── migrations/            # 🔄 Migraciones SQL
│   ├── seeds/                 # 🌱 Datos iniciales
│   └── init/                  # 🚀 Scripts de inicialización
├── frontend/                  # 🌐 PWA (Next.js)
├── devops/                    # 🛠️ Docker y configuración
└── docs/                      # 📚 Documentación
```

---

## 🚀 **MÓDULOS DE NEGOCIO - SERVICIOS Y CONSULTAS**

### **1. MÓDULO DE VENTAS (`backend/src/modules/sales/`)**

#### **📁 Estructura de Archivos:**
```
sales/
├── sales.service.ts           # 🎯 Lógica de negocio principal
├── sales.controller.ts        # 🌐 Endpoints HTTP
├── sales.module.ts           # 📦 Configuración de módulo
├── entities/                  # 🗃️ Entidades TypeORM
│   ├── daily-sale.entity.ts
│   └── sale-detail.entity.ts
├── repositories/              # 💾 Acceso a datos
│   └── sales.repository.ts
└── use-cases/                 # 🎲 Casos de uso específicos
    ├── create-daily-sale.use-case.ts
    ├── close-day.use-case.ts
    └── track-sale.use-case.ts
```

#### **🔍 Servicio Principal (`sales.service.ts`):**
```typescript
@Injectable()
export class SalesService {
    constructor(
        @Inject('ISalesRepository')
        private readonly salesRepository: ISalesRepository,
        private readonly createDailySaleUseCase: CreateDailySaleUseCase,
        private readonly closeDayUseCase: CloseDayUseCase,
        private readonly trackSaleUseCase: TrackSaleUseCase,
    ) {}

    // 🎯 Crear venta diaria con cálculos automáticos
    async createDailySale(userId: number, date: Date): Promise<DailySale> {
        return this.createDailySaleUseCase.execute(userId, date);
    }

    // 📊 Agregar producto a venta
    async addProductToSale(
        dailySaleId: number, 
        productId: number, 
        quantity: number
    ): Promise<SaleDetail> {
        return this.trackSaleUseCase.execute(dailySaleId, productId, quantity);
    }

    // 🎯 Cerrar día y calcular métricas
    async closeDailySale(dailySaleId: number): Promise<DailySale> {
        return this.closeDayUseCase.execute(dailySaleId);
    }

    // 📈 Obtener métricas de rendimiento
    async getPerformanceMetrics(userId: number, period: string): Promise<any> {
        return this.salesRepository.getPerformanceMetrics(userId, period);
    }
}
```

#### **💾 Repository con Consultas SQL (`sales.repository.ts`):**
```typescript
@Injectable()
export class SalesRepository implements ISalesRepository {
    constructor(
        @InjectRepository(DailySale)
        private dailySaleRepository: Repository<DailySale>,
        @InjectRepository(SaleDetail)
        private saleDetailRepository: Repository<SaleDetail>,
        @InjectRepository(Product)
        private productRepository: Repository<Product>,
        private dataSource: DataSource,
    ) {}

    // 🔍 CONSULTA COMPLEJA: Métricas de rendimiento
    async getPerformanceMetrics(userId: number, period: string): Promise<any> {
        const query = `
            WITH daily_metrics AS (
                SELECT 
                    ds.id,
                    ds.sale_date,
                    ds.total_revenue,
                    ds.profit_margin,
                    COUNT(sd.id) as product_count,
                    SUM(sd.quantity_sold) as total_units,
                    -- Cálculo de métricas avanzadas
                    PERCENTILE_CONT(0.50) WITHIN GROUP (ORDER BY sd.unit_price) as median_price,
                    PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY sd.quantity_sold) as p75_units
                FROM daily_sales ds
                LEFT JOIN sale_details sd ON ds.id = sd.daily_sale_id
                WHERE ds.user_id = $1 
                AND ds.sale_date >= CURRENT_DATE - INTERVAL '${period}'
                GROUP BY ds.id, ds.sale_date, ds.total_revenue, ds.profit_margin
            )
            SELECT 
                COUNT(*) as total_days,
                AVG(total_revenue) as avg_daily_revenue,
                AVG(profit_margin) as avg_profit_margin,
                SUM(total_units) as total_units_sold,
                AVG(product_count) as avg_products_per_day,
                AVG(median_price) as avg_median_price,
                -- Tendencia de crecimiento
                (MAX(total_revenue) - MIN(total_revenue)) / MIN(total_revenue) * 100 as growth_rate
            FROM daily_metrics
        `;
        
        return this.dataSource.query(query, [userId]);
    }

    // 🎯 CONSULTA OPTIMIZADA: Productos más vendidos
    async getTopProducts(userId: number, limit: number = 10): Promise<any> {
        const query = `
            SELECT 
                p.id,
                p.name,
                p.category,
                SUM(sd.quantity_sold) as total_sold,
                SUM(sd.total_revenue) as total_revenue,
                AVG(sd.unit_price) as avg_price,
                -- Cálculo de rank
                RANK() OVER (ORDER BY SUM(sd.quantity_sold) DESC) as sales_rank,
                -- Porcentaje del total
                ROUND(SUM(sd.quantity_sold) * 100.0 / SUM(SUM(sd.quantity_sold)) OVER(), 2) as market_share
            FROM products p
            INNER JOIN sale_details sd ON p.id = sd.product_id
            INNER JOIN daily_sales ds ON sd.daily_sale_id = ds.id
            WHERE ds.user_id = $1
            AND ds.sale_date >= CURRENT_DATE - INTERVAL '30 days'
            GROUP BY p.id, p.name, p.category
            ORDER BY total_sold DESC
            LIMIT $2
        `;
        
        return this.dataSource.query(query, [userId, limit]);
    }

    // 📊 CONSULTA CON VISTA MATERIALIZADA
    async getProductPerformance(): Promise<any> {
        // Usa vista materializada para rendimiento óptimo
        return this.dailySaleRepository.query(`
            SELECT * FROM vw_product_performance 
            WHERE total_revenue > 0 
            ORDER BY profit_margin DESC
        `);
    }
}
```

---

### **2. MÓDULO DE BENCHMARKING (`backend/src/modules/benchmarking/`)**

#### **📁 Estructura de Archivos:**
```
benchmarking/
├── benchmarking.service.ts      # 🎯 Servicio principal
├── benchmarking.controller.ts   # 🌐 Endpoints API
├── auth/                        # 🔐 OAuth Google
│   └── oauth-bigquery.service.ts
├── snapshots/                   # 📸 Snapshots automáticos
│   └── snapshot.service.ts
└── exports/                     # 📤 Exportación a BigQuery
    └── bigquery-export.service.ts
```

#### **📊 Servicio de Benchmarking (`benchmarking.service.ts`):**
```typescript
@Injectable()
export class BenchmarkingService {
    constructor(
        @InjectConnection() private connection: Connection,
        private readonly snapshotService: SnapshotService,
        private readonly bigQueryExportService: BigQueryExportService,
    ) {}

    // 🔍 CONSULTA: Métricas de pg_stat_statements
    async getQueryMetrics(): Promise<any> {
        const query = `
            SELECT 
                query,
                calls,
                total_exec_time,
                mean_exec_time,
                rows,
                100.0 * shared_blks_hit / nullif(shared_blks_hit + shared_blks_read, 0) AS hit_percent
            FROM pg_stat_statements 
            WHERE calls > 10
            ORDER BY mean_exec_time DESC
            LIMIT 20
        `;
        
        return this.connection.query(query);
    }

    // 📈 CONSULTA: Análisis de rendimiento temporal
    async getPerformanceTrends(): Promise<any> {
        const query = `
            SELECT 
                DATE_TRUNC('hour', created_at) as hour_period,
                COUNT(*) as snapshot_count,
                AVG((metrics_data->>'query_time')::float) as avg_query_time,
                AVG((metrics_data->>'slow_queries')::int) as avg_slow_queries,
                MAX((metrics_data->>'cache_hit_rate')::float) as max_cache_hit_rate
            FROM benchmarking_snapshots 
            WHERE created_at >= CURRENT_DATE - INTERVAL '24 hours'
            GROUP BY hour_period
            ORDER BY hour_period
        `;
        
        return this.connection.query(query);
    }

    // 🎯 EJECUCIÓN DE SNAPSHOT
    async executeSnapshot(): Promise<void> {
        // 1. Recolectar métricas
        const metrics = await this.collectMetrics();
        
        // 2. Guardar en base de datos
        await this.snapshotService.save(metrics);
        
        // 3. Exportar a BigQuery
        await this.bigQueryExportService.export(metrics);
    }

    // 🔍 Recolectar métricas de PostgreSQL
    private async collectMetrics(): Promise<any> {
        const queries = [
            // Queries lentas
            `SELECT COUNT(*) as slow_queries FROM pg_stat_statements WHERE mean_exec_time > 100`,
            // Conexiones activas
            `SELECT COUNT(*) as active_connections FROM pg_stat_activity WHERE state = 'active'`,
            // Tamaño de base de datos
            `SELECT pg_size_pretty(pg_database_size(current_database())) as db_size`,
            // Cache hit ratio
            `SELECT round(sum(blks_hit)*100/sum(blks_hit+blks_read), 2) as cache_hit_rate FROM pg_stat_database WHERE datname = current_database()`
        ];

        const results = await Promise.all(
            queries.map(q => this.connection.query(q))
        );

        return {
            timestamp: new Date(),
            slowQueries: results[0][0]?.slow_queries || 0,
            activeConnections: results[1][0]?.active_connections || 0,
            databaseSize: results[2][0]?.db_size || '0B',
            cacheHitRate: parseFloat(results[3][0]?.cache_hit_rate || '0'),
        };
    }
}
```

---

### **3. MÓDULO DE INVENTARIO (`backend/src/modules/inventory/`)**

#### **💾 Repository con Transacciones (`inventory.repository.ts`):**
```typescript
@Injectable()
export class InventoryRepository {
    constructor(
        @InjectRepository(InventoryRecord)
        private inventoryRepository: Repository<InventoryRecord>,
        private dataSource: DataSource,
    ) {}

    // 🔄 TRANSACCIÓN COMPLETA: Actualizar inventario
    async updateInventory(
        productId: number, 
        userId: number, 
        quantity: number, 
        operation: 'IN' | 'OUT' | 'ADJUST'
    ): Promise<void> {
        const queryRunner = this.dataSource.createQueryRunner();
        
        await queryRunner.connect();
        await queryRunner.startTransaction('REPEATABLE READ'); // 🎯 Nivel de aislamiento

        try {
            // 1. Verificar stock actual
            const currentStock = await this.getCurrentStock(
                queryRunner, 
                productId, 
                userId
            );

            // 2. Validar operación
            if (operation === 'OUT' && currentStock < quantity) {
                throw new Error(`Stock insuficiente. Actual: ${currentStock}, Solicitado: ${quantity}`);
            }

            // 3. Insertar registro de inventario
            const record = this.inventoryRepository.create({
                productId,
                userId,
                quantity,
                operationType: operation,
                unitCost: await this.getProductCost(queryRunner, productId),
            });

            await queryRunner.manager.save(record);

            // 4. Actualizar timestamp del producto
            await queryRunner.manager.update(
                Product,
                { id: productId },
                { updatedAt: new Date() }
            );

            // 5. Si todo va bien, hacer COMMIT
            await queryRunner.commitTransaction();

        } catch (error) {
            // Si algo falla, hacer ROLLBACK
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            // Liberar el query runner
            await queryRunner.release();
        }
    }

    // 📊 CONSULTA: Stock actual con CTE
    async getCurrentStock(
        queryRunner: QueryRunner, 
        productId: number, 
        userId: number
    ): Promise<number> {
        const query = `
            WITH stock_calculations AS (
                SELECT 
                    product_id,
                    user_id,
                    SUM(
                        CASE 
                            WHEN operation_type = 'IN' THEN quantity
                            WHEN operation_type = 'OUT' THEN -quantity
                            WHEN operation_type = 'ADJUST' THEN quantity
                            ELSE 0
                        END
                    ) as current_stock
                FROM inventory_records 
                WHERE product_id = $1 AND user_id = $2
                GROUP BY product_id, user_id
            )
            SELECT COALESCE(current_stock, 0) 
            FROM stock_calculations 
            WHERE product_id = $1 AND user_id = $2
        `;

        const result = await queryRunner.query(query, [productId, userId]);
        return parseInt(result[0]?.coalesce || '0');
    }

    // 📈 CONSULTA: Análisis de rotación
    async getInventoryTurnover(userId: number): Promise<any> {
        const query = `
            WITH inventory_analysis AS (
                SELECT 
                    p.id,
                    p.name,
                    COALESCE(SUM(
                        CASE WHEN ir.operation_type = 'OUT' THEN ir.quantity ELSE 0 END
                    ), 0) as total_consumed,
                    COALESCE(SUM(
                        CASE WHEN ir.operation_type = 'IN' THEN ir.quantity ELSE 0 END
                    ), 0) as total_received,
                    -- Cálculo de días en inventario
                    COUNT(DISTINCT DATE(ir.created_at)) as days_with_activity
                FROM products p
                LEFT JOIN inventory_records ir ON p.id = ir.product_id AND ir.user_id = $1
                WHERE p.is_active = true
                GROUP BY p.id, p.name
            )
            SELECT 
                id,
                name,
                total_consumed,
                total_received,
                days_with_activity,
                CASE 
                    WHEN total_received > 0 
                    THEN ROUND(total_consumed * 365.0 / total_received, 2)
                    ELSE 0 
                END as turnover_rate
            FROM inventory_analysis
            WHERE total_consumed > 0
            ORDER BY turnover_rate DESC
        `;

        return this.dataSource.query(query, [userId]);
    }
}
```

---

## 🗄️ **MIGRACIONES Y CONSULTAS SQL**

### **📁 Carpeta de Migraciones (`database/migrations/`)**

#### **🔄 Ejemplo: Migración Completa**
```typescript
// V017__create_export_views.sql
export class V017CreateExportViews1725991774953 implements MigrationInterface {
    
    // 🎯 CONSULTA: Crear vista materializada para rendimiento
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            -- Vista materializada para análisis de productos
            CREATE MATERIALIZED VIEW vw_product_performance AS
            SELECT 
                p.id,
                p.name,
                p.category,
                p.base_cost,
                COUNT(DISTINCT ds.id) as days_sold,
                COALESCE(SUM(sd.quantity_sold), 0) as total_units_sold,
                COALESCE(SUM(sd.total_revenue), 0) as total_revenue,
                COALESCE(AVG(sd.unit_price), p.suggested_price) as avg_selling_price,
                COALESCE(
                    (COALESCE(AVG(sd.unit_price), p.suggested_price) - p.base_cost) / p.base_cost * 100, 
                    0
                ) as profit_margin_percentage,
                -- Métricas avanzadas
                COALESCE(SUM(sd.waste_cost), 0) as total_waste_cost,
                COALESCE(
                    SUM(sd.quantity_sold) * 1.0 / NULLIF(SUM(sd.quantity_prepared), 0), 
                    1
                ) * 100 as efficiency_rate
            FROM products p
            LEFT JOIN sale_details sd ON p.id = sd.product_id
            LEFT JOIN daily_sales ds ON sd.daily_sale_id = ds.id
            WHERE p.is_active = true
            GROUP BY p.id, p.name, p.category, p.base_cost, p.suggested_price
            WITH DATA;

            -- Índice para rendimiento
            CREATE INDEX idx_vw_product_performance_revenue 
            ON vw_product_performance(total_revenue DESC);

            CREATE INDEX idx_vw_product_performance_margin 
            ON vw_product_performance(profit_margin_percentage DESC);
        `);
    }

    // 🔄 Función para refrescar vistas
    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP MATERIALIZED VIEW IF EXISTS vw_product_performance;
        `);
    }
}
```

---

## 🔧 **TRANSACCIONES Y COMMITS**

### **🎯 Ejemplo Completo: Transacción de Venta**

#### **📋 Use Case: Create Daily Sale (`create-daily-sale.use-case.ts`)**
```typescript
@Injectable()
export class CreateDailySaleUseCase {
    constructor(
        @Inject('ISalesRepository')
        private readonly salesRepository: ISalesRepository,
        private readonly dataSource: DataSource,
    ) {}

    async execute(userId: number, date: Date): Promise<DailySale> {
        const queryRunner = this.dataSource.createQueryRunner();
        
        // 🎯 Iniciar transacción con nivel de aislamiento
        await queryRunner.connect();
        await queryRunner.startTransaction('READ COMMITTED');

        try {
            // 1. Verificar si ya existe venta para el día
            const existingSale = await queryRunner.manager.findOne(DailySale, {
                where: { userId, saleDate: date }
            });

            if (existingSale) {
                throw new Error(`Ya existe una venta para el usuario ${userId} en la fecha ${date}`);
            }

            // 2. Crear venta diaria
            const dailySale = queryRunner.manager.create(DailySale, {
                userId,
                saleDate: date,
                totalRevenue: 0,
                profitMargin: 0,
                breakEvenUnits: 0,
            });

            const savedSale = await queryRunner.manager.save(dailySale);

            // 3. Registrar en auditoría (MongoDB - NoSQL)
            await this.logAuditEvent(userId, 'CREATE_DAILY_SALE', {
                dailySaleId: savedSale.id,
                saleDate: date,
            });

            // 4. Si todo va bien, hacer COMMIT
            await queryRunner.commitTransaction();

            return savedSale;

        } catch (error) {
            // ❌ Si algo falla, hacer ROLLBACK
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            // 🔓 Liberar recursos
            await queryRunner.release();
        }
    }

    // 📋 Auditoría asíncrona (no afecta transacción principal)
    private async logAuditEvent(userId: number, action: string, metadata: any): Promise<void> {
        try {
            // Esto es asíncrono y no bloquea la transacción principal
            await this.auditService.log({
                action,
                entityType: 'DailySale',
                userId: userId.toString(),
                metadata,
                level: 'info',
                description: `Daily sale created for user ${userId}`,
            });
        } catch (error) {
            console.error('Audit log failed:', error);
            // No relanzar el error para no afectar la transacción principal
        }
    }
}
```

---

## 🎯 **COMMIT Y ROLLBACK EN PRÁCTICA**

### **🔄 Flujo Completo de Transacción:**

```typescript
// 🎯 Ejemplo: Venta Completa con Inventario
async completeSale(saleData: CompleteSaleDto): Promise<any> {
    const queryRunner = this.dataSource.createQueryRunner();
    
    await queryRunner.connect();
    await queryRunner.startTransaction('REPEATABLE READ'); // 🎯 Aislamiento estricto

    try {
        // 📦 1. Verificar stock de todos los productos
        for (const item of saleData.items) {
            const stock = await this.inventoryRepository.getCurrentStock(
                queryRunner, 
                item.productId, 
                saleData.userId
            );
            
            if (stock < item.quantity) {
                throw new Error(`Stock insuficiente para producto ${item.productId}`);
            }
        }

        // 💰 2. Crear venta diaria si no existe
        let dailySale = await this.findOrCreateDailySale(queryRunner, saleData);

        // 📊 3. Agregar detalles de venta
        for (const item of saleData.items) {
            await this.addSaleDetail(queryRunner, dailySale.id, item);
        }

        // 📦 4. Actualizar inventario (salida)
        for (const item of saleData.items) {
            await this.inventoryRepository.updateInventory(
                item.productId,
                saleData.userId,
                item.quantity,
                'OUT'
            );
        }

        // 📈 5. Recalcular totales de venta
        await this.recalculateSaleTotals(queryRunner, dailySale.id);

        // 🎯 6. Si todo está correcto, hacer COMMIT
        await queryRunner.commitTransaction();

        return { success: true, dailySaleId: dailySale.id };

    } catch (error) {
        // ❌ Si algo falla, deshacer todo
        await queryRunner.rollbackTransaction();
        
        console.error('Transaction failed:', error);
        throw new Error(`Error en venta: ${error.message}`);
        
    } finally {
        // 🔓 Siempre liberar la conexión
        await queryRunner.release();
    }
}
```

---

## 🚀 **ENDPOINTS Y CONTROLLADORES**

### **🌐 Controller con Transacciones (`sales.controller.ts`)**
```typescript
@Controller('api/sales')
@UseGuards(JwtAuthGuard)
export class SalesController {
    constructor(private readonly salesService: SalesService) {}

    // 🎯 POST: Crear venta diaria
    @Post('daily')
    async createDailySale(
        @Body() createSaleDto: CreateDailySaleDto,
        @Request() req
    ): Promise<DailySale> {
        return this.salesService.createDailySale(
            req.user.id, 
            new Date(createSaleDto.saleDate)
        );
    }

    // 📊 GET: Obtener métricas de rendimiento
    @Get('metrics')
    async getMetrics(
        @Query('period') period: string = '30 days',
        @Request() req
    ): Promise<any> {
        return this.salesService.getPerformanceMetrics(req.user.id, period);
    }

    // 📈 GET: Top productos vendidos
    @Get('top-products')
    async getTopProducts(
        @Query('limit') limit: number = 10,
        @Request() req
    ): Promise<any> {
        return this.salesService.getTopProducts(req.user.id, limit);
    }

    // 🎯 POST: Agregar producto a venta
    @Post(':saleId/products')
    async addProductToSale(
        @Param('saleId') saleId: number,
        @Body() addProductDto: AddProductDto,
        @Request() req
    ): Promise<SaleDetail> {
        return this.salesService.addProductToSale(
            saleId, 
            addProductDto.productId, 
            addProductDto.quantity
        );
    }

    // 🎯 POST: Cerrar venta del día
    @Post(':saleId/close')
    async closeDailySale(
        @Param('saleId') saleId: number,
        @Request() req
    ): Promise<DailySale> {
        return this.salesService.closeDailySale(saleId);
    }
}
```

---

## 🎓 **RESUMEN PARA EXAMEN**

### **📁 Carpetas Importantes:**
- **`backend/src/modules/`** - Lógica de negocio
- **`backend/src/modules/*/repositories/`** - Consultas SQL
- **`database/migrations/`** - Estructura de base de datos
- **`backend/src/modules/*/use-cases/`** - Transacciones complejas

### **🔍 Servicios Clave:**
- **SalesService** - Lógica de ventas
- **InventoryRepository** - Control de stock
- **BenchmarkingService** - Análisis de rendimiento
- **AuditService** - Auditoría (MongoDB)

### **💾 Consultas SQL Importantes:**
- **CTEs (Common Table Expressions)** para cálculos complejos
- **Vistas materializadas** para rendimiento
- **Transacciones con niveles de aislamiento**
- **Funciones PostgreSQL** para lógica de negocio

### **🔄 Transacciones y Commits:**
- **QueryRunner** para control manual
- **READ COMMITTED** para operaciones normales
- **REPEATABLE READ** para consistencia
- **ROLLBACK automático** en errores

**¡Con esta estructura tienes cobertura completa para cualquier pregunta técnica!** 🚀
