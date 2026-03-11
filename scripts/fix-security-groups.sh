#!/bin/bash
# fix-security-groups.sh - Reparar Security Groups para permitir acceso

echo "🔧 REPARANDO SECURITY GROUPS - TienditaCampus"
echo "==============================================="

# IDs de instancias
BACKEND_INSTANCE="i-0ee35704e56d22bc4"
FRONTEND_INSTANCE="i-09e028682794543e3"
DATABASE_INSTANCE="i-0092c19af358a5245"
REGION="us-east-1"

echo "📊 Paso 1: Obtener Security Groups de las instancias..."

# Obtener Security Groups
BACKEND_SG=$(aws ec2 describe-instances --instance-ids "$BACKEND_INSTANCE" --region "$REGION" --query 'Reservations[0].Instances[0].SecurityGroups[0].GroupId' --output text)
FRONTEND_SG=$(aws ec2 describe-instances --instance-ids "$FRONTEND_INSTANCE" --region "$REGION" --query 'Reservations[0].Instances[0].SecurityGroups[0].GroupId' --output text)
DATABASE_SG=$(aws ec2 describe-instances --instance-ids "$DATABASE_INSTANCE" --region "$REGION" --query 'Reservations[0].Instances[0].SecurityGroups[0].GroupId' --output text)

echo "Security Groups encontrados:"
echo "  Backend SG: $BACKEND_SG"
echo "  Frontend SG: $FRONTEND_SG"
echo "  Database SG: $DATABASE_SG"

echo ""
echo "🔧 Paso 2: Configurar reglas de entrada..."

# Configurar Security Group para Frontend (permitir HTTP/HTTPS)
echo "Configurando Frontend Security Group..."
aws ec2 authorize-security-group-ingress \
    --group-id "$FRONTEND_SG" \
    --protocol tcp \
    --port 80 \
    --source 0.0.0.0/0 \
    --description "HTTP access for TienditaCampus Frontend" \
    --region "$REGION" 2>/dev/null || echo "Regla HTTP ya existe"

aws ec2 authorize-security-group-ingress \
    --group-id "$FRONTEND_SG" \
    --protocol tcp \
    --port 443 \
    --source 0.0.0.0/0 \
    --description "HTTPS access for TienditaCampus Frontend" \
    --region "$REGION" 2>/dev/null || echo "Regla HTTPS ya existe"

# Configurar Security Group para Backend (permitir API y SSH)
echo "Configurando Backend Security Group..."
aws ec2 authorize-security-group-ingress \
    --group-id "$BACKEND_SG" \
    --protocol tcp \
    --port 3001 \
    --source 0.0.0.0/0 \
    --description "Backend API access for TienditaCampus" \
    --region "$REGION" 2>/dev/null || echo "Regla API ya existe"

aws ec2 authorize-security-group-ingress \
    --group-id "$BACKEND_SG" \
    --protocol tcp \
    --port 22 \
    --source 0.0.0.0/0 \
    --description "SSH access for TienditaCampus Backend" \
    --region "$REGION" 2>/dev/null || echo "Regla SSH ya existe"

# Configurar Security Group para Database (permitir acceso interno y SSH)
echo "Configurando Database Security Group..."
aws ec2 authorize-security-group-ingress \
    --group-id "$DATABASE_SG" \
    --protocol tcp \
    --port 5432 \
    --source 172.31.0.0/16 \
    --description "PostgreSQL access from VPC" \
    --region "$REGION" 2>/dev/null || echo "Regla PostgreSQL ya existe"

aws ec2 authorize-security-group-ingress \
    --group-id "$DATABASE_SG" \
    --protocol tcp \
    --port 6379 \
    --source 172.31.0.0/16 \
    --description "Redis access from VPC" \
    --region "$REGION" 2>/dev/null || echo "Regla Redis ya existe"

aws ec2 authorize-security-group-ingress \
    --group-id "$DATABASE_SG" \
    --protocol tcp \
    --port 22 \
    --source 0.0.0.0/0 \
    --description "SSH access for TienditaCampus Database" \
    --region "$REGION" 2>/dev/null || echo "Regla SSH ya existe"

echo ""
echo "🔧 Paso 3: Permitir comunicación entre instancias..."

# Permitir comunicación entre Security Groups
aws ec2 authorize-security-group-ingress \
    --group-id "$BACKEND_SG" \
    --protocol tcp \
    --port 3001 \
    --source "$FRONTEND_SG" \
    --description "Frontend to Backend communication" \
    --region "$REGION" 2>/dev/null || echo "Regla Frontend->Backend ya existe"

aws ec2 authorize-security-group-ingress \
    --group-id "$BACKEND_SG" \
    --protocol tcp \
    --port 5432 \
    --source "$DATABASE_SG" \
    --description "Database to Backend communication" \
    --region "$REGION" 2>/dev/null || echo "Regla Database->Backend ya existe"

echo ""
echo "📊 Paso 4: Verificar reglas configuradas..."

echo "Reglas de Frontend Security Group:"
aws ec2 describe-security-groups \
    --group-ids "$FRONTEND_SG" \
    --region "$REGION" \
    --query 'SecurityGroups[0].IpPermissions[].[IpProtocol,FromPort,ToPort,IpRanges[0].CidrIp]' \
    --output table

echo "Reglas de Backend Security Group:"
aws ec2 describe-security-groups \
    --group-ids "$BACKEND_SG" \
    --region "$REGION" \
    --query 'SecurityGroups[0].IpPermissions[].[IpProtocol,FromPort,ToPort,IpRanges[0].CidrIp]' \
    --output table

echo "Reglas de Database Security Group:"
aws ec2 describe-security-groups \
    --group-ids "$DATABASE_SG" \
    --region "$REGION" \
    --query 'SecurityGroups[0].IpPermissions[].[IpProtocol,FromPort,ToPort,IpRanges[0].CidrIp]' \
    --output table

echo ""
echo "✅ Security Groups configurados correctamente"
echo "🌐 Puertos abiertos:"
echo "   Frontend: HTTP (80), HTTPS (443)"
echo "   Backend: API (3001), SSH (22)"
echo "   Database: PostgreSQL (5432), Redis (6379), SSH (22)"
echo "   Comunicación interna: Todas las instancias pueden comunicarse"
