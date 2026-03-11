# 🔧 **TYPEORM EN TIENDITACAMPUS - IMPLEMENTACIÓN COMPLETA**

## 🎯 **EXPLICACIÓN DETALLADA DEL ORM**

---

## 📋 **¿QUÉ ES TYPEORM?**

### **🔍 Definición:**
**TypeORM** es un **Object-Relational Mapping (ORM)** para TypeScript y JavaScript que permite:
- **Mapear objetos** a tablas de base de datos
- **Trabajar con bases de datos** usando código TypeScript
- **Abstraer SQL complejo** en operaciones simples
- **Mantener tipado fuerte** en operaciones de base de datos

### **🚀 ¿Por qué TypeORM en TienditaCampus?**
- **Tipado fuerte** con TypeScript
- **Decoradores** para definir entidades
- **Relaciones** fáciles entre tablas
- **Migraciones** automáticas
- **Queries complejas** con TypeORM Query Builder
- **Integración** perfecta con NestJS

---

## 🏗️ **1. CONFIGURACIÓN PRINCIPAL DE TYPEORM**

### **📍 Ruta:**
```
c:\Users\jaras\Downloads\git hub todos docuemntacion\claude code con ollama\proyecto integrsaaodr\pi_privado_backup\backend\src\config\database.config.ts
```

### **🔍 Configuración Completa:**
```typescript
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';

export const getTypeOrmConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
    type: 'postgres',                    // 🗄️ Tipo de base de datos
    host: configService.get('POSTGRES_HOST', 'database'),
    port: configService.get('POSTGRES_PORT', 5432),
    username: configService.get('POSTGRES_USER', 'tienditacampus_user'),
    password: configService.get('POSTGRES_PASSWORD', 'tienditacampus_pass123'),
    database: configService.get('POSTGRES_DB', 'tienditacampus'),
    
    // 📁 Entidades (modelos de datos)
    entities: [
        join(__dirname, '..', 'modules', '**', '*.entity.{ts,js}'),
        join(__dirname, '..', 'modules', '**', 'schemas', '*.{ts,js}')
    ],
    
    // 🔄 Migraciones (control de versiones de DB)
    migrations: [join(__dirname, '..', 'database', 'migrations', '*.{ts,js}')],
    migrationsRun: true,
    
    // 🌱 Seeds (datos iniciales)
    seeds: [join(__dirname, '..', 'database', 'seeds', '*.{ts,js}')],
    seedsRun: true,
    
    // ⚙️ Configuración de rendimiento
    synchronize: false,                   // ❌ No sincronizar automáticamente (seguro)
    logging: configService.get('NODE_ENV') === 'development', // 📝 Logs en desarrollo
    
    // 🚀 Pool de conexiones
    extra: {
        max: 20,                         // 🔢 Máximo de conexiones
        min: 5,                          // 🔢 Mínimo de conexiones
        idle: 10000,                     // ⏱️ Tiempo idle en ms
        acquire: 60000,                  // ⏱️ Tiempo para adquirir conexión
        // 🎯 Habilitar pg_stat_statements para benchmarking
        statement_timeout: 30000,
        query_timeout: 30000
    }
});
```

---

## 📊 **2. ENTIDADES - MODELOS DE DATOS**

### **🎯 Entidad Principal: DailySale**

#### **📍 Ruta:**
```
c:\Users\jaras\Downloads\git hub todos docuemntacion\claude code con ollama\proyecto integrsaaodr\pi_privado_backup\backend\src\modules\sales\entities\daily-sale.entity.ts
```

