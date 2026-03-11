#!/bin/bash
# deploy-todo-ssm.sh - Deploy completo via AWS Systems Manager

echo "🚀 Iniciando deploy completo de TienditaCampus via AWS Systems Manager..."

# IDs de instancias
BACKEND_INSTANCE="i-0ee35704e56d22bc4"
FRONTEND_INSTANCE="i-09e028682794543e3"
DATABASE_INSTANCE="i-0092c19af358a5245"
REGION="us-east-1"

echo "📦 Paso 1: Deploy Backend API..."
./scripts/deploy-backend-ssm.sh

echo "⏳ Esperando 30 segundos para que el backend esté listo..."
sleep 30

echo "🗄️ Paso 2: Deploy Base de Datos..."
./scripts/deploy-database-ssm.sh

echo "⏳ Esperando 30 segundos para que la base de datos esté lista..."
sleep 30

echo "🌐 Paso 3: Deploy Frontend + Nginx..."
./scripts/deploy-frontend-ssm.sh

echo "⏳ Esperando 30 segundos para que el frontend esté listo..."
sleep 30

echo "🎉 Deploy completo finalizado!"
echo ""
echo "🌐 TienditaCampus está disponible en:"
echo "   Frontend: http://98.82.69.208"
echo "   Backend API: http://98.92.47.235:3001"
echo "   Base de Datos: 172.31.74.10:5432"
echo ""
echo "📊 Estado de las instancias:"
aws ec2 describe-instances \
    --instance-ids "$BACKEND_INSTANCE" "$FRONTEND_INSTANCE" "$DATABASE_INSTANCE" \
    --region "$REGION" \
    --query 'Reservations[*].Instances[*].[InstanceId,State.Name,PublicIpAddress]' \
    --output table

echo ""
echo "🔍 Para verificar el estado de los comandos:"
echo "aws ssm list-commands --region $REGION --max-items 10"
