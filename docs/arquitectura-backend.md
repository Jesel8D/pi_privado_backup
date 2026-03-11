# 🏗️ **ARQUITECTURA GENERAL DEL BACKEND - TIENDITACAMPUS**

## 🎯 **VISIÓN GENERAL DE LA ARQUITECTURA**

---

## 📋 **ESTRUCTURA PRINCIPAL**

```
backend/
├── src/
│   ├── app.module.ts              # 🎯 Módulo raíz
│   ├── main.ts                   # 🚀 Punto de entrada
│   ├── config/                   # ⚙️ Configuración
│   ├── common/                   # 🔧 Componentes comunes
│   └── modules/                  # 📦 Módulos de negocio
└── package.json                  # 📦 Dependencias
```

---

## 🎯 **1. APP MODULE - MÓDULO RAÍZ**

### **📍 Ruta:**
```
backend/src/app.module.ts
```

### **🔍 Configuración:**
```typescript
@Module({
  imports: [
    // ⚙️ Configuración global
    ConfigModule.forRoot({ isGlobal: true }),
    
    // 🗄️ TypeORM - Base de datos
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getTypeOrmConfig,
      inject: [ConfigService]
    }),
    
    // 📦 Módulos de negocio
    AuthModule,
    UsersModule,
    SalesModule,
    InventoryModule,
    ProductsModule,
    BenchmarkingModule,
    ReportsModule,
    DashboardModule,
    AuditModule,
    
    // 🌐 Módulos de infraestructura
    ThrottlerModule.forRoot([{
      ttl: 60000,      // 1 minuto
      limit: 100       // 100 requests por minuto
    }])
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // 🛡️ Guards globales
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }
  ]
})
export class AppModule {}
```

---

## 🚀 **2. MAIN.TS - BOOTSTRAP**

### **📍 Ruta:**
```
backend/src/main.ts
```

### **🔍 Configuración:**
```typescript
async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: false });
  
  // 🌐 Configuración CORS
  app.enableCors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
  });
  
  // 🎯 Prefijo global de API
  app.setGlobalPrefix('api');
  
  // 🛡️ Pipes globales de validación
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true
  }));
  
  // 📊 Límites de tamaño
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ limit: '10mb', extended: true }));
  
  // 🚀 Iniciar servidor
  const port = configService.get('BACKEND_PORT', 3001);
  await app.listen(port);
  
  console.log(`🚀 API running on port ${port}`);
}
```

---

## 📦 **3. MÓDULOS DE NEGOCIO**

### **🔐 AuthModule - Autenticación**
```
modules/auth/
├── auth.controller.ts         # 🌐 Login, register, OAuth
├── auth.service.ts           # 🎯 Lógica de autenticación
├── auth.module.ts            # 📦 Configuración del módulo
├── guards/                   # 🛡️ Guards de seguridad
│   ├── jwt-auth.guard.ts
│   └── roles.guard.ts
├── strategies/               # 🔐 Estrategias Passport
│   ├── jwt.strategy.ts
│   └── google.strategy.ts
└── dto/                      # 📝 DTOs de validación
    ├── login.dto.ts
    └── register.dto.ts
```

### **💰 SalesModule - Ventas**
```
modules/sales/
├── sales.controller.ts       # 🌐 Endpoints de ventas
├── sales.service.ts          # 🎯 Lógica de negocio
├── sales.module.ts           # 📦 Configuración
├── entities/                 # 🗄️ Entidades TypeORM
│   ├── daily-sale.entity.ts
│   └── sale-detail.entity.ts
├── repositories/             # 💾 Acceso a datos
│   └── sales.repository.ts
├── use-cases/                # 🎲 Casos de uso (CQS)
│   ├── create-daily-sale.use-case.ts
│   ├── close-day.use-case.ts
│   └── track-sale.use-case.ts
└── dto/                      # 📝 DTOs
    ├── create-daily-sale.dto.ts
    └── add-product.dto.ts
```

### **📊 BenchmarkingModule - Rendimiento**
```
modules/benchmarking/
├── benchmarking.controller.ts    # 🌐 Endpoints de métricas
├── benchmarking.service.ts       # 🎯 Lógica principal
├── benchmarking.module.ts        # 📦 Configuración
├── auth/                         # 🔐 OAuth Google Cloud
│   └── oauth-bigquery.service.ts
├── scheduler/                    # ⏰ Snapshots automáticos
│   └── snapshot.scheduler.ts
├── snapshots/                    # 📸 Gestión de snapshots
│   └── snapshot.service.ts
└── exports/                      # 📤 Exportación a BigQuery
    └── bigquery-export.service.ts
```

---

## 🔧 **4. COMMON - COMPONENTES REUTILIZABLES**

### **📁 Estructura:**
```
common/
├── controllers/              # 🌐 Controllers base
│   ├── app.controller.ts
│   └── health.controller.ts
├── decorators/               # 🎨 Decoradores personalizados
│   ├── roles.decorator.ts
│   └── user.decorator.ts
├── filters/                  # 🔍 Filtros de excepciones
│   ├── http-exception.filter.ts
│   └── query-failed.filter.ts
├── guards/                   # 🛡️ Guards globales
│   ├── jwt-auth.guard.ts
│   └── throttler.guard.ts
├── interceptors/             # 🔄 Interceptors
│   ├── logging.interceptor.ts
│   └── transform.interceptor.ts
├── pipes/                    # 🔧 Pipes personalizados
│   └── parse-uuid.pipe.ts
└── utils/                    # 🛠️ Utilidades
    ├── hash.util.ts
    └── validation.util.ts
```

---

## ⚙️ **5. CONFIG - CONFIGURACIÓN GLOBAL**

