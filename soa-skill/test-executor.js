const { execSync } = require('child_process');
const fs = require('fs-extra');
const path = require('path');

class TestExecutor {
  constructor(repo) {
    this.repo = repo;
    this.results = [];
    this.failedTests = [];
  }

  /**
   * Ejecuta todos los tests del proyecto
   */
  async runAllTests() {
    console.log('\n🧪 Iniciando ejecución de tests...');
    
    const results = {
      totalTests: 0,
      passed: 0,
      failed: 0,
      skipped: 0,
      duration: 0,
      details: []
    };

    const startTime = Date.now();

    // Por cada servicio
    for (const service of this.repo.services) {
      console.log(`\n📦 Ejecutando tests en: ${service.name}`);
      
      try {
        if (service.type === 'nodejs') {
          await this.runNodeTests(service, results);
        } else if (service.type === 'python') {
          await this.runPythonTests(service, results);
        } else if (service.type === 'java') {
          await this.runJavaTests(service, results);
        }
      } catch (error) {
        console.error(`❌ Error en ${service.name}: ${error.message}`);
        results.failed++;
        results.details.push({
          service: service.name,
          status: 'error',
          error: error.message
        });
      }
    }

    results.duration = Date.now() - startTime;
    this.results = results;

    // Resumen
    this.printSummary(results);

    return results;
  }

  /**
   * Ejecuta tests de Node.js
   */
  async runNodeTests(service, results) {
    const cwd = service.path;
    const pkgJson = JSON.parse(fs.readFileSync(path.join(cwd, 'package.json'), 'utf8'));
    
    // Detectar script de test
    const testCommand = pkgJson.scripts?.test || 'npm test';

    try {
      console.log(`  ⚙️  Ejecutando: ${testCommand}`);
      const output = execSync(testCommand, {
        cwd,
        encoding: 'utf8',
        stdio: 'pipe'
      });

      console.log(`  ✅ Tests pasados en ${service.name}`);
      results.passed++;
      results.details.push({
        service: service.name,
        status: 'passed',
        output: output.substring(0, 500)
      });

    } catch (error) {
      console.log(`  ❌ Tests fallidos en ${service.name}`);
      results.failed++;
      
      const errorOutput = error.stdout || error.stderr || error.message;
      results.details.push({
        service: service.name,
        status: 'failed',
        error: errorOutput.substring(0, 1000),
        fullError: errorOutput
      });

      this.failedTests.push({
        service: service.name,
        error: errorOutput,
        type: 'nodejs'
      });
    }

    results.totalTests++;
  }

  /**
   * Ejecuta tests de Python
   */
  async runPythonTests(service, results) {
    const cwd = service.path;
    
    try {
      console.log(`  ⚙️  Ejecutando: pytest`);
      const output = execSync('pytest -v --tb=short', {
        cwd,
        encoding: 'utf8',
        stdio: 'pipe'
      });

      console.log(`  ✅ Tests pasados en ${service.name}`);
      results.passed++;
      results.details.push({
        service: service.name,
        status: 'passed',
        output: output.substring(0, 500)
      });

    } catch (error) {
      console.log(`  ❌ Tests fallidos en ${service.name}`);
      results.failed++;
      
      const errorOutput = error.stdout || error.stderr || error.message;
      results.details.push({
        service: service.name,
        status: 'failed',
        error: errorOutput.substring(0, 1000),
        fullError: errorOutput
      });

      this.failedTests.push({
        service: service.name,
        error: errorOutput,
        type: 'python'
      });
    }

    results.totalTests++;
  }

  /**
   * Ejecuta tests de Java
   */
  async runJavaTests(service, results) {
    const cwd = service.path;
    
    try {
      console.log(`  ⚙️  Ejecutando: mvn test`);
      const output = execSync('mvn test -DskipTests=false', {
        cwd,
        encoding: 'utf8',
        stdio: 'pipe'
      });

      console.log(`  ✅ Tests pasados en ${service.name}`);
      results.passed++;

    } catch (error) {
      console.log(`  ❌ Tests fallidos en ${service.name}`);
      results.failed++;
      
      const errorOutput = error.stdout || error.stderr || error.message;
      results.details.push({
        service: service.name,
        status: 'failed',
        error: errorOutput.substring(0, 1000),
        fullError: errorOutput
      });

      this.failedTests.push({
        service: service.name,
        error: errorOutput,
        type: 'java'
      });
    }

    results.totalTests++;
  }

  /**
   * Imprime resumen de tests
   */
  printSummary(results) {
    console.log('\n' + '═'.repeat(60));
    console.log('📊 RESUMEN DE TESTS');
    console.log('═'.repeat(60));
    console.log(`Total: ${results.totalTests} | ✅ Pasados: ${results.passed} | ❌ Fallidos: ${results.failed}`);
    console.log(`⏱️  Duración: ${(results.duration / 1000).toFixed(2)}s`);
    console.log('═'.repeat(60) + '\n');

    if (results.failed > 0) {
      console.log('⚠️  Tests fallidos detectados');
      console.log('🤖 Analizando con IA...\n');
    }
  }

  /**
   * Obtiene tests fallidos
   */
  getFailedTests() {
    return this.failedTests;
  }
}

module.exports = TestExecutor;
