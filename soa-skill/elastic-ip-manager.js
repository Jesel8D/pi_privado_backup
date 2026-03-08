#!/usr/bin/env node

const AWS = require('aws-sdk');
const fs = require('fs');

AWS.config.update({
  region: 'us-east-1'
});

const ec2 = new AWS.EC2();
const route53 = new AWS.Route53();

class ElasticIPManager {
  constructor(config) {
    this.config = {
      domain: config.domain || 'midominio.com',
      hostedZoneId: config.hostedZoneId,  // De Route53
      projectsDB: 'elastic-ips.json',
      ...config
    };

    this.loadDatabase();
  }

  // Cargar BD de IPs
  loadDatabase() {
    try {
      this.db = JSON.parse(fs.readFileSync(this.config.projectsDB, 'utf8'));
    } catch {
      this.db = { projects: [], ips: [] };
      this.saveDatabase();
    }
  }

  // Guardar BD
  saveDatabase() {
    fs.writeFileSync(
      this.config.projectsDB,
      JSON.stringify(this.db, null, 2)
    );
  }

  // 1. Crear IP Elástica para proyecto
  async allocateElasticIP(projectName) {
    console.log(`\n📍 Asignando IP Elástica para: ${projectName}`);

    try {
      // Verificar si ya existe IP para este proyecto
      const existing = this.db.projects.find(p => p.name === projectName);
      if (existing) {
        console.log(`✅ IP Elástica ya existe: ${existing.elasticIP}`);
        return existing;
      }

      // Crear nueva IP Elástica
      const params = {
        Domain: 'vpc',
        TagSpecifications: [
          {
            ResourceType: 'elastic-ip',
            Tags: [
              { Key: 'Name', Value: `${projectName}-ip` },
              { Key: 'Project', Value: projectName }
            ]
          }
        ]
      };

      const result = await ec2.allocateAddress(params).promise();

      const projectData = {
        name: projectName,
        elasticIP: result.PublicIp,
        allocationId: result.AllocationId,
        createdAt: new Date().toISOString(),
        status: 'unassigned',
        instanceId: null,
        domain: `${projectName}.${this.config.domain}`,
        dnsStatus: 'pending'
      };

      this.db.projects.push(projectData);
      this.saveDatabase();

      console.log(`✅ IP Elástica creada: ${result.PublicIp}`);
      console.log(`📍 Asignación ID: ${result.AllocationId}`);
      console.log(`🌐 Dominio: ${projectData.domain}`);

      return projectData;

    } catch (error) {
      console.error('❌ Error asignando IP:', error.message);
      throw error;
    }
  }

  // 2. Asociar IP a instancia EC2
  async associateIPToInstance(projectName, instanceId) {
    console.log(`\n🔗 Asociando IP a instancia: ${instanceId}`);

    try {
      const project = this.db.projects.find(p => p.name === projectName);
      if (!project) {
        throw new Error(`Proyecto no encontrado: ${projectName}`);
      }

      const params = {
        AllocationId: project.allocationId,
        InstanceId: instanceId
      };

      const result = await ec2.associateAddress(params).promise();

      // Actualizar BD
      project.instanceId = instanceId;
      project.status = 'assigned';
      project.associationId = result.AssociationId;
      project.updateAt = new Date().toISOString();
      this.saveDatabase();

      console.log(`✅ IP asociada a instancia`);
      console.log(`🌍 Accede a: http://${project.elasticIP}`);

      return project;

    } catch (error) {
      console.error('❌ Error asociando IP:', error.message);
      throw error;
    }
  }

