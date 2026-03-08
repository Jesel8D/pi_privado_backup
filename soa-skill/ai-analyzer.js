const http = require('http');

class AIAnalyzer {
  constructor(ollamaUrl = 'http://localhost:11434', model = 'deepseek-coder:6.7b') {
    this.ollamaUrl = ollamaUrl;
    this.model = model;
  }

  /**
   * Analiza un fallo de test usando IA
   */
  async analyzeFailure(failedTest) {
    console.log(`\n🔍 Analizando fallo en ${failedTest.service}...`);

    const prompt = this.buildAnalysisPrompt(failedTest);
    
    try {
      const analysis = await this.callOllama(prompt);
      
      return {
        service: failedTest.service,
        originalError: failedTest.error.substring(0, 500),
        aiAnalysis: analysis,
        timestamp: new Date()
      };
    } catch (error) {
      console.error(`❌ Error en análisis: ${error.message}`);
      return null;
    }
  }

  /**
   * Construye prompt de análisis
   */
  buildAnalysisPrompt(failedTest) {
    return `You are an expert code debugging assistant.

Analyze this test failure and provide a concise response:

SERVICE: ${failedTest.service}
TYPE: ${failedTest.type}

ERROR OUTPUT:
${failedTest.error}

Please respond with:
1. ROOT CAUSE: What's causing this failure?
2. IMPACT: How serious is this?
3. FIX TYPE: What kind of fix is needed? (syntax, logic, dependency, config, etc)
4. SUGGESTED APPROACH: Brief approach to fix it
5. SEVERITY: (critical/high/medium/low)

Be concise and actionable.`;
  }

  /**
   * Busca patrones de intent en el código fallido
   */
  async analyzeIntent(failedTest, sourceCode) {
    console.log(`📋 Analizando intent del código...`);

    const prompt = `You are a code intention analyzer.

Analyze what this code is TRYING TO DO and identify where it fails:

ERROR:
${failedTest.error.substring(0, 300)}

SOURCE CODE:
${sourceCode}

Respond with:
1. INTENDED BEHAVIOR: What should this code do?
2. ACTUAL BEHAVIOR: What is it doing instead?
3. GAP: The difference between intended and actual
4. PATTERN: What pattern should this follow?`;

    try {
      return await this.callOllama(prompt);
    } catch (error) {
      console.error(`Error en intent analysis: ${error.message}`);
      return null;
    }
  }

  /**
   * Genera recomendación de fix
   */
  async generateFixRecommendation(failedTest, analysis, sourceCode) {
    console.log(`💡 Generando recomendación de fix...`);

    const prompt = `You are an expert developer fixing code bugs.

Based on this analysis, provide a specific fix:

ERROR: ${failedTest.error.substring(0, 300)}
ANALYSIS: ${analysis}
CODE: ${sourceCode}

Provide ONLY the fixed code, nothing else. Keep the same structure and style.
Start with the language comment and provide complete file or function.`;

    try {
      return await this.callOllama(prompt);
    } catch (error) {
      console.error(`Error generando fix: ${error.message}`);
      return null;
    }
  }

  /**
   * Llama a Ollama
   */
  async callOllama(prompt) {
    return new Promise((resolve, reject) => {
      const postData = JSON.stringify({
        model: this.model,
        prompt: prompt,
        stream: false,
        temperature: 0.3, // Bajo para respuestas consistentes
        top_p: 0.9
      });

      const options = {
        hostname: 'localhost',
        port: 11434,
        path: '/api/generate',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        }
      };

      const req = http.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          try {
            const parsed = JSON.parse(data);
            resolve(parsed.response);
          } catch (error) {
            reject(new Error(`Error parsing response: ${error.message}`));
          }
        });
      });

      req.on('error', reject);
      req.write(postData);
      req.end();
    });
  }

  /**
   * Analiza múltiples fallos en paralelo
   */
  async analyzeMultipleFailures(failedTests) {
    console.log(`\n🤖 Analizando ${failedTests.length} fallos con IA...`);

    const analyses = await Promise.all(
      failedTests.map(test => this.analyzeFailure(test))
    );

    return analyses.filter(a => a !== null);
  }
}

module.exports = AIAnalyzer;
