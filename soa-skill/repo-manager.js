const fs = require('fs-extra');
const { execSync } = require('child_process');
const path = require('path');

class RepoManager {
  constructor(config = {}) {
    this.workDir = config.workDir || '/tmp/soa-workspace';
    this.repos = new Map();
    this.config = config;
  }

  /**
   * Descarga un repositorio
   * @param {string} repoUrl - URL del repo (GitHub, GitLab, etc)
   * @param {string} branch - Branch a clonar
   * @returns {object} - Info del repo clonado
   */
  async cloneRepo(repoUrl, branch = 'main') {
    console.log(`📥 Clonando repo: ${repoUrl} (branch: ${branch})`);
    
    try {
      // Crear directorio de trabajo
      if (!fs.existsSync(this.workDir)) {
        fs.mkdirSync(this.workDir, { recursive: true });
      }

      const repoName = repoUrl.split('/').pop().replace('.git', '');
      const repoPath = path.join(this.workDir, repoName);

      // Limpieza si existe
      if (fs.existsSync(repoPath)) {
        fs.removeSync(repoPath);
      }

      // Clone
      execSync(`git clone --branch ${branch} ${repoUrl} ${repoPath}`, {
        stdio: 'inherit'
      });

      // Detectar tipo de proyecto
      const projectType = this.detectProjectType(repoPath);
      
      const repoInfo = {
        name: repoName,
        url: repoUrl,
        branch: branch,
        path: repoPath,
        type: projectType,
        services: this.discoverServices(repoPath, projectType)
      };

      this.repos.set(repoName, repoInfo);
      console.log(`✅ Repo clonado: ${repoName}`);
      console.log(`📁 Ubicación: ${repoPath}`);
      console.log(`🔍 Tipo detectado: ${projectType}`);
      console.log(`🔧 Servicios encontrados: ${repoInfo.services.length}`);

      return repoInfo;
    } catch (error) {
      console.error(`❌ Error clonando repo: ${error.message}`);
      throw error;
    }
  }

  /**
   * Detecta tipo de proyecto
   */
  detectProjectType(repoPath) {
    const files = fs.readdirSync(repoPath);
    
    // Node.js
    if (files.includes('package.json')) {
      return 'nodejs';
    }
    
    // Python
    if (files.includes('requirements.txt') || files.includes('pyproject.toml')) {
      return 'python';
    }
    
    // Java
    if (files.includes('pom.xml') || files.includes('build.gradle')) {
      return 'java';
    }
    
    // Go
    if (files.includes('go.mod')) {
      return 'go';
    }
    
    // Polyglot/Monorepo
    if (files.includes('docker-compose.yml') || files.includes('docker-compose.yaml')) {
      return 'polyglot';
    }
    
    return 'unknown';
  }

  /**
   * Descubre servicios en la arquitectura SOA
   */
  discoverServices(repoPath, projectType) {
    const services = [];
    
    try {
      if (projectType === 'nodejs') {
        services.push(...this.discoverNodeServices(repoPath));
      } else if (projectType === 'python') {
        services.push(...this.discoverPythonServices(repoPath));
      } else if (projectType === 'polyglot') {
        services.push(...this.discoverPolyglotServices(repoPath));
      }
    } catch (error) {
      console.warn(`⚠️  Error descubriendo servicios: ${error.message}`);
    }
    
    return services;
  }

  discoverNodeServices(repoPath) {
    const services = [];
    const subdirs = fs.readdirSync(repoPath, { withFileTypes: true });
    
    for (const dir of subdirs) {
      if (dir.isDirectory() && !dir.name.startsWith('.')) {
        const pkgJsonPath = path.join(repoPath, dir.name, 'package.json');
        if (fs.existsSync(pkgJsonPath)) {
          const pkg = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
          services.push({
            name: dir.name,
            path: path.join(repoPath, dir.name),
            type: 'nodejs',
            version: pkg.version,
            main: pkg.main || 'index.js'
          });
        }
      }
    }
    
    return services;
  }

  discoverPythonServices(repoPath) {
    const services = [];
    const subdirs = fs.readdirSync(repoPath, { withFileTypes: true });
    
    for (const dir of subdirs) {
      if (dir.isDirectory() && !dir.name.startsWith('.')) {
        const reqPath = path.join(repoPath, dir.name, 'requirements.txt');
        const pyprojectPath = path.join(repoPath, dir.name, 'pyproject.toml');
        
        if (fs.existsSync(reqPath) || fs.existsSync(pyprojectPath)) {
          services.push({
            name: dir.name,
            path: path.join(repoPath, dir.name),
            type: 'python',
            hasTests: fs.existsSync(path.join(repoPath, dir.name, 'tests'))
          });
        }
      }
    }
    
    return services;
  }

  discoverPolyglotServices(repoPath) {
    // Analiza docker-compose.yml para descubrir servicios
    const dcPath = path.join(repoPath, 'docker-compose.yml');
    if (fs.existsSync(dcPath)) {
      const yaml = require('js-yaml');
      const dc = yaml.load(fs.readFileSync(dcPath, 'utf8'));
      
      return Object.keys(dc.services || {}).map(name => ({
        name,
        type: dc.services[name].build?.context || dc.services[name].image || 'unknown',
        isContainerized: true
      }));
    }
    return [];
  }

  /**
   * Obtiene info de repo
   */
  getRepo(repoName) {
    return this.repos.get(repoName);
  }

  /**
   * Lista todos los repos clonados
   */
  listRepos() {
    return Array.from(this.repos.values());
  }

  /**
   * Limpia workspace
   */
  cleanup() {
    if (fs.existsSync(this.workDir)) {
      fs.removeSync(this.workDir);
      console.log('🧹 Workspace limpiado');
    }
  }
}

module.exports = RepoManager;
