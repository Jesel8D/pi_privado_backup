# Deployment Guide - TienditaCampus

## 🚀 Overview

Guía completa de despliegue para producción del sistema TienditaCampus Backend.

## 🏗️ Arquitectura de Despliegue

### Entornos Soportados
- **Development**: Local con Docker Compose
- **Staging**: Pre-producción con datos de prueba
- **Production**: Ambiente final con datos reales

### Infraestructura Requerida

```mermaid
graph TB
    subgraph "Load Balancer"
        LB[Nginx Load Balancer]
    end
    
    subgraph "Application Servers"
        API1[Backend Instance 1]
        API2[Backend Instance 2]
        API3[Backend Instance 3]
    end
    
    subgraph "Database Layer"
        PG_MASTER[(PostgreSQL Master)]
        PG_SLAVE1[(PostgreSQL Slave 1)]
        PG_SLAVE2[(PostgreSQL Slave 2)]
    end
    
    subgraph "Cache Layer"
        REDIS[(Redis Cluster)]
    end
    
    subgraph "Storage"
        MONGO[(MongoDB Replica Set)]
        FILES[File Storage]
    end
    
    LB --> API1
    LB --> API2
    LB --> API3
    
    API1 --> PG_MASTER
    API2 --> PG_MASTER
    API3 --> PG_MASTER
    
    PG_MASTER --> PG_SLAVE1
    PG_MASTER --> PG_SLAVE2
    
    API1 --> REDIS
    API2 --> REDIS
    API3 --> REDIS
    
    API1 --> MONGO
    API2 --> MONGO
    API3 --> MONGO
```

## 🐳 Docker Production

### docker-compose.prod.yml
```yaml
version: '3.8'

services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./devops/nginx/nginx.prod.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - backend
    restart: unless-stopped
    networks:
      - tiendita-network

  backend:
    image: tienditacampus/backend:${VERSION}
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://tiendita:${DB_PASSWORD}@postgres:5432/tiendita_prod
      - MONGODB_URI=mongodb://mongo:27017/audit_prod
      - REDIS_URL=redis://redis:6379
      - JWT_SECRET=${JWT_SECRET}
      - GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}
      - GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET}
      - GCP_PROJECT_ID=${GCP_PROJECT_ID}
      - BIGQUERY_DATASET=${BIGQUERY_DATASET}
    deploy:
      replicas: 3
      resources:
        limits:
          cpus: '1.0'
          memory: 1G
        reservations:
          cpus: '0.5'
          memory: 512M
    restart: unless-stopped
    networks:
      - tiendita-network
    healthcheck:
      test: ["CMD-SHELL", "wget --spider -q http://localhost:3001/api/health || exit 1"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 60s

  postgres:
    image: postgres:16-alpine
    environment:
      - POSTGRES_DB=tiendita_prod
      - POSTGRES_USER=tiendita
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./database/postgresql.conf:/etc/postgresql/postgresql.conf
    command: postgres -c config_file=/etc/postgresql/postgresql.conf
    restart: unless-stopped
    networks:
      - tiendita-network

  postgres-replica:
    image: postgres:16-alpine
    environment:
      - POSTGRES_DB=tiendita_prod
      - POSTGRES_USER=tiendita
      - POSTGRES_PASSWORD=${DB_PASSWORD}
      - PGUSER=replicator
      - POSTGRES_MASTER_SERVICE=postgres
    volumes:
      - postgres_replica_data:/var/lib/postgresql/data
    command: |
      bash -c "
      until pg_isready -h postgres -p 5432 -U tiendita; do sleep 1; done
      pg_basebackup -h postgres -D /var/lib/postgresql/data -U replicator -d tiendita_prod -v -Fp -R -x -l
      pg_ctl -D /var/lib/postgresql/data start
      "
    depends_on:
      - postgres
    restart: unless-stopped
    networks:
      - tiendita-network

  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes --replica-announce-ip redis --replica-announce-port 6379
    volumes:
      - redis_data:/data
    restart: unless-stopped
    networks:
      - tiendita-network

  mongodb:
    image: mongo:7
    environment:
      - MONGO_INITDB_ROOT_USERNAME=admin
      - MONGO_INITDB_ROOT_PASSWORD=${MONGO_PASSWORD}
      - MONGO_INITDB_DATABASE=audit_prod
    volumes:
      - mongodb_data:/data/db
      - ./database/mongo-init.js:/docker-entrypoint-initdb.d/mongo-init.js:ro
    restart: unless-stopped
    networks:
      - tiendita-network

volumes:
  postgres_data:
  postgres_replica_data:
  redis_data:
  mongodb_data:

networks:
  tiendita-network:
    driver: bridge
```

## ⚙️ Configuración de Producción

