# 🔧 **USAR CLAVE PEM EXISTENTE - NUEVA CLAVE CORRECTA**

## ❌ **PROBLEMA DETECTADO**

### **🔍 El archivo `nueva-pem` tiene una clave diferente:**
- **Clave en `nueva-pem`:** `MIIEpQIBAAKCAQEArhlge0VSZq/ETL5pUhvk3DN5IpzBT+0+/0qnhwW/mNWVm9UR...`
- **Clave que me diste:** `MIIEpQIBAAKCAQEAqfY4k1A+W77aoiMvjMsIj14xLOQNwWJQ2REw2kuI36j0r5+J...`

### **🔍 Son claves completamente diferentes:**
- **`nueva-pem`** no funciona con tus instancias
- **La clave que me diste** es la correcta

---

## 🔧 **SOLUCIÓN**

### **📋 Paso 1: Crear archivo con la clave correcta**
**Manualmente crea un archivo llamado `tienditacampus.pem` con el contenido que me diste:**

```bash
# En Windows:
# 1. Abre Bloc de notas
# 2. Pega la clave que me diste
# 3. Guarda como: tienditacampus.pem
# 4. Tipo: Todos los archivos (*.*)

# En Linux/Mac:
cat > tienditacampus.pem << 'EOF'
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
EOF
```

### **📋 Paso 2: Configurar permisos**
```bash
# En Windows (PowerShell)
icacls tienditacampus.pem /c

# En Linux/Mac
chmod 400 tienditacampus.pem
```

### **📋 Paso 3: Probar conexión**
```bash
# Probar Backend
ssh -i tienditacampus.pem ubuntu@98.92.47.235 "echo '✅ Backend conectado'"

# Probar Frontend
ssh -i tienditacampus.pem ubuntu@98.82.69.208 "echo '✅ Frontend conectado'"

# Probar Database
ssh -i tienditacampus.pem ubuntu@54.157.136.124 "echo '✅ Database conectado'"
```

---

## 🔧 **MODIFICAR SCRIPT PARA USAR NUEVA CLAVE**

### **📋 Actualizar `deploy-simple.sh`:**
```bash
# Cambiar esta línea:
PEM_KEY="nueva-pem"

# Por esta:
PEM_KEY="tienditacampus.pem"
```

---

## 🚀 **EJECUCIÓN CON CLAVE CORRECTA**

### **📋 Una vez creado el archivo:**
1. **Crear archivo** `tienditacampus.pem` con la clave que me diste
2. **Configurar permisos** del archivo
3. **Ejecutar deploy:**
   ```bash
   ./scripts/deploy-simple.sh
   ```

---

## 🎯 **RESUMEN**

### **❌ El problema:**
- **`nueva-pem`** tiene una clave diferente a la de tus instancias
- **La clave correcta** es la que me diste ahora

### **✅ La solución:**
1. **Crear archivo** `tienditacampus.pem` con la clave correcta
2. **Configurar permisos** adecuados
3. **Ejecutar deploy** con la nueva clave

### **🎯 Resultado esperado:**
- **Conexión SSH** exitosa a las 3 instancias
- **Deploy completo** funcionando
- **Aplicación accesible** en las URLs correspondientes

---

## 🚀 **¡CREA EL ARCHIVO Y EJECUTA!**

### **📋 Instrucciones finales:**
1. **Crea el archivo** `tienditacampus.pem` con la clave que te di
2. **Configura permisos** con `icacls tienditacampus.pem /c`
3. **Ejecuta deploy** con `./scripts/deploy-simple.sh`

**¡Con la clave correcta, todo funcionará!** 🚀✨