### **📁 Estructura:**
```
config/
├── database.config.ts         # 🗄️ Configuración TypeORM
├── app.config.ts              # 🚀 Configuración de la app
├── auth.config.ts             # 🔐 Configuración JWT
└── benchmarking.config.ts     # 📊 Configuración BigQuery
```

### **🔍 Database Config:**
```typescript
export const getTypeOrmConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get('POSTGRES_HOST'),
  port: configService.get('POSTGRES_PORT'),
  username: configService.get('POSTGRES_USER'),
  password: configService.get('POSTGRES_PASSWORD'),
  database: configService.get('POSTGRES_DB'),
  
  // 📁 Entidades
  entities: [join(__dirname, '..', 'modules', '**', '*.entity.{ts,js}')],
  
  // 🔄 Migraciones
  migrations: [join(__dirname, '..', 'database', 'migrations', '*.{ts,js}')],
  migrationsRun: true,
  
  // 🚀 Pool de conexiones
  extra: {
    max: 20,
    min: 5,
    idle: 10000,
    acquire: 60000
  }
});
```

---

## 🔄 **6. PATRONES ARQUITECTÓNICOS**

### **🎯 Repository Pattern:**
```typescript
// 📦 Interfaz
export interface ISalesRepository {
  create(data: Partial<DailySale>): Promise<DailySale>;
  findById(id: number): Promise<DailySale | null>;
  getMetrics(userId: number): Promise<any>;
}

// 💾 Implementación
@Injectable()
export class SalesRepository implements ISalesRepository {
  constructor(@InjectRepository(DailySale) private repo: Repository<DailySale>) {}
  
  async create(data: Partial<DailySale>): Promise<DailySale> {
    return this.repo.save(data);
  }
}
```

### **🎲 CQS (Command Query Separation):**
```typescript
// 🎯 Comando (modifica estado)
@Injectable()
export class CreateDailySaleUseCase {
  constructor(@Inject('ISalesRepository') private repository: ISalesRepository) {}
  
  async execute(userId: number, date: Date): Promise<DailySale> {
    return this.repository.create({ userId, saleDate: date });
  }
}

// 📊 Query (consulta estado)
@Injectable()
export class GetSalesMetricsUseCase {
  constructor(@Inject('ISalesRepository') private repository: ISalesRepository) {}
  
  async execute(userId: number): Promise<any> {
    return this.repository.getMetrics(userId);
  }
}
```

### **🔧 Dependency Injection:**
```typescript
// 📦 Módulo con inyección
@Module({
  providers: [
    SalesService,
    {
      provide: 'ISalesRepository',
      useClass: SalesRepository
    },
    CreateDailySaleUseCase
  ]
})
export class SalesModule {}
```

---

## 🛡️ **7. SEGURIDAD**

### **🔐 JWT Authentication:**
```typescript
// 🎯 Strategy
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET')
    });
  }
  
  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email };
  }
}

// 🛡️ Guard
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
```

### **🔒 Role-Based Access Control:**
```typescript
// 🎨 Decorator de roles
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);

// 🛡️ Guard de roles
@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    const user = context.switchToHttp().getRequest().user;
    return requiredRoles.includes(user.role);
  }
}
```

---

## 📊 **8. FLUJO DE DATOS**

### **🔄 Request Lifecycle:**
```
Client Request
    ↓
Middleware (CORS, Body Parser)
    ↓
Guard (JWT Authentication)
    ↓
Controller (Validation)
    ↓
Service (Business Logic)
    ↓
Repository (Data Access)
    ↓
Database (PostgreSQL)
    ↓
Response (JSON)
```

### **🎯 Example Flow - Create Sale:**
```
POST /api/sales/daily
    ↓
JwtAuthGuard (verifica token)
    ↓
ValidationPipe (valida DTO)
    ↓
SalesController.createDailySale()
    ↓
SalesService.createDailySale()
    ↓
CreateDailySaleUseCase.execute()
    ↓
SalesRepository.create()
    ↓
TypeORM Repository.save()
    ↓
PostgreSQL INSERT
    ↓
Response: DailySale entity
```

---

## 🎓 **9. MEJORES PRÁCTICAS**

### **📦 Modularización:**
- **Un módulo por dominio** (sales, inventory, products)
- **Dependencias claras** entre módulos
- **Export controlado** de servicios

### **🔧 TypeORM Best Practices:**
- **Repositories** para acceso a datos
- **Entities con decoradores** y relaciones
- **Migrations** para control de versiones
- **Query Builder** para queries complejas

### **🛡️ Seguridad:**
- **JWT** para autenticación
- **Role-based access control**
- **Input validation** con DTOs
- **Rate limiting** con Throttler

### **📊 Performance:**
- **Connection pooling** (20 conexiones)
- **Lazy loading** de relaciones
- **Materialized views** para consultas complejas
- **Caching** con Redis (opcional)

---

## 🎯 **10. RESUMEN ARQUITECTÓNICO**

### **🏗️ Capas:**
1. **Presentation Layer** - Controllers, DTOs, Guards
2. **Application Layer** - Services, Use Cases
3. **Domain Layer** - Entities, Repositories
4. **Infrastructure Layer** - Database, External APIs

### **📦 Componentes Clave:**
- **App Module** - Configuración global
- **Business Modules** - Lógica de dominio
- **Common Components** - Utilidades reutilizables
- **Configuration** - Variables de entorno

### **🔄 Patrones:**
- **Repository Pattern** - Acceso a datos
- **CQS** - Separación de comandos y queries
- **Dependency Injection** - Desacoplamiento
- **Guard Pattern** - Seguridad

**¡Esta arquitectura enterprise garantiza escalabilidad, mantenibilidad y seguridad!** 🚀
