# 🎯 **¿DÓNDE USAMOS TYPEORM? - IMPLEMENTACIÓN PRÁCTICA**

## 🗺️ **MAPA COMPLETO DE USO DE TYPEORM**

---

## 📍 **UBICACIONES PRINCIPALES DE TYPEORM**

### **🎯 Configuración Principal:**
```
backend/src/config/database.config.ts
```
**Propósito:** Configuración global de TypeORM con PostgreSQL

---

## 📦 **MÓDULOS DONDE SE USA TYPEORM**

### **1. 💰 SALES MODULE - Ventas**

#### **📍 Rutas Completas:**
```
backend/src/modules/sales/
├── entities/                           # 🗄️ Entidades TypeORM
│   ├── daily-sale.entity.ts           # 💰 Ventas diarias
│   └── sale-detail.entity.ts          # 📊 Detalles de venta
├── repositories/                       # 💾 Repositorios TypeORM
│   └── sales.repository.ts            # 🔍 Acceso a datos
├── dto/                               # 📝 DTOs de validación
│   ├── create-daily-sale.dto.ts       # ✅ Validación de creación
│   └── add-product.dto.ts             # ✅ Validación de productos
└── sales.module.ts                    # 📦 Configuración TypeORM
```

#### **🔍 Uso Específico:**
```typescript
// 🗄️ Entidad con decoradores TypeORM
@Entity('daily_sales')
@Index(['userId', 'saleDate'])
export class DailySale {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'integer' })
    userId: number;

    @Column({ type: 'date' })
    saleDate: Date;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    totalRevenue: number;

    // 🔗 Relación One-to-Many
    @OneToMany(() => SaleDetail, detail => detail.dailySale, {
        cascade: true,
        onDelete: 'CASCADE'
    })
    saleDetails: SaleDetail[];
}

// 💾 Repository con TypeORM
@Injectable()
export class SalesRepository {
    constructor(
        @InjectRepository(DailySale)                    // 🎯 Inyección TypeORM
        private dailySaleRepository: Repository<DailySale>,
        
        @InjectRepository(SaleDetail)                   // 🎯 Inyección TypeORM
        private saleDetailRepository: Repository<SaleDetail>,
        
        @InjectRepository(Product)                      // 🎯 Inyección TypeORM
        private productRepository: Repository<Product>,
        
        private dataSource: DataSource                 // 🔧 Para queries complejas
    ) {}

    // 🎯 Métodos TypeORM básicos
    async create(dailySale: Partial<DailySale>): Promise<DailySale> {
        const newSale = this.dailySaleRepository.create(dailySale);
        return this.dailySaleRepository.save(newSale);
    }

    // 📊 Query Builder TypeORM
    async getPerformanceMetrics(userId: number): Promise<any> {
        return this.dailySaleRepository.createQueryBuilder('ds')
            .leftJoin('ds.saleDetails', 'sd')
            .select([
                'COUNT(DISTINCT ds.id) as totalDays',
                'AVG(ds.totalRevenue) as avgRevenue'
            ])
            .where('ds.userId = :userId', { userId })
            .getRawOne();
    }
}

// 📦 Configuración en módulo
@Module({
    imports: [
        TypeOrmModule.forFeature([               // 🎯 TypeORM - Entidades del módulo
            DailySale,
            SaleDetail,
            Product,
            InventoryRecord
        ])
    ],
    controllers: [SalesController],
    providers: [SalesService, SalesRepository],
    exports: [SalesService]
})
export class SalesModule {}
```

---

### **2. 📊 BENCHMARKING MODULE - Rendimiento**

#### **📍 Rutas Completas:**
```
backend/src/modules/benchmarking/
├── entities/                           # 🗄️ Entidades TypeORM
│   ├── benchmarking-snapshot.entity.ts # 📸 Snapshots
│   ├── query-performance-log.entity.ts # 🔍 Logs de queries
│   ├── system-metrics.entity.ts        # 📊 Métricas del sistema
│   └── performance-alert.entity.ts     # 🚨 Alertas
├── repositories/                       # 💾 Repositorios TypeORM
│   ├── snapshot.repository.ts          # 📸 Gestión de snapshots
│   └── metrics.repository.ts            # 📊 Análisis de métricas
└── benchmarking.module.ts              # 📦 Configuración TypeORM
```

