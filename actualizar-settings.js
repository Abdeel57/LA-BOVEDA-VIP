// Script para actualizar settings en la base de datos
// Ejecuta: node actualizar-settings.js

const { PrismaClient } = require('@prisma/client');

if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL no está configurado.');
  console.error('   Ejemplo (PowerShell): $env:DATABASE_URL="postgresql://user:password@host:port/database"');
  process.exit(1);
}

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
});

async function actualizarSettings() {
  try {
    console.log('🔌 Conectando a la base de datos...');
    
    // Verificar conexión
    await prisma.$connect();
    console.log('✅ Conectado a la base de datos');

    // Ver settings actuales
    console.log('\n📋 Verificando settings actuales...');
    const settingsActuales = await prisma.$queryRaw`
      SELECT id, "siteName", "updatedAt" 
      FROM settings 
      WHERE id = 'main_settings'
    `;
    
    if (settingsActuales && settingsActuales.length > 0) {
      console.log('Settings actuales:', settingsActuales[0]);
    } else {
      console.log('⚠️ No se encontraron settings, se crearán nuevos');
    }

    // Actualizar o crear settings
    console.log('\n🔄 Actualizando settings...');
    
    const resultado = await prisma.$executeRaw`
      INSERT INTO settings (
        id,
        "siteName",
        "logoAnimation",
        "primaryColor",
        "secondaryColor",
        "accentColor",
        "actionColor",
        "paymentAccounts",
        "faqs",
        "createdAt",
        "updatedAt"
      )
      VALUES (
        'main_settings',
        'LA BOVEDA VIP',
        'rotate',
        '#111827',
        '#1f2937',
        '#ec4899',
        '#0ea5e9',
        '[]'::jsonb,
        '[]'::jsonb,
        NOW(),
        NOW()
      )
      ON CONFLICT (id) DO UPDATE SET
        "siteName" = EXCLUDED."siteName",
        "updatedAt" = NOW()
    `;

    console.log(`✅ Settings actualizados: ${resultado} fila(s) afectada(s)`);

    // Verificar que se actualizó
    console.log('\n✅ Verificando cambios...');
    const settingsNuevos = await prisma.$queryRaw`
      SELECT id, "siteName", "updatedAt" 
      FROM settings 
      WHERE id = 'main_settings'
    `;
    
    console.log('Settings actualizados:', settingsNuevos[0]);
    console.log('\n🎉 ¡Settings actualizados correctamente!');
    console.log('\n📝 Próximos pasos:');
    console.log('1. Reinicia el backend en Railway');
    console.log('2. Limpia el caché del navegador');
    console.log('3. Recarga la página');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('\nDetalles del error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    console.log('\n🔌 Desconectado de la base de datos');
  }
}

actualizarSettings();


