#!/bin/bash
# redeploy-fixed.sh - Redeploy con correcciones

echo "🔧 REDEPLOY CON CORRECCIONES - TienditaCampus"
echo "============================================="

# IDs de instancias
BACKEND_INSTANCE="i-0ee35704e56d22bc4"
FRONTEND_INSTANCE="i-09e028682794543e3"
DATABASE_INSTANCE="i-0092c19af358a5245"
REGION="us-east-1"

echo "📊 Paso 1: Verificar estado actual de instancias..."
aws ec2 describe-instances \
    --instance-ids "$BACKEND_INSTANCE" "$FRONTEND_INSTANCE" "$DATABASE_INSTANCE" \
    --region "$REGION" \
    --query 'Reservations[*].Instances[*].[InstanceId,State.Name,PublicIpAddress]' \
    --output table

echo ""
echo "🔧 Paso 2: Redeploy Backend con correcciones..."

# Script de Backend mejorado
BACKEND_SCRIPT='#!/bin/bash
echo "🔥 Redeploy Backend API - Versión Corregida"

# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar dependencias necesarias
sudo apt install -y curl wget git

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

# Detener contenedores anteriores
cd backend
sudo docker-compose down 2>/dev/null || true

# Levantar servicios
sudo docker-compose up -d --build

# Esperar a que el backend esté listo
echo "⏳ Esperando a que el backend esté listo..."
sleep 30

# Verificar que el backend esté corriendo
if sudo docker-compose ps | grep -q "Up"; then
    echo "✅ Backend API desplegado exitosamente"
    echo "🌐 API disponible en: http://98.92.47.235:3001"
else
    echo "❌ Error: Backend API no está corriendo"
    sudo docker-compose logs
fi
'

# Ejecutar deploy de Backend
echo "📤 Desplegando Backend corregido..."
aws ssm send-command \
    --instance-ids "$BACKEND_INSTANCE" \
    --document-name "AWS-RunShellScript" \
    --parameters 'commands=["'"$BACKEND_SCRIPT"'"]' \
    --region "$REGION" \
    --output json

echo ""
echo "🌐 Paso 3: Redeploy Frontend con correcciones..."

# Script de Frontend mejorado
FRONTEND_SCRIPT='#!/bin/bash
echo "🌐 Redeploy Frontend + Nginx - Versión Corregida"

# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar dependencias
sudo apt install -y nginx curl wget git

# Instalar Node.js
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

# Crear configuración de Nginx mejorada
sudo tee /etc/nginx/sites-available/tienditacampus << NGINXEOF
server {
    listen 80 default_server;
    server_name _;
    
    root /var/www/html;
    index index.html index.htm;
    
    # Manejar todas las rutas del frontend
    location / {
        try_files \$uri \$uri/ /index.html;
        add_header Access-Control-Allow-Origin *;
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS";
        add_header Access-Control-Allow-Headers "DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization";
    }
    
    # Proxy para API
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
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }
    
    # Health check
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

# Probar configuración
sudo nginx -t

# Reiniciar Nginx
sudo systemctl restart nginx
sudo systemctl enable nginx

# Verificar que Nginx esté corriendo
sudo systemctl status nginx

echo "✅ Frontend desplegado exitosamente"
echo "🌐 Frontend disponible en: http://98.82.69.208"
'

# Ejecutar deploy de Frontend
echo "📤 Desplegando Frontend corregido..."
aws ssm send-command \
    --instance-ids "$FRONTEND_INSTANCE" \
    --document-name "AWS-RunShellScript" \
    --parameters 'commands=["'"$FRONTEND_SCRIPT"'"]' \
    --region "$REGION" \
    --output json

echo ""
echo "⏳ Esperando 30 segundos para que los servicios se estabilicen..."
sleep 30

echo ""
echo "📊 Paso 4: Verificación final de conectividad..."

echo "🌐 Verificando Frontend (98.82.69.208):"
timeout 10 bash -c "</dev/tcp/98.82.69.208/80" && echo "✅ Frontend accesible" || echo "❌ Frontend no accesible"

echo "📦 Verificando Backend (98.92.47.235:3001):"
timeout 10 bash -c "</dev/tcp/98.92.47.235/3001" && echo "✅ Backend accesible" || echo "❌ Backend no accesible"

echo ""
echo "🎉 Redeploy completado!"
echo "🌐 URLs de acceso:"
echo "   Frontend: http://98.82.69.208"
echo "   Backend API: http://98.92.47.235:3001"
echo "   Health Check: http://98.82.69.208/health"
