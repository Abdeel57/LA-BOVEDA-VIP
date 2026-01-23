const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function verificar() {
  try {
    console.log('🔍 Verificando estado de la base de datos...\n');

    // Verificar usuario admin
    console.log('1. Verificando usuario admin...');
    const adminUsers = await prisma.adminUser.findMany();
    console.log(`   ✅ Encontrados ${adminUsers.length} usuarios admin:`);
    adminUsers.forEach(user => {
      console.log(`      - Username: ${user.username}, Role: ${user.role}, ID: ${user.id}`);
    });

    // Verificar tablas
    console.log('\n2. Verificando tablas...');
    
    const tables = ['users', 'raffles', 'orders', 'tickets', 'winners', 'admin_users', 'settings'];
    
    for (const table of tables) {
      try {
        let count = 0;
        if (table === 'users') {
          count = await prisma.user.count();
        } else if (table === 'raffles') {
          count = await prisma.raffle.count();
        } else if (table === 'orders') {
          count = await prisma.order.count();
        } else if (table === 'tickets') {
          count = await prisma.ticket.count();
        } else if (table === 'winners') {
          count = await prisma.winner.count();
        } else if (table === 'admin_users') {
          count = await prisma.adminUser.count();
        } else if (table === 'settings') {
          count = await prisma.settings.count();
        }
        console.log(`   ✅ Tabla ${table}: ${count} registros`);
      } catch (error) {
        console.log(`   ❌ Tabla ${table}: ERROR - ${error.message}`);
      }
    }

    // Verificar settings
    console.log('\n3. Verificando settings...');
    try {
      const settings = await prisma.settings.findUnique({
        where: { id: 'main_settings' }
      });
      if (settings) {
        console.log(`   ✅ Settings encontrado: ${settings.siteName}`);
      } else {
        console.log('   ⚠️ Settings no encontrado');
      }
    } catch (error) {
      console.log(`   ❌ Error verificando settings: ${error.message}`);
    }

    // Verificar variables de entorno críticas
    console.log('\n4. Verificando variables de entorno...');
    console.log(`   JWT_SECRET: ${process.env.JWT_SECRET ? '✅ Configurado' : '❌ NO CONFIGURADO'}`);
    console.log(`   DATABASE_URL: ${process.env.DATABASE_URL ? '✅ Configurado' : '❌ NO CONFIGURADO'}`);
    console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'no configurado'}`);

    console.log('\n✅ Verificación completada');
  } catch (error) {
    console.error('❌ Error durante la verificación:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verificar();


