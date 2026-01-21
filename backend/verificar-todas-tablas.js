// Script para verificar todas las tablas en la base de datos
const { Client } = require('pg');

const DATABASE_URL = 'postgresql://postgres:FYpJMnYrybVLXNhMudgUQinugvgJhvnJ@yamabiko.proxy.rlwy.net:29508/railway';

async function verificarTodasTablas() {
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

    // Listar todas las tablas
    console.log('📋 LISTANDO TODAS LAS TABLAS:');
    const tablas = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `);
    
    console.log(`Total de tablas: ${tablas.rows.length}`);
    tablas.rows.forEach((t, i) => {
      console.log(`  ${i + 1}. ${t.table_name}`);
    });
    console.log('');

    // Verificar cada tabla que existe
    const tablasParaVerificar = ['settings', 'raffles', 'orders', 'winners', 'users', 'admin_users'];
    
    for (const tabla of tablasParaVerificar) {
      try {
        const existe = tablas.rows.some(t => t.table_name === tabla);
        if (existe) {
          const count = await client.query(`SELECT COUNT(*) as total FROM "${tabla}"`);
          console.log(`✅ ${tabla}: ${count.rows[0].total} registro(s)`);
          
          // Si hay datos, mostrar algunos ejemplos
          if (parseInt(count.rows[0].total) > 0 && tabla === 'raffles') {
            const ejemplos = await client.query(`SELECT id, title, slug FROM "${tabla}" LIMIT 3`);
            ejemplos.rows.forEach((r, i) => {
              console.log(`   ${i + 1}. ${r.title} (${r.slug})`);
            });
          }
        } else {
          console.log(`⚠️ ${tabla}: Tabla no existe`);
        }
      } catch (error) {
        console.log(`❌ ${tabla}: Error - ${error.message}`);
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Detalles:', error);
  } finally {
    await client.end();
    console.log('\n🔌 Desconectado de la base de datos');
  }
}

verificarTodasTablas();

