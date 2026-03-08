const RepoManager = require('./repo-manager');
const TestExecutor = require('./test-executor');
const AIAnalyzer = require('./ai-analyzer');
const CodeFixer = require('./code-fixer');
const AWSDeployerWithElasticIP = require('./aws-deploy-con-elasticip');
const fs = require('fs');
const path = require('path');

const CONFIG_PATH = path.join(__dirname, 'soa-config.json');
const DB_PATH = path.join(__dirname, 'projects-db.json');

class AutoHealingOrchestrator {
  constructor() {
    // Load configuration and database
    this.config = this.loadConfig();
    this.projectsDb = this.loadDatabase();
    this.iteration = 0;
    
    this.repoManager = new RepoManager(this.config.environment);
  }

  /**
   * Load configuration from soa-config.json
   */
  loadConfig() {
    try {
      const configData = fs.readFileSync(CONFIG_PATH, 'utf8');
      return JSON.parse(configData);
    } catch (error) {
      console.error('❌ Error loading config:', error.message);
      // Return default config
      return {
        environment: { ollama: { url: 'http://localhost:11434' }, workspace: { basePath: '/tmp/soa-workspace' } },
        models: { default: 'deepseek-coder:6.7b' },
        projectDefaults: { maxIterations: 5, autoFix: true }
      };
    }
  }

  /**
   * Load projects database from projects-db.json
   */
  loadDatabase() {
    try {
      const dbData = fs.readFileSync(DB_PATH, 'utf8');
      return JSON.parse(dbData);
    } catch (error) {
      console.error('❌ Error loading database:', error.message);
      // Return empty DB
      return {
        version: '1.0',
        projects: [],
        schedules: [],
        statistics: { summary: { totalProjects: 0 } },
        lastUpdated: new Date().toISOString()
      };
    }
  }

  /**
   * Save projects database to projects-db.json
   */
  saveDatabase() {
    try {
      this.projectsDb.lastUpdated = new Date().toISOString();
      fs.writeFileSync(DB_PATH, JSON.stringify(this.projectsDb, null, 2), 'utf8');
      console.log('💾 Base de datos guardada exitosamente');
    } catch (error) {
      console.error('❌ Error saving database:', error.message);
    }
  }

  /**
   * Update project in database
   */
  updateProjectInDb(repoUrl, result) {
    const projectId = `proj-${Date.now()}-${repoUrl.split('/').pop().replace('.git', '')}`;
    let project = this.projectsDb.projects.find(p => p.url === repoUrl);
    if (!project) {
      project = {
        id: projectId,
        name: repoUrl.split('/').pop().replace('.git', ''),
        url: repoUrl,
        status: result.status,
        createdAt: new Date().toISOString(),
        lastHealed: new Date().toISOString(),
        healingHistory: []
      };
      this.projectsDb.projects.push(project);
    }
    
    project.healingHistory.push({
      date: new Date().toISOString(),
      status: result.status,
      iterations: result.iterations,
      fixesApplied: result.fixes ? result.fixes.length : 0,
      testResults: result.results,
      duration: result.duration,
      details: result.details
    });
    
    // Update statistics
    this.updateStatistics(result);
  }

  /**
   * Update global statistics
   */
  updateStatistics(result) {
    const stats = this.projectsDb.statistics;
    stats.summary.totalProjects = this.projectsDb.projects.length;
    if (result.status === 'healed') {
      stats.healing.successfulHealings++;
    }
    stats.healing.totalHealings++;
  }

