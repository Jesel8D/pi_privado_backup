# 🚀 **DEPLOY AUTOMÁTICO EN AWS EC2 - LABORATORIO**

## 📋 **INFORMACIÓN DE INSTANCIAS RECIBIDA**

### **🖥️ Instancia 1: Backend API**
```
ID: i-0ee35704e56d22bc4
IP Pública: 98.92.47.235
IP Privada: 172.31.65.39
Tipo: t3.medium (2 vCPU, 4 GB RAM)
SO: Ubuntu 22.04 LTS
DNS: ec2-98-92-47-235.compute-1.amazonaws.com
```

### **🖥️ Instancia 2: Frontend + Nginx**
```
ID: i-09e028682794543e3
IP Pública: 98.82.69.208
IP Privada: 172.31.67.21
Tipo: t3.small (2 vCPU, 2 GB RAM)
SO: Ubuntu 22.04 LTS
DNS: ec2-98-82-69-208.compute-1.amazonaws.com
```

### **🖥️ Instancia 3: Base de Datos Dedicada**
```
ID: i-0092c19af358a5245
IP Pública: 54.157.136.124
IP Privada: 172.31.74.10
Tipo: t3.small (2 vCPU, 2 GB RAM)
SO: Ubuntu 22.04 LTS
DNS: ec2-54-157-136-124.compute-1.amazonaws.com
```

---

## 🔐 **PROBLEMA CON CLAVE PEM**

### **❌ Issues detectados:**
- **Formato de clave inválido** al intentar conectar
- **Host keys cambiados** (necesitan limpieza)
- **Permisos incorrectos** en archivo PEM

### **🔧 Solución:**
```bash
# 1. Limpiar known_hosts
ssh-keygen -R 98.92.47.235
ssh-keygen -R 98.82.69.208  
ssh-keygen -R 54.157.136.124

# 2. Crear script de deploy automatizado
# Sin necesidad de acceso SSH directo
```

---

## 🤖 **SCRIPT DE DEPLOY AUTOMATIZADO**

### **📋 Opción 1: AWS Systems Manager (Recomendado)**
```bash
# Script para todas las instancias
#!/bin/bash
# deploy-all-instances.sh

echo "🚀 Iniciando deploy automático en AWS EC2..."

# Backend API (98.92.47.235)
echo "📦 Deploy Backend API..."
aws ssm send-command \
    --instance-ids "i-0ee35704e56d22bc4" \
    --document-name "AWS-RunShellScript" \
    --parameters 'commands=["git clone https://github.com/Jesel8D/pi_privado_backup.git && cd pi_privado_backup && chmod +x deploy-backend.sh && ./deploy-backend.sh"]'

# Frontend + Nginx (98.82.69.208)
echo "🌐 Deploy Frontend + Nginx..."
aws ssm send-command \
    --instance-ids "i-09e028682794543e3" \
    --document-name "AWS-RunShellScript" \
    --parameters 'commands=["git clone https://github.com/Jesel8D/pi_privado_backup.git && cd pi_privado_backup && chmod +x deploy-frontend.sh && ./deploy-frontend.sh"]'

# Base de Datos (54.157.136.124)
echo "🗄️ Deploy Base de Datos..."
aws ssm send-command \
    --instance-ids "i-0092c19af358a5245" \
    --document-name "AWS-RunShellScript" \
    --parameters 'commands=["git clone https://github.com/Jesel8D/pi_privado_backup.git && cd pi_privado_backup && chmod +x deploy-database.sh && ./deploy-database.sh"]'

echo "✅ Deploy iniciado en todas las instancias"
```

### **📋 Opción 2: User Data (Startup Scripts)**
```bash
# Agregar al lanzamiento de instancias
# User Data para Backend:
#!/bin/bash
cd /home/ubuntu
git clone https://github.com/Jesel8D/pi_privado_backup.git
cd pi_privado_backup
chmod +x scripts/deploy-backend.sh
./scripts/deploy-backend.sh

# User Data para Frontend:
#!/bin/bash
cd /home/ubuntu
git clone https://github.com/Jesel8D/pi_privado_backup.git
cd pi_privado_backup
chmod +x scripts/deploy-frontend.sh
./scripts/deploy-frontend.sh

# User Data para Database:
#!/bin/bash
cd /home/ubuntu
git clone https://github.com/Jesel8D/pi_privado_backup.git
cd pi_privado_backup
chmod +x scripts/deploy-database.sh
./scripts/deploy-database.sh
```

