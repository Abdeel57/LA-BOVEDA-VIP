# 🔧 Solución: Datos Antiguos de "Lucky Snap" Apareciendo

## 🔍 Problema Identificado

La página muestra datos de "Lucky Snap" (cliente anterior) en lugar de "LA BOVEDA VIP". Esto puede deberse a:

1. **Base de datos tiene datos antiguos** - La tabla `settings` tiene `siteName: 'Lucky Snap'`
2. **Caché del backend** - Redis o memoria tiene datos antiguos guardados
3. **Frontend usando fallback** - El frontend no puede conectar al backend y usa datos hardcodeados
4. **URL del API incorrecta** - El frontend está apuntando al backend incorrecto

---

## ✅ Solución Paso a Paso

### Paso 1: Verificar la Conexión del Frontend al Backend

1. Abre tu sitio en el navegador
2. Abre la consola del navegador (F12)
3. Busca este mensaje:
   ```
   🔌 API Configuration: { API_URL: "..." }
   ```
4. Verifica que `API_URL` apunte a TU backend de Railway, no a otro

**Si la URL es incorrecta:**
- En Netlify → Site settings → Environment variables
- Agrega/modifica: `VITE_API_URL=https://tu-backend.up.railway.app/api`

---

### Paso 2: Limpiar el Caché del Backend

El backend tiene caché que puede tener datos antiguos. Necesitas limpiarlo:

**Opción A: Reiniciar el Backend en Railway**
1. Ve a Railway → Tu servicio backend
2. Click en "Restart"
3. Espera a que reinicie completamente

**Opción B: Limpiar Caché de Redis (si lo usas)**
1. Ve a Railway → Tu servicio Redis
2. Abre la consola
3. Ejecuta: `FLUSHALL`

**Opción C: Esperar 30 minutos**
- El caché tiene TTL de 30 minutos, se limpiará automáticamente

---

### Paso 3: Actualizar los Settings en la Base de Datos

Los datos están en la tabla `settings` con `id = 'main_settings'`. Necesitas actualizarlos:

**Opción A: Desde el Panel de Admin**

1. Ve a tu sitio → `/admin/login`
2. Inicia sesión
3. Ve a "Configuración" o "Settings"
4. Actualiza:
   - **Nombre del sitio**: "LA BOVEDA VIP"
   - Todos los demás campos (colores, logos, etc.)
5. Guarda los cambios

**Opción B: Directamente en la Base de Datos (Railway)**

1. Ve a Railway → Tu base de datos PostgreSQL
2. Abre la consola SQL
3. Ejecuta:

```sql
-- Ver los settings actuales
SELECT id, "siteName", "primaryColor", "accentColor" FROM settings WHERE id = 'main_settings';

-- Actualizar el nombre del sitio
UPDATE settings 
SET "siteName" = 'LA BOVEDA VIP',
    "updatedAt" = NOW()
WHERE id = 'main_settings';

-- Verificar que se actualizó
SELECT id, "siteName" FROM settings WHERE id = 'main_settings';
```

**Opción C: Usar el Endpoint de Admin (si tienes acceso)**

```bash
# 1. Obtener token de admin primero (desde el login)
# POST https://tu-backend.up.railway.app/api/admin/login
# Guarda el access_token de la respuesta

# 2. Actualizar settings
curl -X POST https://tu-backend.up.railway.app/api/admin/settings \
  -H "Authorization: Bearer TU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "siteName": "LA BOVEDA VIP",
    "primaryColor": "#111827",
    "secondaryColor": "#1f2937",
    "accentColor": "#ec4899",
    "actionColor": "#0ea5e9"
  }'

# 3. Limpiar caché de settings (nuevo endpoint)
curl -X POST https://tu-backend.up.railway.app/api/admin/cache/clear-settings \
  -H "Authorization: Bearer TU_TOKEN"
```

---

### Paso 4: Limpiar Caché del Navegador

1. **Chrome/Edge:**
   - Presiona `Ctrl + Shift + Delete`
   - Selecciona "Caché de imágenes y archivos"
   - Click en "Borrar datos"

2. **O usa modo incógnito:**
   - Presiona `Ctrl + Shift + N`
   - Abre tu sitio

---

### Paso 5: Verificar que Funciona

