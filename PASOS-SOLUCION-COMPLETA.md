# 🚀 Pasos para Solucionar el Problema - LA BOVEDA VIP

## 📋 Información que Necesito de Ti

Antes de empezar, necesito que me confirmes:

1. **¿Cuál es la URL de tu backend en Railway?**
   - Debería ser algo como: `https://la-boveda-vip-production.up.railway.app`
   - O: `https://tu-backend.up.railway.app`

2. **¿Cuál es la URL de tu frontend en Netlify?**
   - Debería ser algo como: `https://la-boveda-vip.netlify.app`
   - O tu dominio personalizado

3. **¿Tienes acceso al panel de admin?**
   - URL: `https://tu-frontend.netlify.app/admin/login`
   - Usuario y contraseña de admin

---

## ✅ PASO 1: Actualizar Settings en la Base de Datos

### Opción A: Desde Railway (Recomendado - Más Fácil)

1. **Ve a Railway** → https://railway.app
2. **Selecciona tu proyecto** → Tu servicio PostgreSQL
3. **Click en "Query"** o "Data" → "Query"
4. **Copia y pega este SQL:**

```sql
-- Actualizar nombre del sitio
UPDATE settings 
SET 
    "siteName" = 'LA BOVEDA VIP',
    "updatedAt" = NOW()
WHERE id = 'main_settings';

-- Si no existe, crearlo
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
    "updatedAt" = NOW();
```

5. **Click en "Run"** o "Execute"
6. **Verifica** que aparezca "1 row affected" o similar

### Opción B: Desde el Panel de Admin

1. Ve a tu sitio: `https://tu-frontend.netlify.app/admin/login`
2. Inicia sesión con tus credenciales de admin
3. Ve a **"Configuración"** o **"Settings"**
4. Cambia **"Nombre del sitio"** a: `LA BOVEDA VIP`
5. Guarda los cambios

---

## ✅ PASO 2: Verificar URL del Backend

**IMPORTANTE:** Veo que tu `netlify.toml` tiene:
```
VITE_API_URL = "https://neo-production-9455.up.railway.app/api"
```

Esto parece ser de OTRO cliente. Necesitas cambiarlo a TU backend.

### En Netlify:

1. Ve a **Netlify** → https://app.netlify.com
2. Selecciona tu sitio
3. Ve a **Site settings** → **Environment variables**
4. Busca `VITE_API_URL`
5. **Cámbiala** a tu backend correcto:
   ```
   https://tu-backend.up.railway.app/api
   ```
6. Si no existe, **agrégala**
7. **Guarda** y haz un nuevo deploy

---

## ✅ PASO 3: Limpiar Caché del Backend

1. Ve a **Railway** → Tu servicio backend
2. Click en el botón **"Restart"** (o los 3 puntos → Restart)
3. Espera a que reinicie completamente (verás los logs)

---

## ✅ PASO 4: Limpiar Caché del Navegador

### Método Rápido (Modo Incógnito):

1. Presiona `Ctrl + Shift + N` (Chrome/Edge)
2. Abre tu sitio en modo incógnito
3. Verifica que muestre "LA BOVEDA VIP"

### Método Completo:

1. Presiona `Ctrl + Shift + Delete`
2. Selecciona:
   - ✅ "Caché de imágenes y archivos"
   - ✅ "Última hora" o "Todo el tiempo"
3. Click en **"Borrar datos"**

---

## ✅ PASO 5: Verificar que Funciona

1. Abre tu sitio en modo incógnito
2. Presiona `F12` para abrir la consola
3. Busca estos mensajes:
   ```
   🔌 API Configuration: { API_URL: "https://tu-backend.up.railway.app/api" }
   ✅ Backend settings loaded successfully
   ```
4. Verifica que el sitio muestre **"LA BOVEDA VIP"** en lugar de "Lucky Snap"

---

## 🐛 Si Sigue Mostrando "Lucky Snap"

### Verificar Logs del Backend:

1. Railway → Tu backend → **Logs**
2. Busca mensajes como:
   ```
   ✅ Settings found: { siteName: 'LA BOVEDA VIP', ... }
   ```
   O si hay problema:
   ```
   ⚠️ No settings found, creating default settings
   ```

### Verificar desde la Consola del Navegador:

Abre la consola (F12) y ejecuta:

```javascript
// Ver qué URL está usando
console.log('API URL:', import.meta.env.VITE_API_URL);

// Intentar cargar settings manualmente
fetch('https://tu-backend.up.railway.app/api/public/settings')
  .then(r => r.json())
  .then(data => {
    console.log('Settings desde backend:', data);
    console.log('Site Name:', data.siteName);
  })
  .catch(err => console.error('Error:', err));
```

---

## 📞 Información que Necesito

Para ayudarte mejor, compárteme:

1. ✅ **URL de tu backend en Railway:** `https://???`
2. ✅ **URL de tu frontend en Netlify:** `https://???`
3. ✅ **¿Ejecutaste el SQL en Railway?** (Sí/No)
4. ✅ **¿Reiniciaste el backend?** (Sí/No)
5. ✅ **¿Qué muestra la consola del navegador?** (Copia los mensajes)

---

## 🎯 Checklist Final

- [ ] SQL ejecutado en Railway (settings actualizados)
- [ ] `VITE_API_URL` actualizado en Netlify
- [ ] Backend reiniciado en Railway
- [ ] Caché del navegador limpiado
- [ ] Sitio muestra "LA BOVEDA VIP" correctamente
- [ ] Consola del navegador muestra "✅ Backend settings loaded successfully"

---

## 💡 Consejo Extra

Si después de todo esto sigue apareciendo "Lucky Snap", puede ser que:

1. **El frontend está usando datos hardcodeados** (fallback)
   - Esto significa que el backend NO está respondiendo
   - Verifica que la URL del backend sea correcta

2. **Hay múltiples deployments**
   - Asegúrate de que solo hay UN backend corriendo
   - Verifica que el frontend apunta al backend correcto

3. **El caché de Netlify**
   - Haz un nuevo deploy después de cambiar `VITE_API_URL`
   - O espera unos minutos para que se propague

---

## 🚀 Siguiente Paso

Una vez que me confirmes:
- ✅ La URL de tu backend
- ✅ La URL de tu frontend
- ✅ Que ejecutaste el SQL

Te ayudo a verificar que todo esté configurado correctamente.