#### **🔍 Implementación Completa:**
```typescript
import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    CreateDateColumn, 
    UpdateDateColumn,
    OneToMany,
    Index,
    Check
} from 'typeorm';
import { SaleDetail } from './sale-detail.entity';

@Entity('daily_sales')                          // 🗄️ Nombre de la tabla en la BD
@Index(['userId', 'saleDate'])               // 📊 Índice compuesto para rendimiento
export class DailySale {
    
    @PrimaryGeneratedColumn()                  // 🎯 ID auto-incremental
    id: number;

    @Column({ type: 'integer' })               // 🔢 Relación con users
    userId: number;

    @Column({ type: 'date' })                  // 📅 Fecha de venta
    saleDate: Date;

    @Column({ 
        type: 'decimal', 
        precision: 10, 
        scale: 2, 
        default: 0 
    })                                        // 💵 Ingresos totales
    totalRevenue: number;

    @Column({ 
        type: 'decimal', 
        precision: 5, 
        scale: 2, 
        default: 0 
    })                                        // 📈 Margen de ganancia
    profitMargin: number;

    @Column({ 
        type: 'integer', 
        default: 0 
    })                                        // ⚖️ Unidades punto de equilibrio
    breakEvenUnits: number;

    @CreateDateColumn()                        // 🕐 Timestamp de creación
    createdAt: Date;

    @Column({ type: 'timestamp', nullable: true }) // 🕐 Timestamp de cierre
    closedAt?: Date;

    // 🔗 Relación One-to-Many con SaleDetails
    @OneToMany(() => SaleDetail, detail => detail.dailySale, {
        cascade: true,                         // 🔄 Operaciones en cascada
        eager: false,                          // 📥 No cargar automáticamente
        onDelete: 'CASCADE'                    // 🗑️ Eliminar detalles si se elimina venta
    })
    saleDetails: SaleDetail[];

    // ✅ Validación a nivel de base de datos
    @Check('profit_margin >= 0 AND profit_margin <= 100')
    static validateProfitMargin() {
        // Validación automática en la BD
    }
}
```

### **🎯 Entidad Relacionada: SaleDetail**

#### **📍 Ruta:**
```
c:\Users\jaras\Downloads\git hub todos docuemntacion\claude code con ollama\proyecto integrsaaodr\pi_privado_backup\backend\src\modules\sales\entities\sale-detail.entity.ts
```

#### **🔍 Implementación Completa:**
```typescript
import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
    Index,
    Check
} from 'typeorm';
import { DailySale } from './daily-sale.entity';
import { Product } from '../../products/entities/product.entity';

@Entity('sale_details')
@Index(['productId', 'dailySaleId'])          // 📊 Índice para análisis de productos
export class SaleDetail {
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'integer' })
    dailySaleId: number;

    @Column({ type: 'integer' })
    productId: number;

    @Column({ type: 'integer', default: 0 })
    quantityPrepared: number;                  // 📦 Cantidad preparada

    @Column({ type: 'integer', default: 0 })
    quantitySold: number;                      // 💰 Cantidad vendida

    @Column({ 
        type: 'decimal', 
        precision: 10, 
        scale: 2 
    })
    unitCost: number;                          // 💲 Costo unitario

    @Column({ 
        type: 'decimal', 
        precision: 10, 
        scale: 2 
    })
    unitPrice: number;                         // 💵 Precio unitario

    @Column({ type: 'text', nullable: true })
    wasteReason?: string;                       // 🗑️ Razón de merma

    @CreateDateColumn()
    createdAt: Date;

    // 🔗 Relación Many-to-One con DailySale
    @ManyToOne(() => DailySale, sale => sale.saleDetails, {
        onDelete: 'CASCADE'                    // 🗑️ Eliminar si se elimina venta
    })
    @JoinColumn({ name: 'dailySaleId' })
    dailySale: DailySale;

    // 🔗 Relación Many-to-One con Product
    @ManyToOne(() => Product, {
        onDelete: 'RESTRICT'                    // 🚫 No eliminar si tiene ventas
    })
    @JoinColumn({ name: 'productId' })
    product: Product;

    // 💰 Propiedades calculadas (no se guardan en BD)
    get totalRevenue(): number {
        return this.quantitySold * this.unitPrice;
    }

    get totalCost(): number {
        return this.quantitySold * this.unitCost;
    }

    get profit(): number {
        return this.totalRevenue - this.totalCost;
    }

    get wasteCost(): number {
        const waste = this.quantityPrepared - this.quantitySold;
        return waste > 0 ? waste * this.unitCost : 0;
    }

    // ✅ Validaciones a nivel de entidad
    @Check('quantity_sold <= quantity_prepared')
    @Check('quantity_prepared >= 0 AND quantity_sold >= 0')
    @Check('unit_price >= unit_cost')
    static validateQuantities() {
        // Validaciones automáticas
    }
}
```

