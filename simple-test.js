const { verify, hash } = require('@node-rs/argon2');

async function testArgon2() {
  try {
    console.log('Testing argon2 hash and verify...');

    // Generate a fresh hash
    const password = 'TEST1234';
    const newHash = await hash(password, {
      memoryCost: 65536,
      timeCost: 3,
      parallelism: 4,
    });

    console.log('Generated hash:', newHash);

    // Test verification with the new hash
    const isValid = await verify(newHash, password);
    console.log('Verification with new hash:', isValid);

    // Test verification with the stored hash
    const storedHash = '$argon2id$v=19$m=65536,t=3,p=4$E1lzBQqIhHpOm2Cm/Sb02w$YeTlHw792P7RM4ayiVzO+AoCA7rN6iCOS+765SN2Aao';
    console.log('Testing stored hash:', storedHash);

    const isValidStored = await verify(storedHash, password);
    console.log('Verification with stored hash:', isValidStored);

  } catch (error) {
    console.error('Error:', error.message);
  }
}

testArgon2();