#### **🔍 Uso Específico:**
```typescript
// 🗄️ Entidad de Snapshot con TypeORM
@Entity('benchmarking_snapshots')
export class BenchmarkingSnapshot {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'integer' })
    userId: number;

    @Column({ type: 'jsonb' })               // 📊 JSONB para métricas flexibles
    metricsData: Record<string, any>;

    @Column({ type: 'varchar', length: 50 })
    snapshotType: string;

    @CreateDateColumn()
    createdAt: Date;
}

// 💾 Repository con queries complejas
@Injectable()
export class SnapshotRepository {
    constructor(
        @InjectRepository(BenchmarkingSnapshot)
        private snapshotRepository: Repository<BenchmarkingSnapshot>
    ) {}

    // 📊 Query Builder con JSONB
    async getMetricsByType(type: string): Promise<any> {
        return this.snapshotRepository.createQueryBuilder('snapshot')
            .select([
                'COUNT(*) as snapshotCount',
                'AVG((snapshot.metricsData->>\\"query_time\\")::float) as avgQueryTime',
                'MAX((snapshot.metricsData->>\\"cache_hit_rate\\")::float) as maxCacheHitRate'
            ])
            .where('snapshot.snapshotType = :type', { type })
            .andWhere('snapshot.createdAt >= :date', { 
                date: new Date(Date.now() - 24 * 60 * 60 * 1000) 
            })
            .getRawOne();
    }
}
```

---

### **3. 📦 INVENTORY MODULE - Inventario**

#### **📍 Rutas Completas:**
```
backend/src/modules/inventory/
├── entities/                           # 🗄️ Entidades TypeORM
│   └── inventory-record.entity.ts     # 📦 Registros de inventario
├── repositories/                       # 💾 Repositorios TypeORM
│   └── inventory.repository.ts         # 🔍 Gestión de stock
└── inventory.module.ts                 # 📦 Configuración TypeORM
```

#### **🔍 Uso Específico:**
```typescript
// 🗄️ Entidad de Inventario
@Entity('inventory_records')
export class InventoryRecord {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'integer' })
    productId: number;

    @Column({ type: 'integer' })
    userId: number;

    @Column({ type: 'integer' })
    quantity: number;

    @Column({ type: 'varchar', length: 20 })
    operationType: string;                   // IN, OUT, ADJUST

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    unitCost: number;

    @CreateDateColumn()
    createdAt: Date;
}

// 💾 Repository con transacciones
@Injectable()
export class InventoryRepository {
    constructor(
        @InjectRepository(InventoryRecord)
        private inventoryRepository: Repository<InventoryRecord>,
        private dataSource: DataSource
    ) {}

    // 🔄 Transacción con QueryRunner TypeORM
    async updateStock(
        productId: number, 
        userId: number, 
        quantity: number, 
        operation: string
    ): Promise<void> {
        const queryRunner = this.dataSource.createQueryRunner();
        
        await queryRunner.connect();
        await queryRunner.startTransaction('READ COMMITTED');

        try {
            // 1. Verificar stock actual
            const currentStock = await this.getCurrentStock(queryRunner, productId, userId);
            
            if (operation === 'OUT' && currentStock < quantity) {
                throw new Error('Stock insuficiente');
            }

            // 2. Insertar registro
            const record = queryRunner.manager.create(InventoryRecord, {
                productId,
                userId,
                quantity,
                operationType: operation
            });
            
            await queryRunner.manager.save(record);
            
            await queryRunner.commitTransaction();
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }
}
```

---

### **4. 🛍️ PRODUCTS MODULE - Productos**

#### **📍 Rutas Completas:**
```
backend/src/modules/products/
├── entities/                           # 🗄️ Entidades TypeORM
│   └── product.entity.ts               # 🛍️ Productos
├── repositories/                       # 💾 Repositorios TypeORM
│   └── product.repository.ts          # 🔍 Gestión de catálogo
└── products.module.ts                 # 📦 Configuración TypeORM
```

#### **🔍 Uso Específico:**
```typescript
// 🗄️ Entidad de Producto
@Entity('products')
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'varchar', length: 100 })
    category: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    baseCost: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    suggestedPrice: number;

    @Column({ type: 'boolean', default: true })
    isActive: boolean;

    // 🔗 Relación One-to-Many con InventoryRecords
    @OneToMany(() => InventoryRecord, record => record.product, {
        cascade: true
    })
    inventoryRecords: InventoryRecord[];
}

// 💾 Repository con búsquedas optimizadas
@Injectable()
export class ProductRepository {
    constructor(
        @InjectRepository(Product)
        private productRepository: Repository<Product>
    ) {}

    // 📊 Búsqueda con filtros
    async findActiveProducts(category?: string): Promise<Product[]> {
        const queryBuilder = this.productRepository.createQueryBuilder('product')
            .leftJoinAndSelect('product.inventoryRecords', 'inventory')
            .where('product.isActive = :isActive', { isActive: true });

        if (category) {
            queryBuilder.andWhere('product.category = :category', { category });
        }

        return queryBuilder.getMany();
    }
}
```