---

## 🗄️ **3. REPOSITORIES - ACCESO A DATOS**

### **🎯 Repository Principal: SalesRepository**

#### **📍 Ruta:**
```
c:\Users\jaras\Downloads\git hub todos docuemntacion\claude code con ollama\proyecto integrsaaodr\pi_privado_backup\backend\src\modules\sales\repositories\sales.repository.ts
```

#### **🔍 Implementación Completa:**
```typescript
import { Injectable } from '@nestjs/common';
import { 
    Repository, 
    DataSource, 
    InjectRepository 
} from 'typeorm';
import { DailySale } from '../entities/daily-sale.entity';
import { SaleDetail } from '../entities/sale-detail.entity';
import { Product } from '../../products/entities/product.entity';
import { ISalesRepository } from '../interfaces/sales-repository.interface';

@Injectable()
export class SalesRepository implements ISalesRepository {
    constructor(
        @InjectRepository(DailySale)
        private dailySaleRepository: Repository<DailySale>,
        
        @InjectRepository(SaleDetail)
        private saleDetailRepository: Repository<SaleDetail>,
        
        @InjectRepository(Product)
        private productRepository: Repository<Product>,
        
        private dataSource: DataSource                // 🔧 Para queries complejas
    ) {}

    // 🎯 Métodos básicos con TypeORM
    async create(dailySale: Partial<DailySale>): Promise<DailySale> {
        const newSale = this.dailySaleRepository.create(dailySale);
        return this.dailySaleRepository.save(newSale);
    }

    async findById(id: number): Promise<DailySale | null> {
        return this.dailySaleRepository.findOne({
            where: { id },
            relations: ['saleDetails', 'saleDetails.product'] // 🔗 Cargar relaciones
        });
    }

    async findByUserAndDate(userId: number, date: Date): Promise<DailySale | null> {
        return this.dailySaleRepository.findOne({
            where: { userId, saleDate: date },
            relations: ['saleDetails']
        });
    }

    // 📊 Métodos complejos con Query Builder
    async getPerformanceMetrics(userId: number, period: string): Promise<any> {
        const queryBuilder = this.dailySaleRepository.createQueryBuilder('ds')
            .leftJoin('ds.saleDetails', 'sd')
            .leftJoin('sd.product', 'p')
            .select([
                'COUNT(DISTINCT ds.id) as totalDays',
                'AVG(ds.totalRevenue) as avgRevenue',
                'AVG(ds.profitMargin) as avgMargin',
                'SUM(sd.quantitySold) as totalUnits',
                'COUNT(DISTINCT p.id) as uniqueProducts'
            ])
            .where('ds.userId = :userId', { userId })
            .andWhere(`ds.saleDate >= CURRENT_DATE - INTERVAL '${period}'`);

        return queryBuilder.getRawOne(); // 📊 Retorna resultados crudos
    }

    // 🚀 Queries SQL nativas para máximo rendimiento
    async getTopProducts(userId: number, limit: number = 10): Promise<any> {
        const query = `
            SELECT 
                p.id,
                p.name,
                p.category,
                SUM(sd.quantity_sold) as total_sold,
                SUM(sd.total_revenue) as total_revenue,
                AVG(sd.unit_price) as avg_price,
                RANK() OVER (ORDER BY SUM(sd.quantity_sold) DESC) as sales_rank
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

    // 🔄 Transacciones complejas
    async createDailySaleWithDetails(
        dailySaleData: Partial<DailySale>,
        detailsData: Partial<SaleDetail>[]
    ): Promise<DailySale> {
        const queryRunner = this.dataSource.createQueryRunner();
        
        await queryRunner.connect();
        await queryRunner.startTransaction('READ COMMITTED');

        try {
            // 1. Crear venta principal
            const dailySale = queryRunner.manager.create(DailySale, dailySaleData);
            const savedSale = await queryRunner.manager.save(dailySale);

            // 2. Crear detalles con relaciones
            for (const detailData of detailsData) {
                const detail = queryRunner.manager.create(SaleDetail, {
                    ...detailData,
                    dailySaleId: savedSale.id
                });
                await queryRunner.manager.save(detail);
            }

            // 3. Recalcular totales
            await this.recalculateTotals(queryRunner, savedSale.id);

            await queryRunner.commitTransaction();
            return savedSale;

        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    // 📊 Queries con vistas materializadas
    async getProductPerformance(): Promise<any> {
        return this.dailySaleRepository.query(`
            SELECT * FROM vw_product_performance 
            WHERE total_revenue > 0 
            ORDER BY profit_margin DESC
            LIMIT 20
        `);
    }

    // 🔧 Método privado para recalcular totales
    private async recalculateTotals(queryRunner: any, dailySaleId: number): Promise<void> {
        const updateQuery = `
            UPDATE daily_sales 
            SET 
                total_revenue = (
                    SELECT COALESCE(SUM(quantity_sold * unit_price), 0)
                    FROM sale_details 
                    WHERE daily_sale_id = $1
                ),
                profit_margin = CASE 
                    WHEN (
                        SELECT COALESCE(SUM(quantity_sold * unit_cost), 0)
                        FROM sale_details 
                        WHERE daily_sale_id = $1
                    ) > 0
                    THEN (
                        (SELECT COALESCE(SUM(quantity_sold * unit_price), 0) FROM sale_details WHERE daily_sale_id = $1) -
                        (SELECT COALESCE(SUM(quantity_sold * unit_cost), 0) FROM sale_details WHERE daily_sale_id = $1)
                    ) / (SELECT COALESCE(SUM(quantity_sold * unit_cost), 0) FROM sale_details WHERE daily_sale_id = $1) * 100
                    ELSE 0
                END
            WHERE id = $1
        `;
        
        await queryRunner.query(updateQuery, [dailySaleId]);
    }
}
```

---

## 📦 **4. MÓDULOS - ORGANIZACIÓN**

### **🎯 Módulo de Ventas**

#### **📍 Ruta:**
```
c:\Users\jaras\Downloads\git hub todos docuemntacion\claude code con ollama\proyecto integrsaaodr\pi_privado_backup\backend\src\modules\sales\sales.module.ts
```

#### **🔍 Configuración Completa:**
```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalesController } from './sales.controller';
import { SalesService } from './sales.service';
import { SalesRepository, ISalesRepository } from './repositories/sales.repository';
import { DailySale } from './entities/daily-sale.entity';
import { SaleDetail } from './entities/sale-detail.entity';
import { Product } from '../products/entities/product.entity';
import { InventoryRecord } from '../inventory/entities/inventory-record.entity';
import { InventoryModule } from '../inventory/inventory.module';
import { CreateDailySaleUseCase } from './use-cases/create-daily-sale.use-case';
import { CloseDayUseCase } from './use-cases/close-day.use-case';
import { TrackSaleUseCase } from './use-cases/track-sale.use-case';