### Environment Variables
```bash
# .env.production
NODE_ENV=production
VERSION=latest

# Database
DB_PASSWORD=your_secure_password_here
POSTGRES_REPLICATION_PASSWORD=replication_password

# Application
JWT_SECRET=your_jwt_secret_minimum_32_characters
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Google Cloud
GCP_PROJECT_ID=tiendita-production
BIGQUERY_DATASET=analytics
GOOGLE_SERVICE_ACCOUNT_KEY_FILE=/app/config/service-account.json

# Redis
REDIS_PASSWORD=redis_password

# MongoDB
MONGO_PASSWORD=mongo_secure_password

# Monitoring
SENTRY_DSN=https://your-sentry-dsn
LOG_LEVEL=info
```

### PostgreSQL Production Config
```bash
# database/postgresql.conf
listen_addresses = '*'
port = 5432
max_connections = 200
shared_buffers = 256MB
effective_cache_size = 1GB
maintenance_work_mem = 64MB
checkpoint_completion_target = 0.9
wal_buffers = 16MB
default_statistics_target = 100

# Replication
wal_level = replica
archive_mode = on
archive_command = 'cp %p /var/lib/postgresql/archive/%f'
archive_timeout = 300
max_wal_senders = 3
wal_keep_segments = 32
hot_standby = on

# Performance
random_page_cost = 1.1
effective_io_concurrency = 200
work_mem = 4MB
min_wal_size = 1GB
max_wal_size = 4GB

# Logging
log_destination = 'stderr'
logging_collector = 'stderr'
log_directory = 'pg_log'
log_filename = 'postgresql-%Y-%m-%d_%H%M%S.log'
log_rotation_age = 1d
log_rotation_size = 100MB
log_min_duration_statement = 1000
log_checkpoints = on
log_connections = on
log_disconnections = on
log_lock_waits = on
```

### Nginx Production Config
```nginx
# devops/nginx/nginx.prod.conf
upstream backend {
    least_conn;
    server backend_1:3001 max_fails=3 fail_timeout=30s;
    server backend_2:3001 max_fails=3 fail_timeout=30s;
    server backend_3:3001 max_fails=3 fail_timeout=30s;
}

server {
    listen 80;
    listen 443 ssl http2;
    server_name api.tienditacampus.com;

    ssl_certificate /etc/nginx/ssl/tienditacampus.com.crt;
    ssl_certificate_key /etc/nginx/ssl/tienditacampus.com.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-SHA384;
    ssl_prefer_server_ciphers off;

    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=10m rate=10r/s;
    limit_req_status 429;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/atom+xml
        image/svg+xml;

    location /api/ {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 30s;
        proxy_send_timeout 30s;
        proxy_read_timeout 30s;
    }

    location /health {
        proxy_pass http://backend/api/health;
        access_log off;
    }
}
```

## 🚀 CI/CD Pipeline

### GitHub Actions Workflow
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]
    tags: ['v*']

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm run test:coverage
        
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2
        
      - name: Login to Docker Hub
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}
          
      - name: Build and push
        uses: docker/build-push-action@v4
        with:
          context: .
          file: ./docker-compose.prod.yml
          push: true
          tags: tienditacampus/backend:${{ github.sha }}

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to production
        uses: appleboy/ssh-action@v0.1.5
        with:
          host: ${{ secrets.PROD_HOST }}
          username: ${{ secrets.PROD_USER }}
          key: ${{ secrets.PROD_SSH_KEY }}
          script: |
            cd /opt/tienditacampus
            docker-compose -f docker-compose.prod.yml pull
            docker-compose -f docker-compose.prod.yml up -d
            docker system prune -f
```

## 📊 Monitoreo y Logging

### Health Checks
```bash
#!/bin/bash
# scripts/health-check.sh

# Verificar servicios
services=("nginx" "backend" "postgres" "redis" "mongodb")

for service in "${services[@]}"; do
    if docker-compose ps $service | grep -q "Up"; then
        echo "✅ $service is running"
    else
        echo "❌ $service is down"
        # Enviar alerta
        curl -X POST "https://hooks.slack.com/your-webhook" \
             -H 'Content-type: application/json' \
             --data "{\"text\":\"🚨 $service is down on production\"}"
    fi
done

# Verificar endpoints críticos
endpoints=(
    "http://localhost/api/health"
    "https://api.tienditacampus.com/api/health"
)

for endpoint in "${endpoints[@]}"; do
    response=$(curl -s -o /dev/null -w "%{http_code}" $endpoint)
    if [ "$response" = "200" ]; then
        echo "✅ $endpoint is healthy"
    else
        echo "❌ $endpoint returned $response"
    fi
done
```

### Logging Centralizado
```yaml
# docker-compose.logging.yml
version: '3.8'

x-logging: &default-logging
  driver: "json-file"
  options:
    max-size: "10m"
    max-file: "3"

services:
  backend:
    <<: *default-logging
    logging:
      <<: *default-logging
      options:
        max-size: "10m"
        max-file: "3"
        labels: "service=backend,environment=production"
        
  postgres:
    <<: *default-logging
    logging:
      <<: *default-logging
      options:
        max-size: "10m"
        max-file: "3"
        labels: "service=postgres,environment=production"
