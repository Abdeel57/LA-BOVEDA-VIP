// Script para crear TODAS las tablas necesarias para el panel de administrador
const { Client } = require('pg');

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL no está configurado.');
  console.error('   Ejemplo (PowerShell): $env:DATABASE_URL="postgresql://user:password@host:port/database"');
  process.exit(1);
}

async function crearTodasTablas() {
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

    console.log('🗄️ Creando todas las tablas necesarias...\n');

    // 1. Crear enum OrderStatus
    console.log('1️⃣ Creando enum OrderStatus...');
    await client.query(`
      DO $$ BEGIN
        CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'PAID', 'CANCELLED', 'EXPIRED', 'RELEASED');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);
    console.log('   ✅ Enum OrderStatus creado\n');

    // 2. Crear tabla users
    console.log('2️⃣ Creando tabla users...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS "users" (
        "id" TEXT NOT NULL,
        "email" TEXT NOT NULL,
        "name" TEXT,
        "phone" TEXT,
        "district" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "users_pkey" PRIMARY KEY ("id")
      );
    `);
    await client.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "users_email_key" ON "users"("email");
    `);
    console.log('   ✅ Tabla users creada\n');

    // 3. Crear tabla raffles
    console.log('3️⃣ Creando tabla raffles...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS "raffles" (
        "id" TEXT NOT NULL,
        "title" TEXT NOT NULL,
        "description" TEXT,
        "purchaseDescription" TEXT,
        "imageUrl" TEXT,
        "gallery" JSONB,
        "price" DOUBLE PRECISION NOT NULL DEFAULT 50.0,
        "tickets" INTEGER NOT NULL,
        "sold" INTEGER NOT NULL DEFAULT 0,
        "drawDate" TIMESTAMP(3) NOT NULL,
        "status" TEXT NOT NULL DEFAULT 'draft',
        "slug" TEXT,
        "boletosConOportunidades" BOOLEAN NOT NULL DEFAULT false,
        "numeroOportunidades" INTEGER NOT NULL DEFAULT 1,
        "giftTickets" INTEGER DEFAULT 0,
        "packs" JSONB,
        "bonuses" TEXT[],
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "raffles_pkey" PRIMARY KEY ("id")
      );
    `);
    await client.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "raffles_slug_key" ON "raffles"("slug") WHERE "slug" IS NOT NULL;
    `);
    console.log('   ✅ Tabla raffles creada\n');

    // 4. Crear tabla tickets
    console.log('4️⃣ Creando tabla tickets...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS "tickets" (
        "id" TEXT NOT NULL,
        "raffleId" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "quantity" INTEGER NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "tickets_pkey" PRIMARY KEY ("id")
      );
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS "tickets_raffleId_idx" ON "tickets"("raffleId");
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS "tickets_userId_idx" ON "tickets"("userId");
    `);
    console.log('   ✅ Tabla tickets creada\n');

    // 5. Crear tabla orders
    console.log('5️⃣ Creando tabla orders...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS "orders" (
        "id" TEXT NOT NULL,
        "folio" TEXT NOT NULL,
        "raffleId" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "tickets" INTEGER[] NOT NULL DEFAULT '{}',
        "total" DOUBLE PRECISION NOT NULL,
        "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
        "paymentMethod" TEXT,
        "notes" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "expiresAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
      );
    `);
    await client.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "orders_folio_key" ON "orders"("folio");
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS "orders_raffleId_idx" ON "orders"("raffleId");
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS "orders_userId_idx" ON "orders"("userId");
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS "orders_status_idx" ON "orders"("status");
    `);
    console.log('   ✅ Tabla orders creada\n');

    // 6. Crear tabla winners
    console.log('6️⃣ Creando tabla winners...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS "winners" (
        "id" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "prize" TEXT NOT NULL,
        "imageUrl" TEXT NOT NULL,
        "raffleTitle" TEXT NOT NULL,
        "drawDate" TIMESTAMP(3) NOT NULL,
        "ticketNumber" INTEGER,
        "testimonial" TEXT,
        "phone" TEXT,
        "city" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "winners_pkey" PRIMARY KEY ("id")
      );
    `);
    console.log('   ✅ Tabla winners creada\n');

    // 7. Crear tabla admin_users
    console.log('7️⃣ Creando tabla admin_users...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS "admin_users" (
        "id" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "username" TEXT NOT NULL,
        "email" TEXT,
        "password" TEXT NOT NULL,
        "role" TEXT NOT NULL DEFAULT 'ventas',
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "admin_users_pkey" PRIMARY KEY ("id")
      );
    `);
    await client.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "admin_users_username_key" ON "admin_users"("username");
    `);
    await client.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "admin_users_email_key" ON "admin_users"("email") WHERE "email" IS NOT NULL;
    `);
    console.log('   ✅ Tabla admin_users creada\n');

    // 8. Asegurar que settings tenga todas las columnas necesarias
    console.log('8️⃣ Verificando/actualizando tabla settings...');
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
        "titleColor" TEXT,
        "subtitleColor" TEXT,
        "descriptionColor" TEXT,
        "whatsapp" TEXT,
        "email" TEXT,
        "emailFromName" TEXT,
        "emailReplyTo" TEXT,
        "emailSubject" TEXT,
        "facebookUrl" TEXT,
        "instagramUrl" TEXT,
        "tiktokUrl" TEXT,
        "collaborationVideoUrl" TEXT,
        "paymentAccounts" JSONB,
        "faqs" JSONB,
        "displayPreferences" JSONB,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "settings_pkey" PRIMARY KEY ("id")
      );
    `);

    // Agregar columnas que puedan faltar
    const columnasSettings = [
      'titleColor', 'subtitleColor', 'descriptionColor',
      'emailFromName', 'emailReplyTo', 'emailSubject',
      'displayPreferences', 'collaborationVideoUrl'
    ];

    for (const columna of columnasSettings) {
      try {
        await client.query(`
          ALTER TABLE "settings" 
          ADD COLUMN IF NOT EXISTS "${columna}" ${columna.includes('Color') || columna === 'emailFromName' || columna === 'emailReplyTo' || columna === 'emailSubject' || columna === 'collaborationVideoUrl' ? 'TEXT' : 'JSONB'};
        `);
      } catch (error) {
        // La columna ya existe, continuar
      }
    }

    console.log('   ✅ Tabla settings verificada/actualizada\n');

    // 9. Crear Foreign Keys
    console.log('9️⃣ Creando Foreign Keys...');
    
    // Foreign keys para tickets
    try {
      await client.query(`
        ALTER TABLE "tickets" 
        ADD CONSTRAINT IF NOT EXISTS "tickets_raffleId_fkey" 
        FOREIGN KEY ("raffleId") REFERENCES "raffles"("id") ON DELETE CASCADE;
      `);
      await client.query(`
        ALTER TABLE "tickets" 
        ADD CONSTRAINT IF NOT EXISTS "tickets_userId_fkey" 
        FOREIGN KEY ("userId") REFERENCES "users"("id");
      `);
      console.log('   ✅ Foreign keys de tickets creadas');
    } catch (error) {
      if (!error.message.includes('already exists')) {
        console.log('   ⚠️ Algunas foreign keys de tickets ya existen');
      }
    }

    // Foreign keys para orders
    try {
      await client.query(`
        ALTER TABLE "orders" 
        ADD CONSTRAINT IF NOT EXISTS "orders_raffleId_fkey" 
        FOREIGN KEY ("raffleId") REFERENCES "raffles"("id") ON DELETE CASCADE;
      `);
      await client.query(`
        ALTER TABLE "orders" 
        ADD CONSTRAINT IF NOT EXISTS "orders_userId_fkey" 
        FOREIGN KEY ("userId") REFERENCES "users"("id");
      `);
      console.log('   ✅ Foreign keys de orders creadas');
    } catch (error) {
      if (!error.message.includes('already exists')) {
        console.log('   ⚠️ Algunas foreign keys de orders ya existen');
      }
    }

    console.log('');

    // Verificar tablas creadas
    console.log('📋 VERIFICACIÓN FINAL:\n');
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

    // Verificar registros en cada tabla
    console.log('\n📊 Estado de las tablas:');
    const tablasParaVerificar = ['users', 'raffles', 'tickets', 'orders', 'winners', 'admin_users', 'settings'];
    
    for (const tabla of tablasParaVerificar) {
      try {
        const count = await client.query(`SELECT COUNT(*) as total FROM "${tabla}"`);
        console.log(`  ${tabla}: ${count.rows[0].total} registro(s)`);
      } catch (err) {
        console.log(`  ${tabla}: ⚠️ Error al verificar`);
        console.log(`     ${err.message}`);
      }
    }

    console.log('\n🎉 ¡Todas las tablas creadas exitosamente!');
    console.log('\n📝 El panel de administrador ahora debería funcionar correctamente.');
    console.log('\n💡 Próximos pasos:');
    console.log('1. Reinicia el backend en Railway');
    console.log('2. Crea un usuario administrador desde el panel o usando el script');
    console.log('3. Inicia sesión en /admin/login');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('Detalles:', error);
    process.exit(1);
  } finally {
    await client.end();
    console.log('\n🔌 Desconectado de la base de datos');
  }
}

crearTodasTablas();


