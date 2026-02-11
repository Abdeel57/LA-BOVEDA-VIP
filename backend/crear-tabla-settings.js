// Script para crear la tabla settings si no existe
const { Client } = require('pg');

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL no está configurado.');
  console.error('   Ejemplo (PowerShell): $env:DATABASE_URL="postgresql://user:password@host:port/database"');
  process.exit(1);
}

async function crearTablaSettings() {
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

    console.log('🔧 Creando tabla settings...');

    await client.query(`
      CREATE TABLE IF NOT EXISTS "settings" (
        "id" TEXT NOT NULL,
        "siteName" TEXT NOT NULL DEFAULT 'LA BOVEDA VIP',
        "logo" TEXT,
        "favicon" TEXT,
        "logoAnimation" TEXT NOT NULL DEFAULT 'rotate',
        "primaryColor" TEXT NOT NULL DEFAULT '#111827',
        "secondaryColor" TEXT NOT NULL DEFAULT '#1f2937',
        "accentColor" TEXT NOT NULL DEFAULT '#ec4899',
        "actionColor" TEXT NOT NULL DEFAULT '#0ea5e9',
        "whatsapp" TEXT,
        "email" TEXT,
        "emailFromName" TEXT,
        "emailReplyTo" TEXT,
        "emailSubject" TEXT,
        "facebookUrl" TEXT,
        "instagramUrl" TEXT,
        "tiktokUrl" TEXT,
        "collaborationVideoUrl" TEXT,
        "titleColor" TEXT,
        "subtitleColor" TEXT,
        "descriptionColor" TEXT,
        "paymentAccounts" JSONB,
        "faqs" JSONB,
        "displayPreferences" JSONB,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "settings_pkey" PRIMARY KEY ("id")
      )
    `);

    console.log('✅ Tabla settings creada exitosamente\n');

    // Crear el registro inicial
    console.log('🔧 Creando registro inicial con "LA BOVEDA VIP"...');
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

    console.log('✅ Registro inicial creado\n');

    // Verificar
    const resultado = await client.query(`
      SELECT id, "siteName", "updatedAt" 
      FROM settings 
      WHERE id = 'main_settings'
    `);

    if (resultado.rows.length > 0) {
      console.log('✅ Verificación exitosa:');
      console.log({
        id: resultado.rows[0].id,
        siteName: resultado.rows[0].siteName,
        updatedAt: resultado.rows[0].updatedAt
      });
    }

    console.log('\n🎉 ¡Todo listo! La tabla y el registro están creados.');
    console.log('\n📝 Próximos pasos:');
    console.log('1. Reinicia el backend en Railway');
    console.log('2. Limpia el caché del navegador');
    console.log('3. Recarga la página en modo incógnito');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Detalles:', error);
    process.exit(1);
  } finally {
    await client.end();
    console.log('\n🔌 Desconectado de la base de datos');
  }
}

crearTablaSettings();