```

## 🔐 Seguridad en Producción

### SSL/TLS Configuration
```bash
# Generar certificados Let's Encrypt
certbot certonly --standalone \
    -d api.tienditacampus.com \
    -d www.api.tienditacampus.com \
    --email admin@tienditacampus.com \
    --agree-tos \
    --non-interactive

# Auto-renewal cron
0 2 * * * /usr/bin/certbot renew --quiet --deploy-hook "docker-compose restart nginx"
```

### Firewall Rules
```bash
# UFW Configuration
ufw allow ssh
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow from 10.0.0.0/8 to any port 5432
ufw allow from 10.0.0.0/8 to any port 6379
ufw allow from 10.0.0.0/8 to any port 27017
ufw enable
```

### Security Headers
```nginx
# Headers adicionales en nginx
add_header X-Frame-Options DENY;
add_header X-Content-Type-Options nosniff;
add_header X-XSS-Protection "1; mode=block";
add_header Referrer-Policy "strict-origin-when-cross-origin";
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'";
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload";
```

## 🔄 Backup y Recovery

### Automated Backups
```bash
#!/bin/bash
# scripts/backup.sh

BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)

# PostgreSQL backup
docker exec postgres pg_dump -U tiendita -d tiendita_prod | gzip > $BACKUP_DIR/postgres_$DATE.sql.gz

# MongoDB backup
docker exec mongodb mongodump --authenticationDatabase admin -u root -p $MONGO_PASSWORD --db audit_prod --gzip > $BACKUP_DIR/mongodb_$DATE.gz

# Upload to cloud storage
aws s3 cp $BACKUP_DIR/postgres_$DATE.sql.gz s3://tiendita-backups/postgres/
aws s3 cp $BACKUP_DIR/mongodb_$DATE.gz s3://tiendita-backups/mongodb/

# Cleanup old backups (keep 30 days)
find $BACKUP_DIR -name "*.gz" -mtime +30 -delete

echo "Backup completed: $DATE"
```

### Disaster Recovery
```bash
#!/bin/bash
# scripts/disaster-recovery.sh

BACKUP_DIR="/backups"
LATEST_BACKUP=$(ls -t $BACKUP_DIR/*.sql.gz | head -n1)

# Restore PostgreSQL
gunzip -c $LATEST_BACKUP | docker exec -i postgres psql -U tiendita -d tiendita_prod

# Restart services
docker-compose restart postgres
docker-compose restart backend

echo "Disaster recovery completed from $LATEST_BACKUP"
```

## 📈 Performance Optimization

### Database Optimization
```sql
-- Índices recomendados
CREATE INDEX CONCURRENTLY idx_daily_sales_seller_date ON daily_sales(seller_id, sale_date DESC);
CREATE INDEX CONCURRENTLY idx_sale_details_product_date ON sale_details(product_id, created_at DESC);
CREATE INDEX CONCURRENTLY idx_audit_logs_user_date ON audit_logs(user_id, created_at DESC);

-- Particionamiento para tablas grandes
CREATE TABLE daily_sales_partitioned (
    LIKE daily_sales INCLUDING ALL
) PARTITION BY RANGE (sale_date);

-- Crear particiones mensuales
CREATE TABLE daily_sales_2024_01 PARTITION OF daily_sales_partitioned
FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');
```

### Application Optimization
```typescript
// Configuración de producción
const productionConfig = {
  // Connection pooling
  database: {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [/* entities */],
    synchronize: false,
    logging: false,
    ssl: true,
    extra: {
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    }
  },
  
  // Redis configuration
  redis: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSWORD,
    keyPrefix: 'tiendita:',
    retryDelayOnFailover: 100,
    maxRetriesPerRequest: 3,
  }
};
```

## 🧪 Testing en Producción

### Smoke Tests
```bash
#!/bin/bash
# scripts/smoke-tests.sh

BASE_URL="https://api.tienditacampus.com"

# Test health endpoint
echo "Testing health endpoint..."
curl -f $BASE_URL/api/health || exit 1

# Test authentication
echo "Testing authentication..."
TOKEN=$(curl -s -X POST $BASE_URL/api/auth/google \
  -H "Content-Type: application/json" \
  -d '{"token":"test-token"}' | jq -r '.accessToken')

curl -f $BASE_URL/api/sales/history \
  -H "Authorization: Bearer $TOKEN" || exit 1

echo "✅ All smoke tests passed"
```

### Load Testing
```bash
# Usar Apache Bench para pruebas de carga
ab -n 1000 -c 10 https://api.tienditacampus.com/api/health

# O usar k6 para escenarios complejos
k6 run --vus 50 --duration 30s scripts/load-test.js
```

Esta guía asegura un despliegue robusto, seguro y monitoreado del sistema TienditaCampus en producción.