@Module({
    // 🗄️ Entidades que este módulo maneja
    imports: [
        TypeOrmModule.forFeature([
            DailySale,        // 💰 Ventas diarias
            SaleDetail,       // 📊 Detalles de venta
            Product,          // 🛍️ Productos
            InventoryRecord   // 📦 Inventario
        ]),
        InventoryModule     // 📦 Módulo de inventario (dependencia)
    ],
    
    // 🌐 Endpoints HTTP
    controllers: [SalesController],
    
    // 💼 Servicios y repositorios
    providers: [
        SalesService,                    // 🎯 Lógica de negocio principal
        
        // 💾 Repositorio con inyección de dependencias
        SalesRepository,
        {
            provide: 'ISalesRepository',  // 🔧 Interfaz para desacoplamiento
            useClass: SalesRepository
        },
        
        // 🎲 Casos de uso específicos
        CreateDailySaleUseCase,
        CloseDayUseCase,
        TrackSaleUseCase
    ],
    
    // 📤 Exportar para otros módulos
    exports: [SalesService, ISalesRepository]
})
export class SalesModule {}
```

---

## 🌐 **5. SERVICIOS - LÓGICA DE NEGOCIO**

### **🎯 Servicio Principal: SalesService**

#### **📍 Ruta:**
```
c:\Users\jaras\Downloads\git hub todos docuemntacion\claude code con ollama\proyecto integrsaaodr\pi_privado_backup\backend\src\modules\sales\sales.service.ts
```

#### **🔍 Implementación Completa:**
```typescript
import { Injectable } from '@nestjs/common';
import { DailySale } from './entities/daily-sale.entity';
import { SaleDetail } from './entities/sale-detail.entity';
import { ISalesRepository } from './interfaces/sales-repository.interface';
import { CreateDailySaleUseCase } from './use-cases/create-daily-sale.use-case';
import { CloseDayUseCase } from './use-cases/close-day.use-case';
import { TrackSaleUseCase } from './use-cases/track-sale.use-case';

