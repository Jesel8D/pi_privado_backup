const bcrypt = require('bcrypt');

async function generateHash() {
  try {
    const hash = await bcrypt.hash('TEST1234', 12);
    console.log('Bcrypt hash for TEST1234:', hash);
  } catch (error) {
    console.error('Error:', error);
  }
}

generateHash();
