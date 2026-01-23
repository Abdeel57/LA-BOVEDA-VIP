const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function crearAdmin() {
  try {
    console.log('🔍 Verificando y creando usuario admin...\n');

    const username = 'admin';
    const password = 'admin123';
    const email = 'admin@labovedavip.com';
    const name = 'Administrador Principal';
    const role = 'superadmin';

    // Verificar si ya existe
    const existingUser = await prisma.adminUser.findUnique({
      where: { username }
    });

    if (existingUser) {
      console.log(`⚠️ El usuario "${username}" ya existe.`);
      console.log('🔄 Actualizando contraseña...');
      
      const hashedPassword = await bcrypt.hash(password, 10);
      await prisma.adminUser.update({
        where: { username },
        data: {
          password: hashedPassword,
          updatedAt: new Date()
        }
      });
      
      console.log(`✅ Contraseña actualizada para el usuario "${username}"`);
      console.log(`   Nueva contraseña: ${password}`);
    } else {
      console.log(`👤 Creando usuario administrador...`);
      console.log(`   Username: ${username}`);
      console.log(`   Email: ${email}`);
      console.log(`   Role: ${role}`);
      
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.adminUser.create({
        data: {
          id: `admin-${Date.now()}`,
          name,
          username,
          email,
          password: hashedPassword,
          role
        }
      });

      console.log('✅ Usuario administrador creado exitosamente!');
      console.log(`   ID: ${user.id}`);
    }

    console.log('\n📝 Credenciales de acceso:');
    console.log(`   Username: ${username}`);
    console.log(`   Password: ${password}`);
    console.log(`   Role: ${role}\n`);

    // Verificar que se puede encontrar
    const verifyUser = await prisma.adminUser.findUnique({
      where: { username }
    });

    if (verifyUser) {
      console.log('✅ Verificación: Usuario encontrado correctamente');
      const isValid = await bcrypt.compare(password, verifyUser.password);
      console.log(`✅ Verificación: Contraseña válida: ${isValid}`);
    } else {
      console.log('❌ Verificación: Usuario NO encontrado después de crear');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Detalles:', error);
  } finally {
    await prisma.$disconnect();
  }
}

crearAdmin();