@Injectable()
export class SalesService {
    constructor(
        @Inject('ISalesRepository')
        private readonly salesRepository: ISalesRepository,
        
        // 🎲 Inyectar casos de uso (patrón Command Query Separation)
        private readonly createDailySaleUseCase: CreateDailySaleUseCase,
        private readonly closeDayUseCase: CloseDayUseCase,
        private readonly trackSaleUseCase: TrackSaleUseCase,
    ) {}

    // 🎯 Crear venta diaria (usando caso de uso)
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

    // 🏆 Productos más vendidos
    async getTopProducts(userId: number, limit: number = 10): Promise<any> {
        return this.salesRepository.getTopProducts(userId, limit);
    }

    // 📊 Análisis con vistas materializadas
    async getProductPerformance(): Promise<any> {
        return this.salesRepository.getProductPerformance();
    }

    // 🔍 Buscar venta por ID con relaciones
    async findSaleById(id: number): Promise<DailySale | null> {
        return this.salesRepository.findById(id);
    }

    // 📅 Buscar venta por usuario y fecha
    async findSaleByUserAndDate(userId: number, date: Date): Promise<DailySale | null> {
        return this.salesRepository.findByUserAndDate(userId, date);
    }
}
```

---

## 🎲 **6. USE CASES - PATRÓN CQS**

### **🎯 Use Case: CreateDailySaleUseCase**

#### **📍 Ruta:**
```
c:\Users\jaras\Downloads\git hub todos docuemntacion\claude code con ollama\proyecto integrsaaodr\pi_privado_backup\backend\src\modules\sales\use-cases\create-daily-sale.use-case.ts
```

#### **🔍 Implementación Completa:**
```typescript
import { Injectable } from '@nestjs/common';
import { DailySale } from '../entities/daily-sale.entity';
import { ISalesRepository } from '../interfaces/sales-repository.interface';

@Injectable()
export class CreateDailySaleUseCase {
    constructor(
        @Inject('ISalesRepository')
        private readonly salesRepository: ISalesRepository,
    ) {}

    async execute(userId: number, date: Date): Promise<DailySale> {
        // 1. Verificar si ya existe venta para el día
        const existingSale = await this.salesRepository.findByUserAndDate(userId, date);
        
        if (existingSale) {
            throw new Error(`Ya existe una venta para el usuario ${userId} en la fecha ${date.toISOString()}`);
        }

        // 2. Crear nueva venta con valores por defecto
        const dailySaleData = {
            userId,
            saleDate: date,
            totalRevenue: 0,
            profitMargin: 0,
            breakEvenUnits: 0
        };

        // 3. Guardar en base de datos
        return this.salesRepository.create(dailySaleData);
    }
}
```

---

## 🌐 **7. CONTROLLERS - ENDPOINTS HTTP**

### **🎯 Controller: SalesController**

#### **📍 Ruta:**
```
c:\Users\jaras\Downloads\git hub todos docuemntacion\claude code con ollama\proyecto integrsaaodr\pi_privado_backup\backend\src\modules\sales\sales.controller.ts
```

#### **🔍 Implementación Completa:**
```typescript
import { 
    Controller, 
    Get, 
    Post, 
    Body, 
    Param, 
    Query, 
    Request,
    UseGuards,
    ValidationPipe
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SalesService } from './sales.service';
import { CreateDailySaleDto } from './dto/create-daily-sale.dto';
import { AddProductDto } from './dto/add-product.dto';