  /**
   * FLUJO PRINCIPAL: Descarga, Prueba, Analiza, Corrige
   */
  async healRepository(repoUrl, branch = 'main') {
    console.log('\n' + '═'.repeat(70));
    console.log('🏥 INICIANDO SISTEMA DE AUTO-CURACIÓN SOA');
    console.log('═'.repeat(70));

    try {
      // 1. DESCARGAR REPO
      console.log('\n📥 FASE 1: Descargando Repositorio...');
      this.currentRepo = await this.repoManager.cloneRepo(repoUrl, branch);

      // 2. EJECUTAR TESTS INICIALES
      console.log('\n🧪 FASE 2: Ejecutando Tests Iniciales...');
      const testExecutor = new TestExecutor(this.currentRepo);
      const initialResults = await testExecutor.runAllTests();

      // Si todos pasan, nos vamos
      if (initialResults.failed === 0) {
        console.log('\n✅ ¡TODOS LOS TESTS PASAN! El proyecto está sano.');
        return {
          status: 'healthy',
          iterations: 0,
          results: initialResults
        };
      }

      // 3. ITERAR HASTA FIJAR TODOS LOS TESTS
      console.log('\n🔄 FASE 3: Iterando Auto-Fixes...');
      const analyzer = new AIAnalyzer(this.config.environment.ollama.url, this.config.models.default);
      const fixer = new CodeFixer(this.currentRepo);

      while (this.iteration < this.config.maxIterations && initialResults.failed > 0) {
        this.iteration++;
        console.log(`\n${'─'.repeat(70)}`);
        console.log(`🔁 ITERACIÓN ${this.iteration}/${this.config.maxIterations}`);
        console.log(`${'─'.repeat(70)}`);

        // Analizar fallos
        const failedTests = testExecutor.getFailedTests();
        if (failedTests.length === 0) break;

        const analyses = await analyzer.analyzeMultipleFailures(failedTests);

        // Aplicar fixes
        let fixCount = 0;
        for (let i = 0; i < analyses.length && i < failedTests.length; i++) {
          const analysis = analyses[i];
          const failedTest = failedTests[i];

          if (analysis) {
            console.log(`\n${analysis.aiAnalysis}`);

            // Generar y aplicar fix
            const sourceCode = this.getServiceSourceCode(failedTest.service);
            const fixedCode = await analyzer.generateFixRecommendation(
              failedTest,
              analysis.aiAnalysis,
              sourceCode
            );

            if (fixedCode && this.config.autoFix) {
              const applied = await fixer.applyFix(failedTest, fixedCode);
              if (applied) fixCount++;
            }
          }
        }

        console.log(`\n✅ ${fixCount} fixes aplicados`);

        // Re-ejecutar tests
        console.log(`\n🧪 Ejecutando tests nuevamente...`);
        const newResults = await testExecutor.runAllTests();

        // Verificar progreso
        if (newResults.failed < initialResults.failed) {
          console.log(`✅ PROGRESO: Menos fallos (${newResults.failed} vs ${initialResults.failed})`);
          Object.assign(initialResults, newResults);
        } else if (newResults.failed === 0) {
          console.log(`🎉 ¡ÉXITO! Todos los tests pasan.`);
          break;
        } else {
          console.log(`⚠️  Sin progreso, saliendo...`);
          break;
        }
      }

      // 4. REPORTE FINAL
      console.log('\n' + '═'.repeat(70));
      console.log('📊 REPORTE FINAL');
      console.log('═'.repeat(70));

      const finalStatus = initialResults.failed === 0 ? 'healed' : 'partial';
      
      console.log(`Status: ${finalStatus}`);
      console.log(`Iteraciones: ${this.iteration}/${this.config.maxIterations}`);
      console.log(`Tests: ${initialResults.passed} ✅ / ${initialResults.failed} ❌`);
      console.log(`Fixes aplicados: ${fixer.appliedFixes.length}`);
      console.log(`Duración total: ${(initialResults.duration / 1000).toFixed(2)}s`);

      // 5. PUSH A REPO (opcional)
      if (this.config.pushChanges && finalStatus === 'healed') {
        console.log('\n📤 Pusheando cambios...');
        await this.pushChanges(fixer.appliedFixes);
      }

      // 6. DEPLOYMENT A AWS (opcional)
      if (this.config.aws && this.config.aws.enabled && result.status === 'healed') {
        console.log('\n🚀 FASE 6: Deploying to AWS...');
        const deployer = new AWSDeployerWithElasticIP({
          bucketName: this.config.aws.s3.bucketName,
          instanceId: this.config.aws.ec2.instanceId,
          domain: this.config.aws.elasticIP.domain,
          hostedZoneId: this.config.aws.elasticIP.hostedZoneId
        });

        // Crear ZIP del repo
        const zipPath = await this.createZip(this.currentRepo.path, `${this.currentRepo.name}-deploy.zip`);

        // Deploy
        const deployResult = await deployer.deployComplete(zipPath, this.currentRepo.name, this.config.aws.ec2.instanceId);

        // Guardar URLs
        result.elasticIP = deployResult.elasticIP;
        result.domain = deployResult.domain;
        result.urls = deployResult.urls;

        // Actualizar DB
        const project = this.projectsDb.projects.find(p => p.url === repoUrl);
        if (project) {
          project.elasticIP = deployResult.elasticIP;
          project.domain = deployResult.domain;
          project.urls = deployResult.urls;
          project.deployedAt = new Date().toISOString();
        }

        this.saveDatabase();
      }

      return {
        status: finalStatus,
        iterations: this.iteration,
        results: initialResults,
        fixes: fixer.appliedFixes
      };

    } catch (error) {
      console.error(`
❌ ERROR FATAL: ${error.message}`);
      throw error;
    } finally {
      // Limpieza
      if (this.config.environment.workspace.cleanupAfter) {
        this.repoManager.cleanup();
      }
    }
  }

  /**
   * Save result to database
   */
  saveResult(repoUrl, result) {
    this.updateProjectInDb(repoUrl, result);
    this.saveDatabase();
  }

  /**
   * Obtiene código fuente de un servicio
   */
  getServiceSourceCode(serviceName) {
    const service = this.currentRepo.services.find(s => s.name === serviceName);
    if (!service) return '';

    const fs = require('fs-extra');
    const path = require('path');

    try {
      const mainFile = path.join(service.path, service.main || 'index.js');
      if (fs.existsSync(mainFile)) {
        return fs.readFileSync(mainFile, 'utf8').substring(0, 1000);
      }
    } catch (error) {
      // Ignorar
    }

    return '';
  }

  /**
   * Push cambios a repo
   */
  async pushChanges(fixes) {
    // Implementación básica
    const { execSync } = require('child_process');
    const repoPath = this.currentRepo.path;

    try {
      execSync('git add .', { cwd: repoPath });
      execSync('git commit -m "🤖 Auto-fixes by AI"', { cwd: repoPath });
      execSync('git push origin ' + this.currentRepo.branch, { cwd: repoPath });
      console.log('✅ Cambios pushed exitosamente');
    } catch (error) {
      console.warn(`⚠️  No se pudieron pushear cambios: ${error.message}`);
    }
  }

  async createZip(sourceDir, zipFileName) {
    const { execSync } = require('child_process');
    const path = require('path');
    const zipPath = path.join(this.config.environment.workspace.basePath, zipFileName);
    const command = `powershell -command "Compress-Archive -Path '${sourceDir}' -DestinationPath '${zipPath}' -Force"`;
    execSync(command);
    return zipPath;
  }
}

module.exports = AutoHealingOrchestrator;
