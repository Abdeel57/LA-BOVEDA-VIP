const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function testLogin() {
  try {
    console.log('🔍 Probando login...\n');

    const username = 'admin';
    const password = 'admin123';

    console.log(`1. Buscando usuario: ${username}`);
    const user = await prisma.adminUser.findUnique({
      where: { username }
    });

    if (!user) {
      console.log('   ❌ Usuario no encontrado');
      return;
    }

    console.log(`   ✅ Usuario encontrado: ${user.username}, Role: ${user.role}`);
    console.log(`   Password hash: ${user.password.substring(0, 20)}...`);

    console.log(`\n2. Verificando contraseña...`);
    const isValid = await bcrypt.compare(password, user.password);
    
    if (isValid) {
      console.log('   ✅ Contraseña válida');
      console.log('\n✅ Login debería funcionar correctamente');
    } else {
      console.log('   ❌ Contraseña inválida');
      console.log('\n⚠️ La contraseña no coincide. Necesitas actualizar la contraseña.');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Detalles:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testLogin();