@Controller('api/sales')
@UseGuards(JwtAuthGuard)                    // 🔐 Proteger todos los endpoints
export class SalesController {
    constructor(private readonly salesService: SalesService) {}

    // 🎯 POST: Crear venta diaria
    @Post('daily')
    async createDailySale(
        @Body(ValidationPipe) createSaleDto: CreateDailySaleDto,
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

    // 🏆 GET: Top productos vendidos
    @Get('top-products')
    async getTopProducts(
        @Query('limit') limit: number = 10,
        @Request() req
    ): Promise<any> {
        return this.salesService.getTopProducts(req.user.id, limit);
    }

    // 🎯 GET: Buscar venta por ID
    @Get(':id')
    async findSaleById(@Param('id') id: number): Promise<DailySale> {
        return this.salesService.findSaleById(id);
    }

    // 📊 POST: Agregar producto a venta
    @Post(':saleId/products')
    async addProductToSale(
        @Param('saleId') saleId: number,
        @Body(ValidationPipe) addProductDto: AddProductDto
    ): Promise<any> {
        return this.salesService.addProductToSale(
            saleId, 
            addProductDto.productId, 
            addProductDto.quantity
        );
    }

    // 🎯 POST: Cerrar venta del día
    @Post(':saleId/close')
    async closeDailySale(@Param('saleId') saleId: number): Promise<DailySale> {
        return this.salesService.closeDailySale(saleId);
    }

    // 📈 GET: Análisis de productos
    @Get('analysis/performance')
    async getProductPerformance(): Promise<any> {
        return this.salesService.getProductPerformance();
    }
}
```

---

## 🔧 **8. DTOs - VALIDACIÓN DE DATOS**

### **🎯 DTO: CreateDailySaleDto**

#### **📍 Ruta:**
```
c:\Users\jaras\Downloads\git hub todos docuemntacion\claude code con ollama\proyecto integrsaaodr\pi_privado_backup\backend\src\modules\sales\dto\create-daily-sale.dto.ts
```

#### **🔍 Implementación Completa:**
```typescript
import { IsDate, IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateDailySaleDto {
    @IsNotEmpty()
    @IsString()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'La fecha debe estar en formato YYYY-MM-DD'
    })
    saleDate: string;                        // 📅 Fecha en formato YYYY-MM-DD
}

export class AddProductDto {
    @IsNotEmpty()
    productId: number;                       // 🛍️ ID del producto

    @IsNotEmpty()
    quantity: number;                        // 📦 Cantidad a agregar
}
```

---

## 🚀 **9. INTEGRACIÓN CON APP MODULE**

### **📍 Ruta:**
```
c:\Users\jaras\Downloads\git hub todos docuemntacion\claude code con ollama\proyecto integrsaaodr\pi_privado_backup\backend\src\app.module.ts
```

### **🔍 Configuración TypeORM en App Module:**
```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getTypeOrmConfig } from './config/database.config';
import { SalesModule } from './modules/sales/sales.module';
import { BenchmarkingModule } from './modules/benchmarking/benchmarking.module';

