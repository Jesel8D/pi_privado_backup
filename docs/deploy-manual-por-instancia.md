# 🔧 **DEPLOY MANUAL - CONEXIÓN DIRECTA**

## 🚀 **ENTRAR A CADA INSTANCIA MANUALMENTE**

---

## 🔑 **PRIMERO: USAR LA CLAVE CORRECTA**

### **📋 La clave que me diste es la correcta:**
```pem
-----BEGIN RSA PRIVATE KEY-----
MIIEpQIBAAKCAQEAqfY4k1A+W77aoiMvjMsIj14xLOQNwWJQ2REw2kuI36j0r5+J
bI3ZlLD/NNobC6+E6Su6Ru8I1fKXNJhlRL08IaCV9ZM8sT9BQJ8KYYvx6XcgRhyh
GFQBcB/gCOmqv6F5FFG4HSXFAGPBfi1hAJHTzuir2KegaP7HyYg4wUWCF6n/6hou
i4ZCDrKNLusTTUiQCZU6AvJ3EkX6trfjGYg5v3SD40NN4zvG3201C2P4IvhEcR0L
a0g9aGcd8TIYTx7b+0nUz98MtODbalWk+ufq6TG4VoQBkgMJUrTXon6EfVuZOgKx
RMxfDSPtcZZoVudn467kFir4L2JAhXNS2Wmd2wIDAQABAoIBAQCgjOqcneyKFhvJ
lZtRUGnhpISndzZXO1xL8KVJUJkXTi71x6q1VLn4b8pkTrPFsiPHb3sjjqG2GNck
4+ClsmyfB2cg99kZRjuJo7LWuq/mbpWaJWk35gMFu9aSFMkrBImv3BIj1o3l9FXP
r2Y2d4qxpbDPlGk/RY3MnlWenN5rIq1uvYA82Sw+H1VDMXTbNm9OtrbsGB1JQy7p
TPekIdFohE9b/qJ2CX6YfF+6xW5jvkO1Ih/cmWn3+FpDJV/7/WvQS2gtHPGXpns2
iEwDejapPJpIhPiee3jF0ayTx4yWZdBi6J3lq3ljs/X66f400K7pRYmlqg+bpHLQ
OTdNlYDhAoGBANPFCFOwPM9O1D7dX5HIT9XXudRDbbam1+jmdZAtjh9C+HGbNhgh
9NoTC2vBT7xFGoO+xuM7AWWVbaxZbwKSmKpcSxPUHQADPRLaf7Sfnhw2/dSsfQuY
7UAJTx9K1nyrTCjUkouueHP42n5xACHONDeICaq5c+h6wrI7Yk4wsPIPAoGBAM11
yuqLQd4703D19uu9qM8UtDjthawV4TEjuUwNiC51LuBo+dBsjk/aLmCB+1Gc4A3c
gfgX9OgPs7+mfBiPKfKC5U/1d8mNh/u3zMxEChm12D1LHrEmRhrLNwhLRFJk9vKE
y4fcyRAu8eB52MfriPptZEX4Lpyw83TdEDWsjjN1AoGAO8J4TRWIs3+tSWgzFfKP
BOtxl0LH7Sk7+I9AUcVpO80sSvLf2wOKExgYuvm8RIbDqrXlbi4ygLYgUuiR+Qnh
ZwHQdfH/lQdU7sMWEqSQe6nRC3j5eJJZMR7vYwc9a8TzIvqJuD0t5JwvHEtLHD8S
YTFUeQcIfGxYEO/NF/+Jj2UCgYEAog5C2vS0I4G0qOiYtiCGQa/m5vAR+0XWtVek
E+SogVxUeRTT1h2Jslo5Mk3T2O+Pmd9PdEwRE+kusf+y6fwh7fJoxMSskwFbPKQg
mQ0hml3gDZhuwPObYA7hfV1AqmyQi4FKuALhZC5jAdeZsTaKeFxINxgmS9kWbhrf
ajaMgvECgYEArdsGiif8VCk3MaIyBo48ln3Luc3UXUySXcPp1b6THpOAUGSEmtwO
/KGmXsX7T+EuP8RpFBgHWPqScfLpLdaMpSfXEzYO1uH2ooDU8W1gbLH4Iw0gjIsA
fDGw/jf6g7Q0HkOZ+D0AydmzSSSl20apKPw1VCVDhg+r1HrsBU0qYVc=
-----END RSA PRIVATE KEY-----
```

