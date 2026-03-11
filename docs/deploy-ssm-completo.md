# 🚀 **DEPLOY COMPLETO VIA AWS SYSTEMS MANAGER**

## ✅ **SCRIPTS CREADOS Y LISTOS**

---

## 📁 **ARCHIVOS DE DEPLOY CREADOS**

### **📦 Scripts individuales:**
1. **`scripts/deploy-backend-ssm.sh`** - Deploy Backend API
2. **`scripts/deploy-frontend-ssm.sh`** - Deploy Frontend + Nginx
3. **`scripts/deploy-database-ssm.sh`** - Deploy Base de Datos
4. **`scripts/deploy-todo-ssm.sh`** - Deploy completo automatizado
5. **`scripts/check-deploy-status.sh`** - Verificación de estado

---

## 🔧 **EJECUCIÓN MANUAL**

### **📋 Paso 1: Configurar AWS CLI**
```bash
# Configurar credenciales AWS
aws configure
# Ingresar:
# - AWS Access Key ID
# - AWS Secret Access Key  
# - Default region: us-east-1
# - Default output format: json
```

### **📋 Paso 2: Ejecutar deploy completo**
```bash
# En Windows (PowerShell)
.\scripts\deploy-todo-ssm.sh

# En Linux/Mac
./scripts/deploy-todo-ssm.sh
```

### **📋 Paso 3: Verificar estado**
```bash
# Verificar estado del deploy
.\scripts\check-deploy-status.sh
```

---

## 🚀 **EJECUCIÓN POR COMPONENTES**

### **📦 Deploy Backend API:**
```bash
.\scripts\deploy-backend-ssm.sh
```
**Qué hace:**
- Instala Docker y Docker Compose
- Clona el repositorio
- Configura variables de entorno
- Levanta backend con docker-compose
- **Resultado:** API en http://98.92.47.235:3001

### **🌐 Deploy Frontend + Nginx:**
```bash
.\scripts\deploy-frontend-ssm.sh
```
**Qué hace:**
- Instala Nginx y Node.js
- Clona el repositorio
- Build del frontend
- Configura Nginx como reverse proxy
- **Resultado:** Frontend en http://98.82.69.208

### **🗄️ Deploy Base de Datos:**
```bash
.\scripts\deploy-database-ssm.sh
```
**Qué hace:**
- Instala PostgreSQL y Redis
- Configura acceso remoto
- Crea base de datos y usuario
- Ejecuta migraciones básicas
- **Resultado:** DB en 172.31.74.10:5432

---

## 📊 **VERIFICACIÓN DE ESTADO**

### **🔍 Comandos de verificación:**
```bash
# Ver últimas instancias
aws ec2 describe-instances \
    --instance-ids "i-0ee35704e56d22bc4 i-09e028682794543e3 i-0092c19af358a5245" \
    --region us-east-1 \
    --query 'Reservations[*].Instances[*].[InstanceId,State.Name,PublicIpAddress]' \
    --output table

# Ver comandos ejecutados
aws ssm list-commands \
    --region us-east-1 \
    --max-items 10 \
    --output table

# Ver logs de un comando específico
aws ssm get-command-invocation \
    --command-id <command-id> \
    --instance-id <instance-id> \
    --region us-east-1 \
    --output table
```

---

## 🌐 **ACCESO A LA APLICACIÓN**

### **📋 URLs de acceso:**
```yaml
Frontend: http://98.82.69.208
Backend API: http://98.92.47.235:3001
Base de Datos: 172.31.74.10:5432 (acceso interno)
Redis: 172.31.74.10:6379 (acceso interno)
```

### **🔍 Verificación manual:**
```bash
# Verificar frontend
curl -I http://98.82.69.208

# Verificar backend
curl -I http://98.92.47.235:3001

# Verificar base de datos
psql -h 172.31.74.10 -U tienditacampus_user -d tienditacampus
```

---

## ⏰ **SCHEDULER PARA 4 HORAS**

### **🕐 Lambda Function para control:**
```python
import boto3
import json

def lambda_handler(event, context):
    ec2 = boto3.client('ec2', region_name='us-east-1')
    
    instances = [
        'i-0ee35704e56d22bc4',  # Backend
        'i-09e028682794543e3',  # Frontend
        'i-0092c19af358a5245'   # Database
    ]
    
    action = event.get('action', 'start')
    
    if action == 'start':
        response = ec2.start_instances(InstanceIds=instances)
        message = 'Laboratorio activado por 4 horas'
    else:
        response = ec2.stop_instances(InstanceIds=instances)
        message = 'Laboratorio detenido'
    
    return {
        'statusCode': 200,
        'body': json.dumps({
            'message': message,
            'instances_affected': len(instances),
            'action': action
        })
    }
```

### **🕐 EventBridge Rule:**
```yaml
Name: "Laboratorio-4-Horas"
Schedule: "cron(0 14 * * ? *)"  # 2 PM UTC = 8 AM CDT
Target: LambdaFunction
```

---

## 🎯 **INSTRUCCIONES FINALES**

### **📋 Para ejecutar el deploy:**

1. **🔧 Configurar AWS CLI:**
   ```bash
   aws configure
   # Ingresar tus credenciales AWS
   ```

2. **🚀 Ejecutar deploy completo:**
   ```bash
   .\scripts\deploy-todo-ssm.sh
   ```

3. **📊 Verificar estado:**
   ```bash
   .\scripts\check-deploy-status.sh
   ```

4. **🌐 Acceder a la aplicación:**
   - **Frontend:** http://98.82.69.208
   - **Backend API:** http://98.92.47.235:3001

### **✅ Resultado esperado:**
- **Frontend** funcionando con Nginx
- **Backend API** corriendo en Docker
- **Base de datos** PostgreSQL configurada
- **Redis** para caché
- **Todo conectado** y funcionando

---

## 🎉 **¡DEPLOY LISTO PARA EJECUTAR!**

### **🚀 Scripts creados:**
- ✅ **5 scripts** de deploy automáticos
- ✅ **Sin necesidad de SSH**
- ✅ **Via AWS Systems Manager**
- ✅ **Logs centralizados**
- ✅ **Verificación de estado**

### **🎯 Próximos pasos:**
1. **🔧 Configurar AWS CLI** con tus credenciales
2. **🚀 Ejecutar** `.\scripts\deploy-todo-ssm.sh`
3. **📊 Verificar** con `.\scripts\check-deploy-status.sh`
4. **🌐 Acceder** a http://98.82.69.208

**¡Todo listo para deploy automático sin SSH!** 🚀✨
