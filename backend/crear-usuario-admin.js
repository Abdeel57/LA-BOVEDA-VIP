// Script para crear un usuario administrador inicial
const { Client } = require('pg');
const bcrypt = require('bcrypt');

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL no está configurado.');
  console.error('   Ejemplo (PowerShell): $env:DATABASE_URL="postgresql://user:password@host:port/database"');
  process.exit(1);
}

async function crearUsuarioAdmin() {
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

    // Verificar si ya existe un admin
    const usuariosExistentes = await client.query(`
      SELECT id, username, email, role FROM "admin_users"
    `);

    if (usuariosExistentes.rows.length > 0) {
      console.log('📋 Usuarios administradores existentes:');
      usuariosExistentes.rows.forEach((u, i) => {
        console.log(`  ${i + 1}. Username: ${u.username}, Email: ${u.email || 'N/A'}, Role: ${u.role}`);
      });
      console.log('');
    }

    // Datos del nuevo usuario (puedes modificar estos valores)
    const username = 'admin';
    const password = 'admin123'; // ⚠️ Cambia esto en producción
    const email = 'admin@labovedavip.com';
    const name = 'Administrador Principal';
    const role = 'superadmin'; // superadmin, admin, ventas

    // Verificar si el usuario ya existe
    const usuarioExistente = await client.query(`
      SELECT id, username FROM "admin_users" WHERE username = $1
    `, [username]);

    if (usuarioExistente.rows.length > 0) {
      console.log(`⚠️ El usuario "${username}" ya existe.`);
      console.log('💡 Si quieres crear otro usuario, modifica el script con diferentes datos.\n');
      
      const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
      });

      return new Promise((resolve) => {
        readline.question('¿Deseas cambiar la contraseña del usuario existente? (s/n): ', async (answer) => {
          if (answer.toLowerCase() === 's' || answer.toLowerCase() === 'si') {
            const hashedPassword = await bcrypt.hash(password, 10);
            await client.query(`
              UPDATE "admin_users" 
              SET password = $1, "updatedAt" = NOW()
              WHERE username = $2
            `, [hashedPassword, username]);
            console.log(`✅ Contraseña actualizada para el usuario "${username}"`);
            console.log(`   Nueva contraseña: ${password}`);
          } else {
            console.log('✅ No se realizaron cambios');
          }
          readline.close();
          await client.end();
          resolve();
        });
      });
    }

    // Crear el nuevo usuario
    console.log('👤 Creando usuario administrador...');
    console.log(`   Username: ${username}`);
    console.log(`   Email: ${email}`);
    console.log(`   Role: ${role}`);
    console.log(`   Password: ${password}\n`);

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = require('crypto').randomBytes(16).toString('hex');

    await client.query(`
      INSERT INTO "admin_users" (id, name, username, email, password, role, "createdAt", "updatedAt")
      VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
    `, [userId, name, username, email, hashedPassword, role]);

    console.log('✅ Usuario administrador creado exitosamente!\n');
    console.log('📝 Credenciales de acceso:');
    console.log(`   Username: ${username}`);
    console.log(`   Password: ${password}`);
    console.log(`   Role: ${role}\n`);
    console.log('⚠️ IMPORTANTE: Cambia la contraseña después del primer inicio de sesión\n');
    console.log('💡 Puedes iniciar sesión en: /admin/login');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('Detalles:', error);
    process.exit(1);
  } finally {
    await client.end();
    console.log('🔌 Desconectado de la base de datos');
  }
}

crearUsuarioAdmin();

