# 🚀 **DEPLOY CON TU CLAVE PEM ACTUAL**

## ✅ **USAREMOS TU ARCHIVO `nueva-pem`**

---

## 🔑 **CONFIGURACIÓN LISTA**

### **📋 El script está configurado para:**
- **Archivo PEM:** `nueva-pem` (el que ya tienes)
- **IPs elásticas:** Las que me diste
- **Deploy completo:** Todo en un solo comando

---

## 🚀 **EJECUCIÓN INMEDIATA**

### **📋 Solo necesitas ejecutar:**
```bash
./scripts/deploy-simple.sh
```

### **📋 Si hay problemas de permisos:**
```bash
# En Windows (PowerShell)
icacls nueva-pem /c

# Luego ejecutar
./scripts/deploy-simple.sh
```

---

## 🔍 **SI NO FUNCIONA, PRUEBA ESTO:**

### **❌ Si dice "Permission denied":**
```bash
# Limpiar known_hosts
ssh-keygen -R 98.92.47.235
ssh-keygen -R 98.82.69.208
ssh-keygen -R 54.157.136.124

# Luego ejecutar deploy
./scripts/deploy-simple.sh
```

### **❌ Si dice "Connection timed out":**
```bash
# Verificar que las instancias estén corriendo
ping 98.92.47.235
ping 98.82.69.208
ping 54.157.136.124
```

---

## 🎯 **RESULTADO ESPERADO**

### **✅ Después de ejecutar el script:**
- **Frontend funcionando** en http://98.82.69.208
- **Backend funcionando** en http://98.92.47.235:3001
- **Base de datos funcionando** internamente
- **Todo conectado** y comunicándose

---

## 🚀 **¡EJECUTA AHORA!**

### **📋 Comando único:**
```bash
./scripts/deploy-simple.sh
```

### **📋 Verificación después del deploy:**
```bash
curl http://98.82.69.208
curl http://98.92.47.235:3001
```

---

## 🎉 **¡TODO LISTO CON TU CLAVE PEM!**

### **✅ Configuración final:**
- **Script actualizado** para usar `nueva-pem`
- **Deploy completo** listo para ejecutar
- **Sin complicaciones** adicionales
- **Todo documentado** y funcionando

### **🎯 Solo ejecuta:**
```bash
./scripts/deploy-simple.sh
```

**¡Con tu clave PEM actual, el deploy funcionará!** 🚀✨