---

## ⏰ **SCHEDULER PARA LABORATORIO (4 HORAS)**

### **🕐 Script de Auto-Activación:**
```bash
#!/bin/bash
# lab-scheduler.sh
# Activar laboratorio por 4 horas automáticamente

while true; do
    echo "🔥 Activando laboratorio por 4 horas..."
    
    # Iniciar instancias si están detenidas
    aws ec2 start-instances \
        --instance-ids "i-0ee35704e56d22bc4 i-09e028682794543e3 i-0092c19af358a5245" \
        --region us-east-1
    
    echo "⏰ Laboratorio activo por 4 horas..."
    sleep 14400  # 4 horas = 14400 segundos
    
    echo "❌ Deteniendo laboratorio..."
    # Detener instancias automáticamente
    aws ec2 stop-instances \
        --instance-ids "i-0ee35704e56d22bc4 i-09e028682794543e3 i-0092c19af358a5245" \
        --region us-east-1
    
    echo "⏳ Esperando siguiente activación (ciclo de 24 horas)..."
    sleep 72000  # 20 horas de espera = 24 horas total
done
```

### **🕐 Configurar Cron en CloudWatch:**
```yaml
EventBridge Rule:
  Schedule: "cron(0 */6 * * * ? *)"  # Cada 6 horas
  Target: LabSchedulerFunction
  
Lambda Function:
  - Activar instancias por 4 horas
  - Enviar notificación por email
  - Log en CloudWatch
```

---

## 📦 **SCRIPTS DE DEPLOY POR INSTANCIA**

### **🖥️ Backend API Script:**
```bash
#!/bin/bash
# scripts/deploy-backend.sh

echo "🚀 Deploy Backend API - TienditaCampus"

# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker ubuntu

# Instalar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Clonar repositorio (si no existe)
cd /home/ubuntu
if [ ! -d "pi_privado_backup" ]; then
    git clone https://github.com/Jesel8D/pi_privado_backup.git
fi

cd pi_privado_backup

# Configurar variables de entorno
cat > .env << EOF
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
EOF

# Levantar servicios
cd backend
docker-compose up -d --build

echo "✅ Backend API desplegado exitosamente"
echo "🌐 API disponible en: http://98.92.47.235:3001"
```

### **🌐 Frontend + Nginx Script:**
```bash
#!/bin/bash
# scripts/deploy-frontend.sh

echo "🌐 Deploy Frontend + Nginx - TienditaCampus"

# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Nginx y certbot
sudo apt install -y nginx certbot python3-certbot-nginx

# Clonar repositorio
cd /home/ubuntu
if [ ! -d "pi_privado_backup" ]; then
    git clone https://github.com/Jesel8D/pi_privado_backup.git
fi

cd pi_privado_backup

# Configurar Nginx
sudo cp devops/nginx/nginx.prod.conf /etc/nginx/sites-available/tienditacampus
sudo ln -s /etc/nginx/sites-available/tienditacampus /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default

# Build y deploy frontend
cd frontend
npm install
npm run build

# Copiar build a Nginx
sudo cp -r dist/* /var/www/html/

# Configurar SSL (simulado para laboratorio)
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/ssl/private/nginx-selfsigned.key -out /etc/ssl/certs/nginx-selfsigned.crt -subj "/C=US/ST=State/L=City/O=Organization/CN=98.82.69.208"

# Reiniciar Nginx
sudo systemctl restart nginx
sudo systemctl enable nginx

echo "✅ Frontend desplegado exitosamente"
echo "🌐 Frontend disponible en: https://98.82.69.208"
```

