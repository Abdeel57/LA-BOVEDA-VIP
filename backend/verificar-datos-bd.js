// Script para verificar qué datos hay en la base de datos
const { Client } = require('pg');

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL no está configurado.');
  console.error('   Ejemplo (PowerShell): $env:DATABASE_URL="postgresql://user:password@host:port/database"');
  process.exit(1);
}

async function verificarDatos() {
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

    // Verificar Settings
    console.log('📋 VERIFICANDO SETTINGS:');
    const settings = await client.query('SELECT id, "siteName", "updatedAt" FROM settings');
    console.log(`Total de settings: ${settings.rows.length}`);
    settings.rows.forEach((s, i) => {
      console.log(`  ${i + 1}. ID: ${s.id}, SiteName: ${s.siteName}, Updated: ${s.updatedAt}`);
    });
    console.log('');

    // Verificar Rifas
    console.log('🎫 VERIFICANDO RIFAS:');
    const rifas = await client.query('SELECT id, title, slug, status, "createdAt" FROM raffles ORDER BY "createdAt" DESC');
    console.log(`Total de rifas: ${rifas.rows.length}`);
    rifas.rows.forEach((r, i) => {
      console.log(`  ${i + 1}. ID: ${r.id}, Title: ${r.title}, Slug: ${r.slug}, Status: ${r.status}, Created: ${r.createdAt}`);
    });
    console.log('');

    // Verificar Órdenes
    console.log('📦 VERIFICANDO ÓRDENES:');
    const ordenes = await client.query('SELECT COUNT(*) as total FROM orders');
    console.log(`Total de órdenes: ${ordenes.rows[0].total}`);
    console.log('');

    // Verificar Ganadores
    console.log('🏆 VERIFICANDO GANADORES:');
    const ganadores = await client.query('SELECT COUNT(*) as total FROM winners');
    console.log(`Total de ganadores: ${ganadores.rows[0].total}`);
    console.log('');

    // Verificar Usuarios Admin
    console.log('👤 VERIFICANDO USUARIOS ADMIN:');
    const usuarios = await client.query('SELECT id, username, email, "createdAt" FROM admin_users');
    console.log(`Total de usuarios admin: ${usuarios.rows.length}`);
    usuarios.rows.forEach((u, i) => {
      console.log(`  ${i + 1}. Username: ${u.username}, Email: ${u.email}, Created: ${u.createdAt}`);
    });
    console.log('');

    console.log('✅ Verificación completada');

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.code === '42P01') {
      console.error('⚠️ Una o más tablas no existen');
    } else {
      console.error('Detalles:', error);
    }
  } finally {
    await client.end();
    console.log('🔌 Desconectado de la base de datos');
  }
}

verificarDatos();


