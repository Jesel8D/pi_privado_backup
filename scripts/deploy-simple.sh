#!/bin/bash
# deploy-simple.sh - Deploy directo a cada instancia con IP elástica

echo "🚀 DEPLOY DIRECTO A INSTANCIAS CON IP ELÁSTICA"
echo "=============================================="

# IPs elásticas de las instancias
BACKEND_IP="98.92.47.235"
FRONTEND_IP="98.82.69.208"
DATABASE_IP="54.157.136.124"

# Clave PEM (usaremos la que ya tienes)
PEM_KEY="nueva-pem"

echo "📦 Paso 1: Deploy Backend API ($BACKEND_IP)"

# Script para Backend
BACKEND_SCRIPT='#!/bin/bash
echo "🔥 Deploy Backend API"

# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker ubuntu

# Instalar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Iniciar Docker
sudo systemctl start docker
sudo systemctl enable docker

# Clonar repositorio
cd /home/ubuntu
if [ ! -d "pi_privado_backup" ]; then
    git clone https://github.com/Jesel8D/pi_privado_backup.git
else
    cd pi_privado_backup
    git pull origin main
    cd ..
fi

cd pi_privado_backup

# Configurar variables de entorno
cat > .env << ENVEOF
NODE_ENV=production
BACKEND_PORT=3001
POSTGRES_HOST=172.31.74.10
POSTGRES_PORT=5432
POSTGRES_USER=tienditacampus_user
POSTGRES_DB=tienditacampus
JWT_SECRET=supersecret_jwt_key_$(date +%s)
FRONTEND_URL=http://98.82.69.208
GOOGLE_CLIENT_ID=tu_google_client_id
GOOGLE_CLIENT_SECRET=tu_google_client_secret
BIGQUERY_PROJECT_ID=data-from-software
ENVEOF

# Levantar servicios
cd backend
sudo docker-compose down 2>/dev/null || true
sudo docker-compose up -d --build

echo "✅ Backend API desplegado en puerto 3001"
echo "🌐 URL: http://98.92.47.235:3001"
'

echo "📤 Enviando script a Backend..."
ssh -i $PEM_KEY ubuntu@$BACKEND_IP "$BACKEND_SCRIPT"

echo ""
echo "⏳ Esperando 30 segundos..."
sleep 30

echo "🗄️ Paso 2: Deploy Base de Datos ($DATABASE_IP)"

# Script para Database
DATABASE_SCRIPT='#!/bin/bash
echo "🗄️ Deploy Base de Datos"

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

# Instalar Redis
sudo apt install -y redis-server
sudo systemctl enable redis-server
sudo systemctl start redis-server

echo "✅ Base de datos desplegada"
echo "🗄️ PostgreSQL: 172.31.74.10:5432"
echo "🔴 Redis: 172.31.74.10:6379"
'

echo "📤 Enviando script a Database..."
ssh -i $PEM_KEY ubuntu@$DATABASE_IP "$DATABASE_SCRIPT"

echo ""
echo "⏳ Esperando 30 segundos..."
sleep 30

echo "🌐 Paso 3: Deploy Frontend + Nginx ($FRONTEND_IP)"

# Script para Frontend
FRONTEND_SCRIPT='#!/bin/bash
echo "🌐 Deploy Frontend + Nginx"

# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Nginx y Node.js
sudo apt install -y nginx curl wget git
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clonar repositorio
cd /home/ubuntu
if [ ! -d "pi_privado_backup" ]; then
    git clone https://github.com/Jesel8D/pi_privado_backup.git
else
    cd pi_privado_backup
    git pull origin main
    cd ..
fi

cd pi_privado_backup

# Build y deploy frontend
cd frontend
npm install
npm run build

# Configurar Nginx
sudo rm -rf /var/www/html/*
sudo cp -r dist/* /var/www/html/

# Crear configuración de Nginx
sudo tee /etc/nginx/sites-available/tienditacampus << NGINXEOF
server {
    listen 80 default_server;
    server_name _;
    
    root /var/www/html;
    index index.html index.htm;
    
    location / {
        try_files \$uri \$uri/ /index.html;
        add_header Access-Control-Allow-Origin *;
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS";
        add_header Access-Control-Allow-Headers "DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization";
    }
    
    location /api {
        proxy_pass http://98.92.47.235:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
    
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
NGINXEOF

# Habilitar sitio
sudo ln -sf /etc/nginx/sites-available/tienditacampus /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Probar y reiniciar Nginx
sudo nginx -t
sudo systemctl restart nginx
sudo systemctl enable nginx

echo "✅ Frontend desplegado"
echo "🌐 URL: http://98.82.69.208"
'

echo "📤 Enviando script a Frontend..."
ssh -i $PEM_KEY ubuntu@$FRONTEND_IP "$FRONTEND_SCRIPT"

echo ""
echo "⏳ Esperando 30 segundos para que todo esté listo..."
sleep 30

echo ""
echo "🎉 DEPLOY COMPLETADO!"
echo "================================"
echo "🌐 TienditaCampus está disponible en:"
echo "   Frontend: http://98.82.69.208"
echo "   Backend API: http://98.92.47.235:3001"
echo "   Health Check: http://98.82.69.208/health"
echo "================================"

echo ""
echo "📊 Verificación de estado:"
echo "🔍 Verificando Frontend..."
timeout 10 bash -c "</dev/tcp/98.82.69.208/80" && echo "✅ Frontend accesible" || echo "❌ Frontend no accesible"

echo "🔍 Verificando Backend..."
timeout 10 bash -c "</dev/tcp/98.92.47.235/3001" && echo "✅ Backend accesible" || echo "❌ Backend no accesible"

echo ""
echo "📊 Logs de verificación:"
echo "   Para verificar Frontend: curl http://98.82.69.208"
echo "   Para verificar Backend: curl http://98.92.47.235:3001"
echo "   Para verificar Health: curl http://98.82.69.208/health"
