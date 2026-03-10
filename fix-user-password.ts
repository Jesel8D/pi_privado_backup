import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { UsersService } from './src/modules/users/users.service';
import { hash } from '@node-rs/argon2';

async function fixUserPassword() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);

  try {
    // Find the user
    const user = await usersService.findByEmail('jarassanchezl@gmail.com');
    if (!user) {
      console.log('User not found');
      return;
    }

    // Generate correct hash
    const correctHash = await hash('TEST1234', {
      memoryCost: 65536,
      timeCost: 3,
      parallelism: 4,
    });

    // Update the user with correct hash
    await usersService.updatePassword(user.id, correctHash);

    console.log('✅ Password updated successfully');
    console.log('Hash:', correctHash);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await app.close();
  }
}

fixUserPassword();
