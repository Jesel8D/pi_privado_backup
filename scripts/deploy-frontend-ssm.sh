#!/bin/bash
# deploy-frontend-ssm.sh - Deploy Frontend + Nginx via AWS Systems Manager

echo "🌐 Iniciando deploy Frontend + Nginx via AWS Systems Manager..."

# Instancia Frontend + Nginx
INSTANCE_ID="i-09e028682794543e3"
REGION="us-east-1"

# Script de deploy para Frontend
FRONTEND_SCRIPT='#!/bin/bash
echo "🌐 Deploy Frontend + Nginx - TienditaCampus"

# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Nginx y herramientas
sudo apt install -y nginx curl wget git

# Clonar repositorio
cd /home/ubuntu
if [ ! -d "pi_privado_backup" ]; then
    git clone https://github.com/Jesel8D/pi_privado_backup.git
fi

cd pi_privado_backup

# Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Build y deploy frontend
cd frontend
npm install
npm run build

# Configurar Nginx
sudo cp -r dist/* /var/www/html/

# Crear configuración de Nginx
sudo tee /etc/nginx/sites-available/tienditacampus << NGINXEOF
server {
    listen 80;
    server_name 98.82.69.208;
    
    root /var/www/html;
    index index.html index.htm;
    
    location / {
        try_files \$uri \$uri/ /index.html;
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
}
NGINXEOF

# Habilitar sitio
sudo ln -s /etc/nginx/sites-available/tienditacampus /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Probar y reiniciar Nginx
sudo nginx -t
sudo systemctl restart nginx
sudo systemctl enable nginx

echo "✅ Frontend desplegado exitosamente"
echo "🌐 Frontend disponible en: http://98.82.69.208"
'

# Ejecutar deploy via AWS Systems Manager
echo "📤 Enviando comando a instancia Frontend..."
aws ssm send-command \
    --instance-ids "$INSTANCE_ID" \
    --document-name "AWS-RunShellScript" \
    --parameters commands=["$FRONTEND_SCRIPT"] \
    --region "$REGION" \
    --output json

echo "✅ Deploy Frontend iniciado via AWS Systems Manager"
echo "📊 Para verificar el estado:"
echo "aws ssm get-command-invocation --command-id <command-id> --instance-id $INSTANCE_ID --region $REGION"
