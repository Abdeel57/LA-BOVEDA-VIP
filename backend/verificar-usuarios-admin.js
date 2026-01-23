const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function verificar() {
  try {
    console.log('🔍 Verificando usuarios admin con Prisma...\n');

    // Buscar todos los usuarios admin
    const allAdmins = await prisma.adminUser.findMany();
    
    console.log(`✅ Encontrados ${allAdmins.length} usuarios admin:\n`);
    allAdmins.forEach((user, index) => {
      console.log(`${index + 1}. Username: "${user.username}"`);
      console.log(`   ID: ${user.id}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Email: ${user.email || 'N/A'}`);
      console.log(`   Name: ${user.name || 'N/A'}`);
      console.log(`   Password hash length: ${user.password?.length || 0}`);
      console.log('');
    });

    // Intentar buscar específicamente "admin"
    console.log('🔍 Buscando usuario "admin" específicamente...');
    const adminUser = await prisma.adminUser.findUnique({
      where: { username: 'admin' }
    });

    if (adminUser) {
      console.log('   ✅ Usuario "admin" encontrado');
    } else {
      console.log('   ❌ Usuario "admin" NO encontrado con Prisma');
      console.log('   💡 Verificando si existe con consulta SQL directa...');
      
      const result = await prisma.$queryRaw`
        SELECT id, username, role FROM "admin_users" WHERE username = 'admin'
      `;
      console.log(`   Resultado SQL: ${JSON.stringify(result)}`);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Detalles:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verificar();



