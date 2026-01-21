// Script para verificar qué está devolviendo el backend realmente
const https = require('https');

const BACKEND_URL = 'https://la-boveda-vip-production.up.railway.app';

async function verificarBackend() {
  console.log('🔍 Verificando qué está devolviendo el backend...\n');

  // Verificar health
  console.log('1️⃣ Verificando /api/health...');
  await hacerRequest(`${BACKEND_URL}/api/health`)
    .then(data => {
      console.log('✅ Health check:', JSON.stringify(data, null, 2));
    })
    .catch(err => {
      console.error('❌ Error en health:', err.message);
    });

  console.log('\n2️⃣ Verificando /api/public/settings...');
  await hacerRequest(`${BACKEND_URL}/api/public/settings`)
    .then(data => {
      console.log('✅ Settings del backend:');
      console.log('   Site Name:', data.siteName);
      console.log('   ID:', data.id);
      console.log('   Updated At:', data.updatedAt);
      console.log('\n   Datos completos:', JSON.stringify(data, null, 2));
    })
    .catch(err => {
      console.error('❌ Error obteniendo settings:', err.message);
    });

  console.log('\n3️⃣ Verificando /api/public/raffles...');
  await hacerRequest(`${BACKEND_URL}/api/public/raffles`)
    .then(data => {
      console.log('✅ Rifas del backend:');
      console.log('   Total de rifas:', Array.isArray(data) ? data.length : 'No es un array');
      if (Array.isArray(data) && data.length > 0) {
        console.log('   Primera rifa:', {
          id: data[0].id,
          title: data[0].title,
          slug: data[0].slug
        });
      } else {
        console.log('   ✅ No hay rifas (base de datos limpia)');
      }
    })
    .catch(err => {
      console.error('❌ Error obteniendo rifas:', err.message);
    });
}

function hacerRequest(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json);
        } catch (e) {
          resolve(data);
        }
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

verificarBackend();

