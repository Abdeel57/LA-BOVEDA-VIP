// Script para limpiar TODOS los datos y dejar solo configuración básica de plantilla
const { Client } = require('pg');

const DATABASE_URL = 'postgresql://postgres:FYpJMnYrybVLXNhMudgUQinugvgJhvnJ@yamabiko.proxy.rlwy.net:29508/railway';

async function limpiarTodoYResetear() {
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

    console.log('🧹 LIMPIANDO TODOS LOS DATOS...\n');

    // 1. Eliminar ganadores
    try {
      const delGanadores = await client.query('DELETE FROM winners');
      console.log(`✅ ${delGanadores.rowCount} ganador(es) eliminado(s)`);
    } catch (err) {
      if (err.code !== '42P01') console.log('⚠️ Tabla winners no existe o ya está vacía');
    }

    // 2. Eliminar órdenes
    try {
      const delOrdenes = await client.query('DELETE FROM orders');
      console.log(`✅ ${delOrdenes.rowCount} orden(es) eliminada(s)`);
    } catch (err) {
      if (err.code !== '42P01') console.log('⚠️ Tabla orders no existe o ya está vacía');
    }

    // 3. Eliminar rifas
    try {
      const delRifas = await client.query('DELETE FROM raffles');
      console.log(`✅ ${delRifas.rowCount} rifa(s) eliminada(s)`);
    } catch (err) {
      if (err.code !== '42P01') console.log('⚠️ Tabla raffles no existe o ya está vacía');
    }

    // 4. Eliminar usuarios (excepto admin si existe)
    try {
      const delUsers = await client.query('DELETE FROM users');
      console.log(`✅ ${delUsers.rowCount} usuario(s) eliminado(s)`);
    } catch (err) {
      if (err.code !== '42P01') console.log('⚠️ Tabla users no existe o ya está vacía');
    }

    console.log('\n📝 CONFIGURANDO SETTINGS DE PLANTILLA...\n');

    // 5. Resetear settings a valores de plantilla
    await client.query(`
      INSERT INTO settings (
        id,
        "siteName",
        "logoAnimation",
        "primaryColor",
        "secondaryColor",
        "accentColor",
        "actionColor",
        "whatsapp",
        "email",
        "facebookUrl",
        "instagramUrl",
        "tiktokUrl",
        "paymentAccounts",
        "faqs",
        "displayPreferences",
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
        '',
        '',
        '',
        '',
        '',
        '[]'::jsonb,
        '[]'::jsonb,
        '{}'::jsonb,
        NOW(),
        NOW()
      )
      ON CONFLICT (id) DO UPDATE SET
        "siteName" = EXCLUDED."siteName",
        "logo" = NULL,
        "favicon" = NULL,
        "logoAnimation" = EXCLUDED."logoAnimation",
        "primaryColor" = EXCLUDED."primaryColor",
        "secondaryColor" = EXCLUDED."secondaryColor",
        "accentColor" = EXCLUDED."accentColor",
        "actionColor" = EXCLUDED."actionColor",
        "whatsapp" = EXCLUDED."whatsapp",
        "email" = EXCLUDED."email",
        "emailFromName" = NULL,
        "emailReplyTo" = NULL,
        "emailSubject" = NULL,
        "facebookUrl" = EXCLUDED."facebookUrl",
        "instagramUrl" = EXCLUDED."instagramUrl",
        "tiktokUrl" = EXCLUDED."tiktokUrl",
        "paymentAccounts" = EXCLUDED."paymentAccounts",
        "faqs" = EXCLUDED."faqs",
        "displayPreferences" = EXCLUDED."displayPreferences",
        "updatedAt" = NOW()
    `);

    console.log('✅ Settings reseteados a valores de plantilla\n');

    // Verificar resultado final
    console.log('📋 VERIFICACIÓN FINAL:\n');
    
    const settings = await client.query('SELECT "siteName", "paymentAccounts", "faqs" FROM settings WHERE id = \'main_settings\'');
    if (settings.rows.length > 0) {
      console.log('Settings:');
      console.log(`  Site Name: ${settings.rows[0].siteName}`);
      try {
        const paymentAccounts = settings.rows[0].paymentAccounts ? 
          (typeof settings.rows[0].paymentAccounts === 'string' ? 
            JSON.parse(settings.rows[0].paymentAccounts) : 
            settings.rows[0].paymentAccounts) : [];
        const faqs = settings.rows[0].faqs ? 
          (typeof settings.rows[0].faqs === 'string' ? 
            JSON.parse(settings.rows[0].faqs) : 
            settings.rows[0].faqs) : [];
        console.log(`  Payment Accounts: ${Array.isArray(paymentAccounts) ? paymentAccounts.length : 0} cuenta(s)`);
        console.log(`  FAQs: ${Array.isArray(faqs) ? faqs.length : 0} pregunta(s)`);
      } catch (e) {
        console.log(`  Payment Accounts: 0 cuenta(s)`);
        console.log(`  FAQs: 0 pregunta(s)`);
      }
    }

    const rifas = await client.query('SELECT COUNT(*) as total FROM raffles').catch(() => ({ rows: [{ total: 0 }] }));
    const ordenes = await client.query('SELECT COUNT(*) as total FROM orders').catch(() => ({ rows: [{ total: 0 }] }));
    const ganadores = await client.query('SELECT COUNT(*) as total FROM winners').catch(() => ({ rows: [{ total: 0 }] }));

    console.log(`\nRifas: ${rifas.rows[0]?.total || 0}`);
    console.log(`Órdenes: ${ordenes.rows[0]?.total || 0}`);
    console.log(`Ganadores: ${ganadores.rows[0]?.total || 0}`);

    console.log('\n🎉 ¡Limpieza completada exitosamente!');
    console.log('\n📝 La base de datos ahora está en estado de plantilla:');
    console.log('   ✅ Settings básicos configurados');
    console.log('   ✅ Sin rifas');
    console.log('   ✅ Sin órdenes');
    console.log('   ✅ Sin ganadores');
    console.log('\n💡 Próximos pasos:');
    console.log('1. Reinicia el backend en Railway');
    console.log('2. Limpia el caché del navegador');
    console.log('3. El sitio mostrará la plantilla limpia');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Detalles:', error);
    process.exit(1);
  } finally {
    await client.end();
    console.log('\n🔌 Desconectado de la base de datos');
  }
}

limpiarTodoYResetear();