### **📋 Crea un archivo llamado `clave-correcta.pem`:**
1. **Abre Bloc de notas**
2. **Pega la clave de arriba**
3. **Guarda como:** `clave-correcta.pem`
4. **Tipo:** Todos los archivos (*.*)

---

## 🖥️ **PASO 1: ENTRAR A BACKEND API**

### **📋 Conexión:**
```bash
ssh -i clave-correcta.pem ubuntu@98.92.47.235
```

### **📋 Una vez conectado, ejecutar:**
```bash
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
git clone https://github.com/Jesel8D/pi_privado_backup.git

# Configurar variables de entorno
cd pi_privado_backup
cat > .env << EOF
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
EOF

# Levantar backend
cd backend
sudo docker-compose up -d --build

echo "✅ Backend desplegado en puerto 3001"
```

---

## 🖥️ **PASO 2: ENTRAR A BASE DE DATOS**

### **📋 Conexión:**
```bash
ssh -i clave-correcta.pem ubuntu@54.157.136.124
```

### **📋 Una vez conectado, ejecutar:**
```bash
# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Configurar PostgreSQL
sudo -u postgres psql << EOF
    CREATE USER tienditacampus_user WITH PASSWORD "secure_password_123";
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

# Instalar Redis
sudo apt install -y redis-server
sudo systemctl enable redis-server
sudo systemctl start redis-server

echo "✅ Base de datos configurada"
```

---

## 🖥️ **PASO 3: ENTRAR A FRONTEND**

### **📋 Conexión:**
```bash
ssh -i clave-correcta.pem ubuntu@98.82.69.208
```

### **📋 Una vez conectado, ejecutar:**
```bash
# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Nginx y Node.js
sudo apt install -y nginx curl wget git
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clonar repositorio
cd /home/ubuntu
git clone https://github.com/Jesel8D/pi_privado_backup.git

# Build frontend
cd pi_privado_backup/frontend
npm install
npm run build

# Configurar Nginx
sudo rm -rf /var/www/html/*
sudo cp -r dist/* /var/www/html/

# Crear configuración de Nginx
sudo tee /etc/nginx/sites-available/tienditacampus << EOF
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
EOF

# Habilitar sitio
sudo ln -sf /etc/nginx/sites-available/tienditacampus /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Reiniciar Nginx
sudo nginx -t
sudo systemctl restart nginx
sudo systemctl enable nginx

echo "✅ Frontend desplegado en puerto 80"
```

---

## 🌐 **VERIFICACIÓN FINAL**

### **📋 Después de configurar todo:**
```bash
# Verificar Frontend
curl http://98.82.69.208

# Verificar Backend
curl http://98.92.47.235:3001

# Verificar Health Check
curl http://98.82.69.208/health
```

---

## 🎯 **RESUMEN DE PASOS**

### **📋 1. Crear archivo PEM:**
- **Nombre:** `clave-correcta.pem`
- **Contenido:** La clave que te di arriba

### **📋 2. Entrar a Backend:**
```bash
ssh -i clave-correcta.pem ubuntu@98.92.47.235
# Ejecutar comandos de deploy de backend
```

### **📋 3. Entrar a Database:**
```bash
ssh -i clave-correcta.pem ubuntu@54.157.136.124
# Ejecutar comandos de deploy de base de datos
```

### **📋 4. Entrar a Frontend:**
```bash
ssh -i clave-correcta.pem ubuntu@98.82.69.208
# Ejecutar comandos de deploy de frontend
```

---

## 🚀 **¡ENTRA A CADA INSTANCIA Y DESPLIEGA MANUALMENTE!**

### **✅ Ventajas de este método:**
- **Control total** de cada paso
- **Ves exactamente** lo que pasa
- **Puedes corregir** errores al momento
- **Sin scripts automáticos** que fallen

### **🎯 Resultado final:**
- **Frontend:** http://98.82.69.208
- **Backend:** http://98.92.47.235:3001
- **Database:** 172.31.74.10:5432

**¡Entra a cada instancia y despliega manualmente!** 🚀✨