---

### **5. 👥 USERS MODULE - Usuarios**

#### **📍 Rutas Completas:**
```
backend/src/modules/users/
├── entities/                           # 🗄️ Entidades TypeORM
│   └── user.entity.ts                  # 👥 Usuarios
├── repositories/                       # 💾 Repositorios TypeORM
│   └── user.repository.ts              # 🔍 Gestión de usuarios
└── users.module.ts                     # 📦 Configuración TypeORM
```

#### **🔍 Uso Específico:**
```typescript
// 🗄️ Entidad de Usuario
@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255, unique: true })
    email: string;

    @Column({ type: 'varchar', length: 255 })
    passwordHash: string;

    @Column({ type: 'varchar', length: 50, default: 'vendor' })
    role: string;

    // 🔗 Relaciones
    @OneToMany(() => DailySale, sale => sale.user)
    dailySales: DailySale[];

    @OneToMany(() => InventoryRecord, record => record.user)
    inventoryRecords: InventoryRecord[];
}

// 💾 Repository con validaciones
@Injectable()
export class UserRepository {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) {}

    // 🔍 Búsqueda por email
    async findByEmail(email: string): Promise<User | null> {
        return this.userRepository.findOne({
            where: { email },
            select: ['id', 'email', 'passwordHash', 'role']
        });
    }

    // 📊 Usuarios con métricas
    async findUsersWithMetrics(): Promise<any> {
        return this.userRepository.createQueryBuilder('user')
            .leftJoin('user.dailySales', 'sales')
            .select([
                'user.id',
                'user.email',
                'user.role',
                'COUNT(sales.id) as totalSales',
                'COALESCE(SUM(sales.totalRevenue), 0) as totalRevenue'
            ])
            .groupBy('user.id')
            .getRawMany();
    }
}
```

---

## 🗄️ **6. CONFIGURACIÓN GLOBAL DE TYPEORM**

### **📍 Ruta Principal:**
```
backend/src/app.module.ts
```

### **🔍 Configuración:**
```typescript
@Module({
  imports: [
    // 🗄️ TypeORM Global
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getTypeOrmConfig,
      inject: [ConfigService]
    }),
    
    // 📦 Módulos que usan TypeORM
    SalesModule,           // 💰 Ventas
    BenchmarkingModule,   // 📊 Rendimiento
    InventoryModule,       // 📦 Inventario
    ProductsModule,        // 🛍️ Productos
    UsersModule,           // 👥 Usuarios
    AuthModule             // 🔐 Autenticación
  ]
})
export class AppModule {}
```

---

## 🎯 **7. ¿POR QUÉ TYPEORM EN TIENDITACAMPUS?**

### **🚀 Ventajas Específicas:**

#### **1. Tipado Fuerte con TypeScript:**
```typescript
// ✅ TypeORM - Tipado seguro
const dailySale: DailySale = await this.salesRepository.findById(1);
console.log(dailySale.totalRevenue.toFixed(2)); // ✅ Autocompletado

// ❌ SQL puro - Sin tipado
const result = await this.connection.query('SELECT * FROM daily_sales WHERE id = 1');
console.log(result[0]?.total_revenue); // ❌ Sin autocompletado
```

#### **2. Relaciones Automáticas:**
```typescript
// ✅ TypeORM - Relaciones automáticas
const sale = await this.salesRepository.findOne({
    where: { id: 1 },
    relations: ['saleDetails', 'saleDetails.product']
});
console.log(sale.saleDetails[0].product.name); // ✅ Acceso directo

// ❌ SQL - Joins manuales
const query = `
    SELECT ds.*, sd.*, p.* 
    FROM daily_sales ds 
    LEFT JOIN sale_details sd ON ds.id = sd.daily_sale_id 
    LEFT JOIN products p ON sd.product_id = p.id 
    WHERE ds.id = 1
`;
```

