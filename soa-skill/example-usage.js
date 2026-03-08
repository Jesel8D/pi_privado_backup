// example-usage.js

const AutoHealingOrchestrator = require('./auto-healing-orchestrator');

async function main() {
  if (process.argv.length < 3) {
    console.log('Uso: node example-usage.js <repo-url> [branch]');
    console.log('Ejemplo: node example-usage.js https://github.com/user/repo.git main');
    process.exit(1);
  }

  const repoUrl = process.argv[2];
  const branch = process.argv[3] || 'main';

  const orchestrator = new AutoHealingOrchestrator();

  try {
    const result = await orchestrator.healRepository(repoUrl, branch);

    console.log('\nResultado final:', result);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
