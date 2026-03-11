#!/bin/bash
# troubleshoot-deploy.sh - Diagnóstico y reparación de problemas

echo "🔍 DIAGNÓSTICO DE PROBLEMAS DE DEPLOY - TienditaCampus"
echo "=================================================="

# IDs de instancias
BACKEND_INSTANCE="i-0ee35704e56d22bc4"
FRONTEND_INSTANCE="i-09e028682794543e3"
DATABASE_INSTANCE="i-0092c19af358a5245"
REGION="us-east-1"

echo "📊 Paso 1: Verificar estado de instancias EC2..."
aws ec2 describe-instances \
    --instance-ids "$BACKEND_INSTANCE" "$FRONTEND_INSTANCE" "$DATABASE_INSTANCE" \
    --region "$REGION" \
    --query 'Reservations[*].Instances[*].[InstanceId,State.Name,PublicIpAddress,InstanceType,LaunchTime]' \
    --output table

echo ""
echo "🔍 Paso 2: Verificar Security Groups..."
aws ec2 describe-instances \
    --instance-ids "$BACKEND_INSTANCE" "$FRONTEND_INSTANCE" "$DATABASE_INSTANCE" \
    --region "$REGION" \
    --query 'Reservations[*].Instances[*].[InstanceId,SecurityGroups[*].[GroupId,GroupName]]' \
    --output table

echo ""
echo "🔍 Paso 3: Verificar conectividad de puertos..."
echo "🌐 Probando Frontend (98.82.69.208):"
timeout 5 bash -c "</dev/tcp/98.82.69.208/80" && echo "✅ Puerto 80 abierto" || echo "❌ Puerto 80 cerrado"

echo "📦 Probando Backend (98.92.47.235):"
timeout 5 bash -c "</dev/tcp/98.92.47.235/3001" && echo "✅ Puerto 3001 abierto" || echo "❌ Puerto 3001 cerrado"

echo "🗄️ Probando Database (54.157.136.124):"
timeout 5 bash -c "</dev/tcp/54.157.136.124/5432" && echo "✅ Puerto 5432 abierto" || echo "❌ Puerto 5432 cerrado"

echo "🔴 Probando Redis (54.157.136.124):"
timeout 5 bash -c "</dev/tcp/54.157.136.124/6379" && echo "✅ Puerto 6379 abierto" || echo "❌ Puerto 6379 cerrado"

echo ""
echo "📤 Paso 4: Verificar comandos SSM ejecutados..."
aws ssm list-commands \
    --region "$REGION" \
    --max-items 10 \
    --query 'Commands[*].[CommandId,DocumentName,Status,RequestedDateTime]' \
    --output table

echo ""
echo "📋 Paso 5: Verificar estado de comandos por instancia..."
for instance in "$BACKEND_INSTANCE" "$FRONTEND_INSTANCE" "$DATABASE_INSTANCE"; do
    echo "📋 Logs para instancia $instance:"
    aws ssm list-command-invocations \
        --region "$REGION" \
        --instance-id "$instance" \
        --max-items 3 \
        --query 'CommandInvocations[*].[CommandId,Status,ExecutionElapsedTime]' \
        --output table 2>/dev/null || echo "❌ No se pueden obtener logs para $instance"
done

echo ""
echo "🔧 Paso 6: Verificar si los servicios están corriendo..."

# Verificar servicios en cada instancia
for instance in "$BACKEND_INSTANCE" "$FRONTEND_INSTANCE" "$DATABASE_INSTANCE"; do
    echo "🔍 Verificando servicios en instancia $instance:"
    
    # Verificar Docker
    aws ssm send-command \
        --instance-ids "$instance" \
        --document-name "AWS-RunShellScript" \
        --parameters 'commands=["systemctl is-active docker || echo 'Docker no instalado'", "docker ps || echo 'Docker no corriendo'"]' \
        --region "$REGION" \
        --output json > /dev/null 2>&1
    
    # Verificar Nginx
    aws ssm send-command \
        --instance-ids "$instance" \
        --document-name "AWS-RunShellScript" \
        --parameters 'commands=["systemctl is-active nginx || echo 'Nginx no instalado'", "nginx -t || echo 'Nginx configuración inválida'"]' \
        --region "$REGION" \
        --output json > /dev/null 2>&1
    
    # Verificar PostgreSQL
    aws ssm send-command \
        --instance-ids "$instance" \
        --document-name "AWS-RunShellScript" \
        --parameters 'commands=["systemctl is-active postgresql || echo 'PostgreSQL no instalado'", "psql -l || echo 'PostgreSQL no corriendo'"]' \
        --region "$REGION" \
        --output json > /dev/null 2>&1
done

echo ""
echo "🔧 Paso 7: Verificar configuración de red interna..."
echo "🌐 Probando conectividad interna entre instancias:"
echo "   Frontend -> Backend:"
timeout 5 bash -c "</dev/tcp/172.31.65.39/3001" && echo "✅ Conexión interna OK" || echo "❌ Conexión interna fallida"

echo "   Backend -> Database:"
timeout 5 bash -c "</dev/tcp/172.31.74.10/5432" && echo "✅ Conexión interna OK" || echo "❌ Conexión interna fallida"

echo ""
echo "📋 DIAGNÓSTICO COMPLETADO"
echo "=================================="
echo "🔍 Posibles problemas detectados:"
echo "   1. Security Groups no permiten puertos necesarios"
echo "   2. Servicios no instalados correctamente"
echo "   3. Configuración de red interna incorrecta"
echo "   4. Comandos SSM fallaron o no se ejecutaron"
echo "   5. Instancias no están corriendo"
