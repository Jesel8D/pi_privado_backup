#!/usr/bin/env node

const AWSDeployer = require('./aws-deploy');
const ElasticIPManager = require('./elastic-ip-manager');

class AWSDeployerWithElasticIP extends AWSDeployer {
  constructor(config) {
    super(config);

    this.ipManager = new ElasticIPManager({
      domain: config.domain || 'midominio.com',
      hostedZoneId: config.hostedZoneId,
      projectsDB: config.projectsDB || 'elastic-ips.json'
    });
  }

  async deployComplete(zipPath, projectName, instanceId) {
    try {
      console.log('\n' + '═'.repeat(70));
      console.log('🚀 DEPLOYMENT CON IP ELÁSTICA');
      console.log('═'.repeat(70));

      // 1. Deployment normal
      const result = await super.deployComplete(zipPath, projectName);

      if (result.status === 'Success') {
        // 2. Asignar IP Elástica
        console.log('\n\n' + '═'.repeat(70));
        console.log('🌐 CONFIGURANDO IP ELÁSTICA');
        console.log('═'.repeat(70));

        const projectIP = await this.ipManager.setupProjectIP(
          projectName,
          instanceId || this.config.instanceId
        );

        return {
          ...result,
          elasticIP: projectIP.elasticIP,
          domain: projectIP.domain,
          urls: {
            http: `http://${projectIP.elasticIP}`,
            https: `https://${projectIP.domain}`
          }
        };
      }

      return result;

    } catch (error) {
      console.error('❌ Error:', error.message);
      throw error;
    }
  }
}

module.exports = AWSDeployerWithElasticIP;