#### **3. Migraciones Controladas:**
```typescript
// ✅ TypeORM - Migraciones versionadas
npm run migration:generate -- -n CreateDailySaleTable
npm run migration:run
npm run migration:revert

// ❌ SQL - Scripts manuales propensos a errores
-- Ejecutar manualmente scripts SQL sin control de versiones
```

#### **4. Validaciones Integradas:**
```typescript
// ✅ TypeORM - Validaciones a nivel de BD
@Entity()
@Check('profit_margin >= 0 AND profit_margin <= 100')
export class DailySale {
    @Column({ type: 'decimal', precision: 5, scale: 2 })
    profitMargin: number; // ✅ Validado automáticamente
}

// ❌ SQL - Validaciones manuales
if (profitMargin < 0 || profitMargin > 100) {
    throw new Error('Margen inválido'); // ❌ Manual y propenso a errores
}
```

---

## 📊 **8. PERFORMANCE CON TYPEORM**

### **🚀 Optimizaciones Implementadas:**

#### **1. Connection Pooling:**
```typescript
// 📊 Configuración de pool en database.config.ts
extra: {
    max: 20,         // Máximo de conexiones
    min: 5,          // Mínimo de conexiones
    idle: 10000,     // Tiempo idle
    acquire: 60000   // Tiempo para adquirir
}
```

#### **2. Índices Estratégicos:**
```typescript
// 📊 Índices en entidades
@Entity()
@Index(['userId', 'saleDate'])               // Para búsquedas frecuentes
@Index(['productId', 'createdAt'])           // Para análisis
export class DailySale {
    // ...
}
```

#### **3. Lazy Loading de Relaciones:**
```typescript
// 📊 Cargar relaciones bajo demanda
const sale = await this.salesRepository.findOne({ where: { id: 1 } });
const details = await this.salesRepository.findOne({
    where: { id: 1 },
    relations: ['saleDetails'] // Solo cuando se necesita
});
```

#### **4. Queries Nativas para Rendimiento Máximo:**
```typescript
// 🚀 SQL nativo para operaciones críticas
async getTopProducts(userId: number): Promise<any> {
    const query = `
        SELECT p.id, p.name, SUM(sd.quantity_sold) as total_sold
        FROM products p
        INNER JOIN sale_details sd ON p.id = sd.product_id
        INNER JOIN daily_sales ds ON sd.daily_sale_id = ds.id
        WHERE ds.user_id = $1
        GROUP BY p.id, p.name
        ORDER BY total_sold DESC
        LIMIT 10
    `;
    return this.dataSource.query(query, [userId]);
}
```

---

## 🎯 **9. RESUMEN DE USO DE TYPEORM**

### **📁 Carpetas Principales:**
```
backend/src/
├── config/
│   └── database.config.ts           # ⚙️ Configuración global
├── modules/
│   ├── sales/
│   │   ├── entities/                 # 🗄️ DailySale, SaleDetail
│   │   ├── repositories/             # 💾 SalesRepository
│   │   └── sales.module.ts           # 📦 TypeOrmModule.forFeature
│   ├── benchmarking/
│   │   ├── entities/                 # 🗄️ Snapshot, Metrics, Alerts
│   │   ├── repositories/             # 💾 SnapshotRepository
│   │   └── benchmarking.module.ts    # 📦 TypeOrmModule.forFeature
│   ├── inventory/
│   │   ├── entities/                 # 🗄️ InventoryRecord
│   │   ├── repositories/             # 💾 InventoryRepository
│   │   └── inventory.module.ts        # 📦 TypeOrmModule.forFeature
│   ├── products/
│   │   ├── entities/                 # 🗄️ Product
│   │   ├── repositories/             # 💾 ProductRepository
│   │   └── products.module.ts        # 📦 TypeOrmModule.forFeature
│   └── users/
│       ├── entities/                 # 🗄️ User
│       ├── repositories/             # 💾 UserRepository
│       └── users.module.ts           # 📦 TypeOrmModule.forFeature
└── app.module.ts                     # 🎯 TypeOrmModule.forRoot
```

### **🎯 ¿Por qué TypeORM?**
- **Tipado fuerte** con TypeScript
- **Relaciones automáticas** entre entidades
- **Migraciones controladas** de base de datos
- **Validaciones integradas** a nivel de entidad
- **Query Builder** para consultas complejas
- **Transacciones seguras** con QueryRunner
- **Performance** con connection pooling
- **Escalabilidad** para crecimiento futuro

**¡TypeORM es la base de datos de TienditaCampus!** 🚀
