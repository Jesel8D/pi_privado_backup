import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { UsersService } from './src/modules/users/users.service';
import { hash } from 'bcrypt';

async function updateUserPassword() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);

  try {
    // Find the admin user
    const user = await usersService.findByEmail('jarassanchezl@gmail.com');
    if (!user) {
      console.log('❌ Usuario no encontrado');
      return;
    }

    console.log('✅ Usuario encontrado:', user.email);

    // Generate new bcrypt hash for TEST1234
    const newPasswordHash = await hash('TEST1234', 12);
    console.log('🔐 Nuevo hash bcrypt generado');

    // Update the user with new bcrypt hash
    await usersService.update(user.id, { passwordHash: newPasswordHash });

    console.log('✅ Contraseña actualizada exitosamente');
    console.log('🔑 Nuevo hash bcrypt:', newPasswordHash);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await app.close();
  }
}

updateUserPassword();
