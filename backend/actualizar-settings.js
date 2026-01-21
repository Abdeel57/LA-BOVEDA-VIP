// Script para actualizar settings directamente desde tu computadora
// Ejecuta desde el directorio backend: node actualizar-settings.js

const { Client } = require('pg');

// Tu URL de base de datos
const DATABASE_URL = 'postgresql://postgres:FYpJMnYrybVLXNhMudgUQinugvgJhvnJ@yamabiko.proxy.rlwy.net:29508/railway';

async function actualizarSettings() {
  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: {
      rejectUnauthorized: false // Necesario para Railway
    }
  });

  try {
    console.log('🔌 Conectando a la base de datos...');
    await client.connect();
    console.log('✅ Conectado exitosamente\n');

    // Ver settings actuales
    console.log('📋 Verificando settings actuales...');
    const resultadoActual = await client.query(`
      SELECT id, "siteName", "updatedAt" 
      FROM settings 
      WHERE id = 'main_settings'
    `);

    if (resultadoActual.rows.length > 0) {
      console.log('Settings actuales:', {
        id: resultadoActual.rows[0].id,
        siteName: resultadoActual.rows[0].siteName,
        updatedAt: resultadoActual.rows[0].updatedAt
      });
    } else {
      console.log('⚠️ No se encontraron settings, se crearán nuevos');
    }

    console.log('\n🔄 Actualizando settings a "LA BOVEDA VIP"...');

    // Actualizar o crear settings
    const resultado = await client.query(`
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
    `);

    console.log(`✅ Settings actualizados: ${resultado.rowCount} fila(s) afectada(s)\n`);

    // Verificar que se actualizó
    console.log('✅ Verificando cambios...');
    const resultadoNuevo = await client.query(`
      SELECT id, "siteName", "updatedAt" 
      FROM settings 
      WHERE id = 'main_settings'
    `);

    if (resultadoNuevo.rows.length > 0) {
      console.log('✅ Settings actualizados correctamente:');
      console.log({
        id: resultadoNuevo.rows[0].id,
        siteName: resultadoNuevo.rows[0].siteName,
        updatedAt: resultadoNuevo.rows[0].updatedAt
      });
    }

    console.log('\n🎉 ¡Actualización completada exitosamente!');
    console.log('\n📝 Próximos pasos:');
    console.log('1. Reinicia el backend en Railway (Railway → Tu backend → Restart)');
    console.log('2. Limpia el caché del navegador (Ctrl + Shift + Delete)');
    console.log('3. Recarga la página en modo incógnito (Ctrl + Shift + N)');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    
    if (error.code === '42P01') {
      console.error('\n⚠️ La tabla "settings" no existe.');
      console.error('💡 Necesitas crear la tabla primero.');
      console.error('   Ejecuta: node crear-tabla-settings.js');
    } else if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
      console.error('\n⚠️ No se pudo conectar a la base de datos.');
      console.error('💡 Verifica que:');
      console.error('   - La URL de la base de datos sea correcta');
      console.error('   - Railway esté funcionando');
      console.error('   - Tu conexión a internet funcione');
    } else {
      console.error('\nDetalles del error:', error);
    }
    
    process.exit(1);
  } finally {
    await client.end();
    console.log('\n🔌 Desconectado de la base de datos');
  }
}

// Ejecutar
actualizarSettings();

