# 🔧 Solución: CORS y Datos Antiguos en la Página

## 🔍 Problema Identificado

La página muestra datos de una página anterior, posiblemente debido a:
1. **CORS mal configurado** - El backend no permite el dominio correcto
2. **Caché del navegador** - Datos antiguos almacenados
3. **Caché del backend** - Datos en caché de Redis/memoria
4. **Base de datos compartida** - Múltiples clientes usando la misma BD

---

## ✅ Solución Implementada

### 1. CORS Ahora Usa Variables de Entorno

El código ahora:
- ✅ Usa `CORS_ORIGINS` desde variables de entorno
- ✅ Permite automáticamente dominios de Railway (`.up.railway.app`)
- ✅ Permite automáticamente dominios de Netlify (`.netlify.app`)
- ✅ Mantiene dominios hardcodeados como fallback
- ✅ Muestra logs detallados de qué dominios están permitidos

### 2. Configuración en Railway

En Railway, agrega/modifica la variable de entorno `CORS_ORIGINS`:

```
CORS_ORIGINS=https://tu-frontend.netlify.app,https://www.tu-dominio.com,https://tu-dominio.com
```

**Ejemplo para LA BOVEDA VIP:**
```
CORS_ORIGINS=https://la-boveda-vip.netlify.app,https://la-boveda-vip-production.up.railway.app
```

---

## 🧹 Limpiar Caché

### Opción 1: Limpiar Caché del Navegador

**Chrome/Edge:**
1. Presiona `Ctrl + Shift + Delete` (Windows) o `Cmd + Shift + Delete` (Mac)
2. Selecciona "Caché de imágenes y archivos"
3. Selecciona "Última hora" o "Todo el tiempo"
4. Click en "Borrar datos"

**O usar modo incógnito:**
- Presiona `Ctrl + Shift + N` (Windows) o `Cmd + Shift + N` (Mac)

### Opción 2: Limpiar Caché del Backend

Si estás usando Redis, puedes limpiarlo:

**Desde Railway (si tienes Redis):**
1. Ve a tu servicio Redis en Railway
2. Abre la consola
3. Ejecuta: `FLUSHALL`

**O reinicia el servicio backend:**
- En Railway → Tu servicio backend → Click en "Restart"

### Opción 3: Limpiar Caché desde el Código

El backend tiene un endpoint para limpiar caché (si está implementado):

```bash
# Limpiar caché de rifas
curl -X POST https://tu-backend.up.railway.app/api/admin/cache/clear

# O desde el código, el caché se invalida automáticamente cuando:
# - Se crea/actualiza/elimina una rifa
# - Se crea un ganador
# - Se actualizan los settings
```

---

## 🔍 Verificar la Configuración

### 1. Verificar CORS en los Logs

Cuando el backend inicia, deberías ver en los logs:

```
🔒 CORS configurado con X orígenes permitidos
🌐 CORS Origins desde variables de entorno: https://tu-dominio.com
```

Cuando una petición llega, verás:

```
✅ CORS permitido para: https://tu-frontend.netlify.app
```

O si está bloqueado:

```
❌ CORS bloqueado para origen no permitido: https://dominio-incorrecto.com
   Orígenes permitidos: ...
```

### 2. Verificar desde el Navegador

Abre la consola del navegador (F12) y revisa:

**Si hay errores de CORS:**
```
Access to fetch at 'https://backend.up.railway.app/api/...' from origin 'https://frontend.netlify.app' 
has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

**Si hay datos antiguos:**
- Revisa la pestaña "Network" en las herramientas de desarrollador
- Busca las peticiones a `/api/public/settings` o `/api/public/raffles`
- Verifica que los datos devueltos sean correctos

### 3. Verificar la Base de Datos

Asegúrate de que la base de datos tenga los datos correctos:

```sql
-- Verificar settings
SELECT * FROM settings WHERE id = 'main_settings';

-- Verificar rifas
SELECT id, title, slug FROM raffles WHERE status = 'active';
```

---

## 🚀 Pasos para Solucionar

### Paso 1: Configurar CORS_ORIGINS en Railway

1. Ve a Railway → Tu servicio backend → Variables
2. Agrega/modifica `CORS_ORIGINS`:
   ```
   CORS_ORIGINS=https://tu-frontend.netlify.app,https://www.tu-dominio.com
   ```
3. Guarda y espera a que Railway reinicie el servicio

### Paso 2: Limpiar Caché del Navegador

1. Abre tu sitio en modo incógnito
2. O limpia el caché del navegador (ver arriba)

### Paso 3: Reiniciar el Backend

1. En Railway → Tu servicio backend → Click en "Restart"
2. Espera a que reinicie completamente

### Paso 4: Verificar los Logs

1. En Railway → Tu servicio backend → Logs
2. Busca mensajes de CORS:
   - `✅ CORS permitido para: ...` (correcto)
   - `❌ CORS bloqueado para origen no permitido: ...` (problema)

### Paso 5: Probar la Conexión

1. Abre tu frontend
2. Abre la consola del navegador (F12)
3. Verifica que no haya errores de CORS
4. Verifica que los datos sean correctos

---

## 📋 Checklist

- [ ] `CORS_ORIGINS` configurado en Railway con tu dominio correcto
- [ ] Backend reiniciado después de cambiar `CORS_ORIGINS`
- [ ] Caché del navegador limpiado o usando modo incógnito
- [ ] Logs del backend muestran `✅ CORS permitido` para tu dominio
- [ ] No hay errores de CORS en la consola del navegador
- [ ] Los datos mostrados son correctos (no de otro cliente)

---

## 🔒 Dominios Automáticamente Permitidos

El código ahora permite automáticamente:

- ✅ `localhost:5173` (desarrollo local)
- ✅ `localhost:3001` (desarrollo alternativo)
- ✅ Cualquier dominio `.netlify.app`
- ✅ Cualquier dominio `.up.railway.app` (ej: `la-boveda-vip-production.up.railway.app`)
- ✅ Cualquier dominio `.onrender.com`
- ✅ Dominios hardcodeados (Sorteos Gama, Lucky Snap, etc.)

**Si tu dominio NO está en esta lista**, agrégalo en `CORS_ORIGINS` en Railway.

---

## 🐛 Troubleshooting

### Problema: Sigue mostrando datos antiguos

**Solución:**
1. Limpia el caché del navegador completamente
2. Reinicia el backend en Railway
3. Si usas Redis, limpia el caché de Redis
4. Verifica que la base de datos tenga los datos correctos

### Problema: Error de CORS en la consola

**Solución:**
1. Verifica que `CORS_ORIGINS` incluya tu dominio exacto (con https://)
2. Verifica que el backend se haya reiniciado después del cambio
3. Revisa los logs del backend para ver qué dominio está bloqueando

### Problema: Múltiples clientes comparten la misma base de datos

**Solución:**
- Cada cliente debe tener su propia base de datos PostgreSQL
- O usar un sistema de multi-tenancy (más complejo)
- Verifica que `settings.id = 'main_settings'` tenga los datos correctos

---

## 📝 Notas Importantes

1. **Cada cambio en `CORS_ORIGINS` requiere reiniciar el backend**
2. **El caché del navegador puede mantener datos antiguos hasta 30 minutos**
3. **El caché del backend (Redis) tiene TTL de 5-30 minutos según el tipo de dato**
4. **Los dominios de Railway (`.up.railway.app`) ahora se permiten automáticamente**

---

## 🔗 Referencias

- Archivo modificado: `backend/src/main.ts`
- Variables de entorno: `backend/env.example`
- Documentación CORS: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS



