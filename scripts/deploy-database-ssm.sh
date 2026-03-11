#!/bin/bash
# deploy-database-ssm.sh - Deploy Base de Datos via AWS Systems Manager

echo "🗄️ Iniciando deploy Base de Datos via AWS Systems Manager..."

# Instancia Base de Datos
INSTANCE_ID="i-0092c19af358a5245"
REGION="us-east-1"

# Script de deploy para Base de Datos
DATABASE_SCRIPT='#!/bin/bash
echo "🗄️ Deploy Base de Datos - TienditaCampus"

# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Configurar PostgreSQL
sudo -u postgres psql << PSQL
    CREATE USER tienditacampus_user WITH PASSWORD "secure_password_123";
    CREATE DATABASE tienditacampus OWNER tienditacampus_user;
    GRANT ALL PRIVILEGES ON DATABASE tienditacampus TO tienditacampus_user;
    \q
PSQL

# Configurar acceso remoto
sudo sed -i "s/#listen_addresses = '\''localhost'\''/listen_addresses = '\''*'\''/" /etc/postgresql/14/main/postgresql.conf
sudo echo "host all all 172.31.0.0/16 md5" | sudo tee -a /etc/postgresql/14/main/pg_hba.conf

# Reiniciar PostgreSQL
sudo systemctl restart postgresql
sudo systemctl enable postgresql

# Instalar Redis para caché
sudo apt install -y redis-server
sudo systemctl enable redis-server
sudo systemctl start redis-server

# Clonar repositorio
cd /home/ubuntu
if [ ! -d "pi_privado_backup" ]; then
    git clone https://github.com/Jesel8D/pi_privado_backup.git
fi

cd pi_privado_backup

# Ejecutar migraciones de base de datos
cd database
# Aquí irían las migraciones de TypeORM
# Por ahora, creamos la estructura básica
sudo -u postgres psql -d tienditacampus << MIGRATIONS
    -- Crear tablas básicas
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        first_name VARCHAR(100),
        last_name VARCHAR(100),
        role VARCHAR(50) DEFAULT '\''buyer'\'',
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        seller_id INTEGER REFERENCES users(id),
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    
    -- Insertar datos de prueba
    INSERT INTO users (email, password_hash, first_name, last_name, role) 
    VALUES 
    ('\''admin@tienditacampus.com'\'', '\''$2b$12$hashedpassword'\'', '\''Admin'\'', '\''User'\'', '\''admin'\''),
    ('\''seller@tienditacampus.com'\'', '\''$2b$12$hashedpassword'\'', '\''Seller'\'', '\''User'\'', '\''seller'\'')
    ON CONFLICT (email) DO NOTHING;
    
MIGRATIONS

echo "✅ Base de datos desplegada exitosamente"
echo "🗄️ PostgreSQL disponible en: 172.31.74.10:5432"
echo "🔴 Redis disponible en: 172.31.74.10:6379"
echo "📊 Base de datos: tienditacampus"
echo "👤 Usuario: tienditacampus_user"
'

# Ejecutar deploy via AWS Systems Manager
echo "📤 Enviando comando a instancia Base de Datos..."
aws ssm send-command \
    --instance-ids "$INSTANCE_ID" \
    --document-name "AWS-RunShellScript" \
    --parameters commands=["$DATABASE_SCRIPT"] \
    --region "$REGION" \
    --output json

echo "✅ Deploy Base de Datos iniciado via AWS Systems Manager"
echo "📊 Para verificar el estado:"
echo "aws ssm get-command-invocation --command-id <command-id> --instance-id $INSTANCE_ID --region $REGION"
