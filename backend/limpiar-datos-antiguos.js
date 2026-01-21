// Script para limpiar datos antiguos de otros clientes
// ⚠️ CUIDADO: Este script eliminará rifas, órdenes y ganadores antiguos
const { Client } = require('pg');

const DATABASE_URL = 'postgresql://postgres:FYpJMnYrybVLXNhMudgUQinugvgJhvnJ@yamabiko.proxy.rlwy.net:29508/railway';

async function limpiarDatosAntiguos() {
  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('🔌 Conectando a la base de datos...');
    await client.connect();
    console.log('✅ Conectado exitosamente\n');

    // Verificar qué hay antes de limpiar
    console.log('📋 DATOS ANTES DE LIMPIAR:');
    const rifasAntes = await client.query('SELECT COUNT(*) as total FROM raffles');
    const ordenesAntes = await client.query('SELECT COUNT(*) as total FROM orders');
    const ganadoresAntes = await client.query('SELECT COUNT(*) as total FROM winners');
    
    console.log(`  Rifas: ${rifasAntes.rows[0].total}`);
    console.log(`  Órdenes: ${ordenesAntes.rows[0].total}`);
    console.log(`  Ganadores: ${ganadoresAntes.rows[0].total}\n`);

    // Limpiar en orden (respetando foreign keys)
    console.log('🧹 LIMPIANDO DATOS ANTIGUOS...\n');

    // 1. Eliminar ganadores (dependen de rifas y órdenes)
    console.log('1️⃣ Eliminando ganadores...');
    const delGanadores = await client.query('DELETE FROM winners');
    console.log(`   ✅ ${delGanadores.rowCount} ganador(es) eliminado(s)\n`);

    // 2. Eliminar órdenes (dependen de rifas)
    console.log('2️⃣ Eliminando órdenes...');
    const delOrdenes = await client.query('DELETE FROM orders');
    console.log(`   ✅ ${delOrdenes.rowCount} orden(es) eliminada(s)\n`);

    // 3. Eliminar rifas
    console.log('3️⃣ Eliminando rifas...');
    const delRifas = await client.query('DELETE FROM raffles');
    console.log(`   ✅ ${delRifas.rowCount} rifa(s) eliminada(s)\n`);

    // 4. Actualizar settings a LA BOVEDA VIP (asegurarse de que esté correcto)
    console.log('4️⃣ Actualizando settings a "LA BOVEDA VIP"...');
    await client.query(`
      INSERT INTO settings (
        id, "siteName", "logoAnimation", "primaryColor", 
        "secondaryColor", "accentColor", "actionColor",
        "paymentAccounts", "faqs", "createdAt", "updatedAt"
      )
      VALUES (
        'main_settings', 'LA BOVEDA VIP', 'rotate',
        '#111827', '#1f2937', '#ec4899', '#0ea5e9',
        '[]'::jsonb, '[]'::jsonb, NOW(), NOW()
      )
      ON CONFLICT (id) DO UPDATE SET
        "siteName" = EXCLUDED."siteName",
        "updatedAt" = NOW()
    `);
    console.log('   ✅ Settings actualizados\n');

    // Verificar qué quedó después de limpiar
    console.log('📋 DATOS DESPUÉS DE LIMPIAR:');
    const rifasDespues = await client.query('SELECT COUNT(*) as total FROM raffles');
    const ordenesDespues = await client.query('SELECT COUNT(*) as total FROM orders');
    const ganadoresDespues = await client.query('SELECT COUNT(*) as total FROM winners');
    const settingsFinal = await client.query('SELECT id, "siteName" FROM settings WHERE id = \'main_settings\'');
    
    console.log(`  Rifas: ${rifasDespues.rows[0].total}`);
    console.log(`  Órdenes: ${ordenesDespues.rows[0].total}`);
    console.log(`  Ganadores: ${ganadoresDespues.rows[0].total}`);
    if (settingsFinal.rows.length > 0) {
      console.log(`  Settings: ${settingsFinal.rows[0].siteName}`);
    }
    console.log('');

    console.log('🎉 ¡Limpieza completada exitosamente!');
    console.log('\n📝 Próximos pasos:');
    console.log('1. Reinicia el backend en Railway');
    console.log('2. Limpia el caché del navegador');
    console.log('3. Recarga la página');
    console.log('4. Crea nuevas rifas desde el panel de admin');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Detalles:', error);
    process.exit(1);
  } finally {
    await client.end();
    console.log('\n🔌 Desconectado de la base de datos');
  }
}

limpiarDatosAntiguos();