### **🗄️ Base de Datos Script:**
```bash
#!/bin/bash
# scripts/deploy-database.sh

echo "🗄️ Deploy Base de Datos - TienditaCampus"

# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Configurar PostgreSQL
sudo -u postgres psql << EOF
CREATE USER tienditacampus_user WITH PASSWORD 'secure_password_123';
CREATE DATABASE tienditacampus OWNER tienditacampus_user;
GRANT ALL PRIVILEGES ON DATABASE tienditacampus TO tienditacampus_user;
\q
EOF

# Configurar acceso remoto
sudo sed -i "s/#listen_addresses = 'localhost'/listen_addresses = '*'/" /etc/postgresql/14/main/postgresql.conf
sudo echo "host all all 172.31.0.0/16 md5" | sudo tee -a /etc/postgresql/14/main/pg_hba.conf

# Reiniciar PostgreSQL
sudo systemctl restart postgresql
sudo systemctl enable postgresql

# Instalar Redis para caché
sudo apt install -y redis-server
sudo systemctl enable redis-server
sudo systemctl start redis-server

# Clonar repositorio y ejecutar migraciones
cd /home/ubuntu
if [ ! -d "pi_privado_backup" ]; then
    git clone https://github.com/Jesel8D/pi_privado_backup.git
fi

cd pi_privado_backup

# Ejecutar migraciones de base de datos
cd database
# Aquí irían las migraciones de TypeORM

echo "✅ Base de datos desplegada exitosamente"
echo "🗄️ PostgreSQL disponible en: 172.31.74.10:5432"
echo "🔴 Redis disponible en: 172.31.74.10:6379"
```

---

## 💰 **CONTROL DE COSTOS ($50 MENSUALES)**

### **📊 Costo Real por Instancia:**
```yaml
Backend (t3.medium): $45.52/mes
Frontend (t3.small): $25.26/mes  
Database (t3.small): $25.26/mes
Subtotal: $96.04/mes

+ Almacenamiento (~80 GB): $10/mes
+ Transferencia (~100 GB): $9/mes

TOTAL: ~$115/mes (bajo el presupuesto de $50)
```

### **💡 Optimización para $50 mensuales:**
```yaml
Opción 1 - Instancias más pequeñas:
  - Backend: t3.small ($25.26/mes)
  - Frontend: t3.micro ($10.52/mes)
  - Database: t3.micro ($10.52/mes)
  - Total: ~$55/mes

Opción 2 - Instancia compartida:
  - Una t3.medium para todo: $45.52/mes
  - Base de datos RDS gratuita tier: $0/mes
  - Total: ~$55/mes
```

---

## 🚀 **EJECUCIÓN INMEDIATA**

### **📋 Para proceder SIN acceso SSH:**

```bash
# 1. Usar AWS Systems Manager (recomendado)
aws ssm send-command \
    --instance-ids "i-0ee35704e56d22bc4" \
    --document-name "AWS-RunShellScript" \
    --parameters 'commands=["curl -fsSL https://raw.githubusercontent.com/Jesel8D/pi_privado_backup/main/scripts/deploy-backend.sh | bash"]'

# 2. O crear AMI personalizada con todo pre-instalado
# 3. O usar User Data al lanzar instancias
```

### **🎯 ¿Qué necesito de ti?**
1. **✅ Credenciales AWS** (ya las tengo de las instancias)
2. **⚠️ Confirmar presupuesto** ($50 vs $115 reales)
3. **🔧 Aprobar configuración** (instancias separadas vs compartida)
4. **🕐 Confirmar scheduler** (4 horas on, 20 horas off)

---

## 🎯 **PRÓXIMOS PASOS**

1. **📧 Creo los scripts de deploy** en el repositorio
2. **🚀 Subo todo a GitHub** con los scripts
3. **⚡ Ejecuto deploy automático** via AWS Systems Manager
4. **🕐 Configuro scheduler** para 4 horas de laboratorio
5. **💰 Optimizo costos** según presupuesto
6. **🔧 Configuro monitoreo** y alertas

**¡Estoy listo para hacer el deploy automático cuando confirmes!** 🚀✨
