#!/bin/bash
# deploy-backend-ssm.sh - Deploy Backend API via AWS Systems Manager

echo "🚀 Iniciando deploy Backend API via AWS Systems Manager..."

# Instancia Backend API
INSTANCE_ID="i-0ee35704e56d22bc4"
REGION="us-east-1"

# Script de deploy para Backend
BACKEND_SCRIPT='#!/bin/bash
echo "🔥 Deploy Backend API - TienditaCampus"

# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker ubuntu

# Instalar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Clonar repositorio
cd /home/ubuntu
if [ ! -d "pi_privado_backup" ]; then
    git clone https://github.com/Jesel8D/pi_privado_backup.git
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
FRONTEND_URL=https://98.82.69.208
GOOGLE_CLIENT_ID=tu_google_client_id
GOOGLE_CLIENT_SECRET=tu_google_client_secret
BIGQUERY_PROJECT_ID=data-from-software
ENVEOF

# Levantar servicios
cd backend
docker-compose up -d --build

echo "✅ Backend API desplegado exitosamente"
echo "🌐 API disponible en: http://98.92.47.235:3001"
'

# Ejecutar deploy via AWS Systems Manager
echo "📤 Enviando comando a instancia Backend API..."
aws ssm send-command \
    --instance-ids "$INSTANCE_ID" \
    --document-name "AWS-RunShellScript" \
    --parameters commands=["$BACKEND_SCRIPT"] \
    --region "$REGION" \
    --output json

echo "✅ Deploy Backend API iniciado via AWS Systems Manager"
echo "📊 Para verificar el estado:"
echo "aws ssm get-command-invocation --command-id <command-id> --instance-id $INSTANCE_ID --region $REGION"