@Module({
    imports: [
        // ⚙️ Configuración de variables de entorno
        ConfigModule.forRoot({
            isGlobal: true
        }),
        
        // 🗄️ Configuración de TypeORM
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => getTypeOrmConfig(configService),
            inject: [ConfigService]
        }),
        
        // 📦 Módulos de negocio
        SalesModule,
        BenchmarkingModule,
        // ... otros módulos
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
```

---

## 🎓 **10. VENTAJAS DE TYPEORM EN TIENDITACAMPUS**

### **🚀 Beneficios Principales:**

#### **1. Tipado Fuerte**
```typescript
// ✅ Con TypeORM - Tipado seguro
const dailySale: DailySale = await this.salesRepository.findById(1);

// ❌ SQL puro - Sin tipado
const result = await this.connection.query('SELECT * FROM daily_sales WHERE id = 1');
```

#### **2. Relaciones Explícitas**
```typescript
// ✅ Relaciones automáticas
const sale = await this.salesRepository.findOne({
    where: { id: 1 },
    relations: ['saleDetails', 'saleDetails.product']
});

// ❌ Joins manuales en SQL
const query = `
    SELECT ds.*, sd.*, p.* 
    FROM daily_sales ds 
    LEFT JOIN sale_details sd ON ds.id = sd.daily_sale_id 
    LEFT JOIN products p ON sd.product_id = p.id 
    WHERE ds.id = 1
`;
```

#### **3. Migraciones Automáticas**
```typescript
// ✅ Control de versiones
npm run migration:run
npm run migration:revert
npm run migration:generate

// ❌ SQL manual - Propenso a errores
-- Ejecutar scripts SQL manualmente
```

#### **4. Validaciones Integradas**
```typescript
// ✅ Validaciones automáticas
@Entity()
@Check('profit_margin >= 0 AND profit_margin <= 100')
export class DailySale {
    @Column({ type: 'decimal', precision: 5, scale: 2 })
    profitMargin: number;
}

// ❌ Validaciones manuales
if (profitMargin < 0 || profitMargin > 100) {
    throw new Error('Margen inválido');
}
```

---

## 🎯 **11. MEJORES PRÁCTICAS**

### **📊 Queries Optimizadas:**
```typescript
// ✅ Usar Query Builder para queries complejas
const queryBuilder = this.repository.createQueryBuilder('entity')
    .leftJoinAndSelect('entity.relation', 'relation')
    .where('entity.field = :value', { value })
    .orderBy('entity.createdAt', 'DESC');

// ✅ Usar SQL nativo para máximo rendimiento
const result = await this.dataSource.query(`
    SELECT * FROM vw_materialized_view 
    WHERE condition = $1
`, [value]);
```

### **🔄 Transacciones Seguras:**
```typescript
// ✅ Transacciones con QueryRunner
const queryRunner = this.dataSource.createQueryRunner();
await queryRunner.startTransaction();
try {
    // Operaciones
    await queryRunner.commitTransaction();
} catch (error) {
    await queryRunner.rollbackTransaction();
} finally {
    await queryRunner.release();
}
```

### **📇 Índices Estratégicos:**
```typescript
// ✅ Índices en entidades
@Entity()
@Index(['userId', 'saleDate'])               // Para búsquedas frecuentes
@Index(['productId', 'createdAt'])           // Para análisis
export class DailySale {
    // ...
}
```

---

## 🎓 **RESUMEN PARA EXAMEN**

### **📊 Componentes TypeORM:**
1. **Configuración** - database.config.ts
2. **Entidades** - Modelos con decoradores
3. **Repositories** - Acceso a datos
4. **Módulos** - Organización de entidades
5. **Servicios** - Lógica de negocio
6. **Controllers** - Endpoints HTTP
7. **DTOs** - Validación de datos

### **🚀 Ventajas Clave:**
- **Tipado fuerte** con TypeScript
- **Relaciones automáticas** entre entidades
- **Migraciones controladas**
- **Queries complejas** simplificadas
- **Validaciones integradas**
- **Transacciones seguras**

### **🎯 Patrones Usados:**
- **Repository Pattern** para acceso a datos
- **CQS (Command Query Separation)** con Use Cases
- **Dependency Injection** para desacoplamiento
- **Decorator Pattern** para entidades

**¡TypeORM en TienditaCampus proporciona una capa de datos robusta, tipada y mantenible!** 🚀
