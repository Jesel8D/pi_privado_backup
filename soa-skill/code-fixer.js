const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');

class CodeFixer {
  constructor(repo) {
    this.repo = repo;
    this.appliedFixes = [];
  }

  /**
   * Aplica un fix al código
   */
  async applyFix(failedTest, fixedCode) {
    console.log(`🔧 Aplicando fix en ${failedTest.service}...`);

    try {
      // Encontrar archivo a corregir
      const service = this.repo.services.find(s => s.name === failedTest.service);
      if (!service) {
        throw new Error(`Servicio no encontrado: ${failedTest.service}`);
      }

      // Detectar archivos de test
      const filesToFix = this.findFilesToFix(service, failedTest);

      if (filesToFix.length === 0) {
        throw new Error(`No se encontraron archivos para corregir`);
      }

      // Aplicar fixes
      for (const file of filesToFix) {
        console.log(`  📝 Actualizando: ${path.relative(service.path, file)}`);
        
        // Backup
        const backup = file + '.backup';
        fs.copySync(file, backup);

        // Escribir fix
        fs.writeFileSync(file, fixedCode);

        this.appliedFixes.push({
          file,
          service: failedTest.service,
          timestamp: new Date(),
          backup
        });

        console.log(`  ✅ Actualizado`);
      }

      return true;
    } catch (error) {
      console.error(`❌ Error aplicando fix: ${error.message}`);
      return false;
    }
  }

  /**
   * Encuentra archivos a corregir basado en el fallo
   */
  findFilesToFix(service, failedTest) {
    const files = [];
    const baseDir = service.path;

    // Estrategia 1: Buscar archivos de test fallido
    const testDirs = this.findTestDirs(baseDir);
    for (const testDir of testDirs) {
      const testFiles = this.getFilesInDir(testDir, service.type === 'nodejs' ? '.test.js' : '_test.py');
      files.push(...testFiles);
    }

    // Estrategia 2: Buscar archivos source que fallan
    if (failedTest.error.includes('not found') || failedTest.error.includes('undefined')) {
      const srcDirs = this.findSourceDirs(baseDir);
      for (const srcDir of srcDirs) {
        const srcFiles = this.getFilesInDir(srcDir, service.type === 'nodejs' ? '.js' : '.py');
        files.push(...srcFiles.slice(0, 3)); // Limitar a 3 primeros
      }
    }

    return [...new Set(files)]; // Eliminar duplicados
  }

  findTestDirs(baseDir) {
    const testDirs = [];
    const testPatterns = ['test', 'tests', '__tests__', 'spec', 'specs'];
    
    try {
      const items = fs.readdirSync(baseDir, { withFileTypes: true });
      for (const item of items) {
        if (item.isDirectory() && testPatterns.includes(item.name)) {
          testDirs.push(path.join(baseDir, item.name));
        }
      }
    } catch (error) {
      // Ignorar errores
    }

    return testDirs;
  }

  findSourceDirs(baseDir) {
    const srcDirs = [];
    const srcPatterns = ['src', 'lib', 'app', 'source'];
    
    try {
      const items = fs.readdirSync(baseDir, { withFileTypes: true });
      for (const item of items) {
        if (item.isDirectory() && srcPatterns.includes(item.name)) {
          srcDirs.push(path.join(baseDir, item.name));
        }
      }
    } catch (error) {
      // Ignorar errores
    }

    return srcDirs;
  }

  getFilesInDir(dir, extension) {
    const files = [];
    
    try {
      const items = fs.readdirSync(dir);
      for (const item of items) {
        if (item.endsWith(extension)) {
          files.push(path.join(dir, item));
        }
      }
    } catch (error) {
      // Ignorar
    }

    return files;
  }

  /**
   * Revierte un fix
   */
  revertFix(fixIndex) {
    if (fixIndex >= 0 && fixIndex < this.appliedFixes.length) {
      const fix = this.appliedFixes[fixIndex];
      fs.copySync(fix.backup, fix.file);
      console.log(`⏮️  Fix revertido: ${fix.file}`);
      return true;
    }
    return false;
  }

  /**
   * Obtiene historial de fixes
   */
  getFixHistory() {
    return this.appliedFixes;
  }
}

module.exports = CodeFixer;
