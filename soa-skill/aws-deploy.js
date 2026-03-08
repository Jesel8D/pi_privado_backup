#!/usr/bin/env node

const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');

class AWSDeployer {
  constructor(config) {
    this.config = {
      region: config.region || 'us-east-1',
      bucketName: config.bucketName,
      instanceId: config.instanceId,
      ...config
    };

    AWS.config.update({
      region: this.config.region
    });

    this.s3 = new AWS.S3();
    this.ec2 = new AWS.EC2();
  }

  async deployComplete(zipPath, projectName) {
    try {
      console.log('\n' + '═'.repeat(70));
      console.log('🚀 DEPLOYMENT AWS');
      console.log('═'.repeat(70));

      // 1. Verificar archivo ZIP
      if (!fs.existsSync(zipPath)) {
        throw new Error(`Archivo ZIP no encontrado: ${zipPath}`);
      }

      // 2. Subir a S3
      const key = `${projectName}-${Date.now()}.zip`;
      console.log(`\n📤 Subiendo ${zipPath} a S3...`);
      await this.uploadToS3(zipPath, key);

      // 3. Desplegar en EC2
      console.log(`\n🖥️  Desplegando en EC2 instancia: ${this.config.instanceId}`);
      await this.deployToEC2(key, projectName);

      console.log('\n' + '═'.repeat(70));
      console.log('✅ DEPLOYMENT COMPLETADO');
      console.log('═'.repeat(70));

      return {
        status: 'Success',
        bucket: this.config.bucketName,
        key: key,
        instanceId: this.config.instanceId,
        projectName: projectName
      };

    } catch (error) {
      console.error('❌ Error en deployment:', error.message);
      return {
        status: 'Failed',
        error: error.message
      };
    }
  }

  async uploadToS3(filePath, key) {
    const fileContent = fs.readFileSync(filePath);

    const params = {
      Bucket: this.config.bucketName,
      Key: key,
      Body: fileContent,
      ContentType: 'application/zip'
    };

    const result = await this.s3.upload(params).promise();
    console.log(`✅ Subido a S3: s3://${this.config.bucketName}/${key}`);

    return result;
  }

  async deployToEC2(s3Key, projectName) {
    const s3Url = `s3://${this.config.bucketName}/${s3Key}`;

    // Script para ejecutar en EC2
    const deployScript = `
#!/bin/bash
echo "Iniciando deployment..."

# Crear directorio temporal
TEMP_DIR="/tmp/deploy-${projectName}"
mkdir -p $TEMP_DIR
cd $TEMP_DIR

# Descargar del S3
aws s3 cp ${s3Url} app.zip

# Descomprimir
unzip app.zip
rm app.zip

# Instalar dependencias (ajustar según proyecto)
if [ -f package.json ]; then
  npm install
elif [ -f requirements.txt ]; then
  pip install -r requirements.txt
fi

# Ejecutar aplicación (ajustar según proyecto)
if [ -f package.json ]; then
  npm start &
elif [ -f app.py ]; then
  python app.py &
fi

echo "Deployment completado en EC2"
    `;

    const params = {
      InstanceIds: [this.config.instanceId],
      DocumentName: 'AWS-RunShellScript',
      Parameters: {
        commands: [deployScript],
        executionTimeout: ['3600']  // 1 hora
      }
    };

    const result = await this.ec2.sendCommand(params).promise();
    console.log(`✅ Comando enviado a EC2. Command ID: ${result.Command.CommandId}`);

    return result;
  }
}

module.exports = AWSDeployer;
