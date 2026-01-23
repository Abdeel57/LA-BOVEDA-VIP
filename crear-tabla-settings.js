// Script para crear la tabla settings si no existe
// Ejecuta SOLO si el script anterior dice que la tabla no existe

import pg from 'pg';
const { Client } = pg;

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
    console.log('🔧 Creando registro inicial...');
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
      ON CONFLICT (id) DO NOTHING
    `);

    console.log('✅ Registro inicial creado\n');
    console.log('🎉 ¡Todo listo! Ahora ejecuta: node actualizar-settings-directo.js');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Detalles:', error);
    process.exit(1);
  } finally {
    await client.end();
    console.log('🔌 Desconectado de la base de datos');
  }
}

crearTablaSettings();

