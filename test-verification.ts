import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { verify } from '@node-rs/argon2';

async function testPasswordVerification() {
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    // Simulate what the backend does
    const testPassword = 'TEST1234';
    const storedHash = '$argon2id$v=19$m=65536,t=3,p=4$E1lzBQqIhHpOm2Cm/Sb02w$YeTlHw792P7RM4ayiVzO+AoCA7rN6iCOS+765SN2Aao';

    console.log('Testing password verification...');
    console.log('Password:', testPassword);
    console.log('Hash:', storedHash);

    const isValid = await verify(storedHash, testPassword);
    console.log('Verification result:', isValid);

  } catch (error) {
    console.error('Error during verification:', error.message);
    console.error('Error details:', error);
  } finally {
    await app.close();
  }
}

testPasswordVerification();
