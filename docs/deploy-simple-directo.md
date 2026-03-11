# 🚀 **DEPLOY SIMPLE - DIRECTO A INSTANCIAS**

## 📋 **INSTRUCCIONES DIRECTAS**

### **🎯 Lo que hace este script:**
- **Conecta directamente** a cada instancia con SSH
- **Usa IPs elásticas** públicas
- **Usa tu clave PEM** existente
- **Instala todo** sin AWS Systems Manager
- **Deploy completo** en un solo comando

---

## 🔑 **CONFIGURACIÓN REQUERIDA**

### **📁 Archivo PEM:**
- **Nombre:** `nueva-pem` (ya lo tienes)
- **Ubicación:** En el directorio del proyecto
- **Permisos:** `chmod 400 nueva-pem` (en Linux/Mac)

### **🌐 IPs de las instancias:**
```yaml
Backend API: 98.92.47.235
Frontend: 98.82.69.208  
Database: 54.157.136.124
```

---

## 🚀 **EJECUCIÓN INMEDIATA**

### **📋 Paso 1: Configurar clave PEM**
```bash
# En Linux/Mac
chmod 400 nueva-pem

# En Windows (PowerShell)
icacls nueva-pem /c
```

### **📋 Paso 2: Ejecutar deploy simple**
```bash
# En Linux/Mac
./scripts/deploy-simple.sh

# En Windows (PowerShell)
.\scripts\deploy-simple.sh
```

---

## 🔧 **QUÉ HACE EL SCRIPT**

### **📦 Backend API (98.92.47.235):**
```bash
ssh -i nueva-pem ubuntu@98.92.47.235 << 'EOF'
# 1. Actualizar sistema
# 2. Instalar Docker y Docker Compose
# 3. Clonar repositorio
# 4. Configurar variables de entorno
# 5. Levantar backend con docker-compose
# 6. Resultado: API en http://98.92.47.235:3001
EOF
```

### **🗄️ Base de Datos (54.157.136.124):**
```bash
ssh -i nueva-pem ubuntu@54.157.136.124 << 'EOF'
# 1. Actualizar sistema
# 2. Instalar PostgreSQL y Redis
# 3. Configurar acceso remoto
# 4. Crear base de datos y usuario
# 5. Resultado: DB en 172.31.74.10:5432
EOF
```

### **🌐 Frontend + Nginx (98.82.69.208):**
```bash
ssh -i nueva-pem ubuntu@98.82.69.208 << 'EOF'
# 1. Actualizar sistema
# 2. Instalar Nginx y Node.js
# 3. Clonar repositorio
# 4. Build del frontend
# 5. Configurar Nginx como reverse proxy
# 6. Resultado: Frontend en http://98.82.69.208
EOF
```

---

## 🌐 **RESULTADOS ESPERADOS**

### **📋 URLs de acceso:**
```yaml
Frontend: http://98.82.69.208
Backend API: http://98.92.47.235:3001
Health Check: http://98.82.69.208/health
```

### **📊 Verificación automática:**
```bash
# El script verifica automáticamente:
curl http://98.82.69.208      # Frontend
curl http://98.92.47.235:3001  # Backend
curl http://98.82.69.208/health # Health check
```

---

## 🔍 **SI HAY PROBLEMAS DE CONEXIÓN**

### **❌ Error: "Permission denied (publickey)"**
**Solución:**
```bash
# Verificar permisos del archivo PEM
ls -la nueva-pem
# Debe ser: -r--------

# Corregir permisos
chmod 400 nueva-pem
```

### **❌ Error: "Connection timed out"**
**Solución:**
```bash
# Verificar que la instancia esté corriendo
ping 98.92.47.235
ping 98.82.69.208
ping 54.157.136.124

# Verificar Security Groups permiten puerto 22
```

### **❌ Error: "Host key verification failed"**
**Solución:**
```bash
# Limpiar known_hosts
ssh-keygen -R 98.92.47.235
ssh-keygen -R 98.82.69.208
ssh-keygen -R 54.157.136.124
```

---

## 🎯 **VENTAJAS DE ESTE MÉTODO**

### **✅ Beneficios:**
- **Sin AWS CLI** - No necesita configuración
- **Conexión directa** - SSH puro a cada instancia
- **Control total** - Ves todo lo que pasa
- **Logs en tiempo real** - Output directo de cada comando
- **Independiente** - No depende de AWS Systems Manager

### **🔧 Proceso:**
1. **Conexión SSH** directa a cada instancia
2. **Ejecución local** de todos los comandos
3. **Instalación completa** de dependencias
4. **Configuración automática** de servicios
5. **Verificación inmediata** de funcionamiento

---

## 🚀 **EJECUCIÓN INMEDIATA**

### **📋 Comando único:**
```bash
./scripts/deploy-simple.sh
```

### **📋 Verificación manual:**
```bash
# Después del deploy
curl -I http://98.82.69.208
curl -I http://98.92.47.235:3001
curl http://98.82.69.208/health
```

---

## 🎉 **¡DEPLOY SIMPLE LISTO!**

### **✅ Características:**
- **Conexión directa** SSH a cada instancia
- **Usa IPs elásticas** públicas
- **Usa tu clave PEM** existente
- **Sin dependencias** de AWS CLI
- **Deploy completo** en un solo script
- **Verificación automática** de estado

### **🎯 Resultado final:**
- **Frontend funcionando** en http://98.82.69.208
- **Backend funcionando** en http://98.92.47.235:3001
- **Base de datos funcionando** en 172.31.74.10:5432
- **Todo conectado** y comunicándose

---

## 🚀 **¡EJECUTA AHORA!**

### **📋 Solo necesitas:**
1. **Clave PEM** configurada correctamente
2. **Ejecutar el script** en el directorio del proyecto

### **📋 Comando mágico:**
```bash
./scripts/deploy-simple.sh
```

**¡Con esto, tu deploy funcionará sin complicaciones!** 🚀✨