1. Abre tu sitio en modo incógnito
2. Abre la consola (F12)
3. Busca estos mensajes:
   ```
   ✅ Backend settings loaded successfully
   ```
   O si hay error:
   ```
   ❌ Backend failed with exception: ...
   🔄 Using local data for settings
   ```

4. Si ves "Using local data", el frontend NO está conectando al backend correctamente

---

## 🐛 Troubleshooting

### Problema: Sigue mostrando "Lucky Snap"

**Causas posibles:**

1. **El frontend está usando datos hardcodeados**
   - Verifica la consola del navegador
   - Si ves "🔄 Using local data for settings", el backend no responde
   - Verifica que `VITE_API_URL` esté configurado correctamente

2. **El caché del backend tiene datos antiguos**
   - Reinicia el backend en Railway
   - O espera 30 minutos para que expire el caché

3. **La base de datos tiene datos antiguos**
   - Actualiza los settings desde el panel de admin
   - O ejecuta el SQL de actualización

### Problema: El frontend no conecta al backend

**Verifica:**

1. **URL del API:**
   ```javascript
   // En la consola del navegador deberías ver:
   🔌 API Configuration: { API_URL: "https://tu-backend.up.railway.app/api" }
   ```

2. **CORS está configurado:**
   - Verifica los logs del backend en Railway
   - Deberías ver: `✅ CORS permitido para: https://tu-frontend.netlify.app`

3. **El backend está funcionando:**
   - Visita: `https://tu-backend.up.railway.app/api/health`
   - Debería responder: `{ "status": "ok" }`

### Problema: Los cambios no se reflejan

**Solución:**

1. Limpia el caché del navegador completamente
2. Reinicia el backend para limpiar su caché
3. Espera unos segundos y recarga la página
4. Si usas Redis, limpia su caché también

---

## 📋 Checklist Completo

- [ ] `VITE_API_URL` configurado correctamente en Netlify
- [ ] Backend reiniciado en Railway (limpia caché)
- [ ] Settings actualizados en la base de datos (`siteName = 'LA BOVEDA VIP'`)
- [ ] Caché del navegador limpiado o usando modo incógnito
- [ ] Consola del navegador muestra "✅ Backend settings loaded successfully"
- [ ] No hay errores de CORS en la consola
- [ ] El sitio muestra "LA BOVEDA VIP" en lugar de "Lucky Snap"

---

## 🔍 Verificar los Datos Actuales

### Desde la Consola del Navegador

Abre la consola (F12) y ejecuta:

```javascript
// Ver qué URL está usando el API
console.log('API URL:', import.meta.env.VITE_API_URL);

// Intentar cargar settings manualmente
fetch('https://tu-backend.up.railway.app/api/public/settings')
  .then(r => r.json())
  .then(data => {
    console.log('Settings desde backend:', data);
    console.log('Site Name:', data.siteName);
  });
```

### Desde Railway (Logs del Backend)

Revisa los logs del backend y busca:

```
✅ Settings found: { siteName: 'LA BOVEDA VIP', ... }
```

O si hay problema:

```
⚠️ No settings found, creating default settings
```

---

## 💡 Solución Rápida (Si Tienes Acceso Admin)

1. Ve a `/admin/login`
2. Inicia sesión
3. Ve a "Configuración"
4. Cambia "Nombre del sitio" a "LA BOVEDA VIP"
5. Guarda
6. Limpia caché del navegador
7. Recarga la página

---

## 🚨 Si Nada Funciona

1. **Verifica que estás usando el backend correcto:**
   - Cada cliente debe tener su propia base de datos
   - Verifica que `DATABASE_URL` en Railway apunte a TU base de datos

2. **Verifica que no hay múltiples deployments:**
   - Asegúrate de que solo hay UN backend corriendo
   - Verifica que el frontend apunta al backend correcto

3. **Revisa los logs completos:**
   - Railway → Backend → Logs
   - Busca errores o warnings
   - Verifica qué datos está devolviendo el backend

---

## 📝 Notas Importantes

- El caché del backend tiene TTL de **30 minutos**
- El caché del navegador puede durar **hasta que lo limpies**
- Cada cambio en settings requiere **limpiar ambos caches**
- Si cambias datos en la BD directamente, **reinicia el backend** para limpiar su caché