  // 3. Crear registro DNS en Route53
  async createDNSRecord(projectName, elasticIP) {
    console.log(`\n🌐 Creando registro DNS: ${projectName}`);

    try {
      const subdomain = `${projectName}.${this.config.domain}`;

      const params = {
        HostedZoneId: this.config.hostedZoneId,
        ChangeBatch: {
          Changes: [
            {
              Action: 'CREATE',
              ResourceRecordSet: {
                Name: subdomain,
                Type: 'A',
                TTL: 300,
                ResourceRecords: [
                  { Value: elasticIP }
                ]
              }
            }
          ]
        }
      };

      const result = await route53.changeResourceRecordSets(params).promise();

      // Actualizar BD
      const project = this.db.projects.find(p => p.name === projectName);
      if (project) {
        project.dnsStatus = 'created';
        project.dnChangeId = result.ChangeInfo.Id;
        this.saveDatabase();
      }

      console.log(`✅ Registro DNS creado`);
      console.log(`🌍 Accede a: https://${subdomain}`);
      console.log(`⏱️  DNS se propaga en 5-10 minutos`);

      return result;

    } catch (error) {
      console.error('❌ Error creando DNS:', error.message);
      throw error;
    }
  }

  // 4. Flujo completo: Asignar IP + DNS a nuevo repo
  async setupProjectIP(projectName, instanceId) {
    try {
      console.log('\n' + '═'.repeat(60));
      console.log(`🚀 CONFIGURANDO IP ELÁSTICA PARA: ${projectName}`);
      console.log('═'.repeat(60));

      // 1. Asignar IP
      const projectData = await this.allocateElasticIP(projectName);

      // 2. Asociar a instancia
      await this.associateIPToInstance(projectName, instanceId);

      // 3. Crear DNS
      await this.createDNSRecord(projectName, projectData.elasticIP);

      console.log('\n' + '═'.repeat(60));
      console.log('✅ IP ELÁSTICA COMPLETAMENTE CONFIGURADA');
      console.log('═'.repeat(60));
      console.log(`\n📊 INFORMACIÓN DEL PROYECTO:`);
      console.log(`  Nombre: ${projectName}`);
      console.log(`  IP Elástica: ${projectData.elasticIP}`);
      console.log(`  Dominio: ${projectData.domain}`);
      console.log(`  Instancia: ${instanceId}`);
      console.log(`\n🌐 ACCESO:`);
      console.log(`  HTTP: http://${projectData.elasticIP}`);
      console.log(`  HTTPS: https://${projectData.domain}`);
      console.log(`\n💾 Guardado en: ${this.config.projectsDB}`);

      return projectData;

    } catch (error) {
      console.error('\n❌ ERROR:', error.message);
      throw error;
    }
  }

  // 5. Listar todos los proyectos y sus IPs
  listProjects() {
    console.log('\n' + '═'.repeat(70));
    console.log('📊 PROYECTOS DEPLOYADOS');
    console.log('═'.repeat(70) + '\n');

    if (this.db.projects.length === 0) {
      console.log('Sin proyectos aún\n');
      return;
    }

    this.db.projects.forEach((project, index) => {
      console.log(`${index + 1}. ${project.name}`);
      console.log(`   IP Elástica: ${project.elasticIP}`);
      console.log(`   Dominio: ${project.domain}`);
      console.log(`   Estado: ${project.status}`);
      console.log(`   Instancia: ${project.instanceId || 'No asignada'}`);
      console.log(`   Creado: ${project.createdAt}`);
      console.log('');
    });

    console.log('═'.repeat(70) + '\n');
  }

  // 6. Obtener info de proyecto
  getProject(projectName) {
    return this.db.projects.find(p => p.name === projectName);
  }

  // 7. Reasignar IP a nueva instancia (en caso de redeployment)
  async reassignIP(projectName, newInstanceId) {
    console.log(`\n🔄 Reasignando IP a nueva instancia: ${newInstanceId}`);

    try {
      const project = this.db.projects.find(p => p.name === projectName);
      if (!project) throw new Error(`Proyecto no encontrado: ${projectName}`);

      // Desasociar IP vieja
      if (project.associationId) {
        await ec2.disassociateAddress({
          AssociationId: project.associationId
        }).promise();
        console.log('✅ IP desasociada de instancia anterior');
      }

      // Asociar a nueva instancia
      await this.associateIPToInstance(projectName, newInstanceId);
      console.log(`✅ IP reasignada a instancia: ${newInstanceId}`);

      return this.getProject(projectName);

    } catch (error) {
      console.error('❌ Error reasignando IP:', error.message);
      throw error;
    }
  }
}

module.exports = ElasticIPManager;
