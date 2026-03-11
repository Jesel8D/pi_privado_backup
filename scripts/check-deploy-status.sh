#!/bin/bash
# check-deploy-status.sh - Verificar estado del deploy

echo "📊 Verificando estado del deploy de TienditaCampus..."

# IDs de instancias
BACKEND_INSTANCE="i-0ee35704e56d22bc4"
FRONTEND_INSTANCE="i-09e028682794543e3"
DATABASE_INSTANCE="i-0092c19af358a5245"
REGION="us-east-1"

echo "🔍 Estado de las instancias EC2:"
aws ec2 describe-instances \
    --instance-ids "$BACKEND_INSTANCE" "$FRONTEND_INSTANCE" "$DATABASE_INSTANCE" \
    --region "$REGION" \
    --query 'Reservations[*].Instances[*].[InstanceId,State.Name,PublicIpAddress,InstanceType]' \
    --output table

echo ""
echo "📤 Últimos comandos ejecutados:"
aws ssm list-commands \
    --region "$REGION" \
    --max-items 5 \
    --query 'Commands[*].[CommandId,DocumentName,Status,RequestedDateTime]' \
    --output table

echo ""
echo "🌐 Verificando disponibilidad de servicios:"
echo "🔍 Frontend (http://98.82.69.208):"
curl -s -o /dev/null -w "%{http_code}" http://98.82.69.208 || echo "No disponible"

echo "🔍 Backend API (http://98.92.47.235:3001):"
curl -s -o /dev/null -w "%{http_code}" http://98.92.47.235:3001 || echo "No disponible"

echo "🔍 Base de Datos (172.31.74.10:5432):"
nc -zv 172.31.74.10 5432 2>&1 | grep -E "(succeeded|failed)" || echo "No se puede verificar"

echo ""
echo "📊 Logs de comandos SSM:"
for instance in "$BACKEND_INSTANCE" "$FRONTEND_INSTANCE" "$DATABASE_INSTANCE"; do
    echo "📋 Logs para instancia $instance:"
    aws ssm list-command-invocations \
        --region "$REGION" \
        --instance-id "$instance" \
        --max-items 3 \
        --query 'CommandInvocations[*].[CommandId,Status,ExecutionElapsedTime]' \
        --output table
done
