# 🚀 Instrucciones para Ejecutar el Script de Actualización

## ✅ Paso 1: Instalar pg (si no lo tienes)

Abre PowerShell o CMD en la raíz del proyecto y ejecuta:

```bash
cd backend
npm install pg
```

O desde la raíz:

```bash
npm install --prefix backend pg
```

---

## ✅ Paso 2: Ejecutar el Script

### Opción A: Si la tabla settings YA existe

```bash
node actualizar-settings-directo.js
```

### Opción B: Si la tabla settings NO existe (primera vez)

Primero crea la tabla:

```bash
node crear-tabla-settings.js
```

Luego actualiza los settings:

```bash
node actualizar-settings-directo.js
```

---

## 📋 Qué Hace el Script

1. ✅ Se conecta a tu base de datos en Railway
2. ✅ Verifica los settings actuales
3. ✅ Actualiza el `siteName` a "LA BOVEDA VIP"
4. ✅ Crea el registro si no existe
5. ✅ Verifica que se actualizó correctamente

---

## 🎯 Resultado Esperado

Deberías ver algo como:

```
🔌 Conectando a la base de datos...
✅ Conectado exitosamente

📋 Verificando settings actuales...
Settings actuales: { id: 'main_settings', siteName: 'Lucky Snap', ... }

🔄 Actualizando settings a "LA BOVEDA VIP"...
✅ Settings actualizados: 1 fila(s) afectada(s)

✅ Verificando cambios...
✅ Settings actualizados correctamente:
{ id: 'main_settings', siteName: 'LA BOVEDA VIP', ... }

🎉 ¡Actualización completada exitosamente!

📝 Próximos pasos:
1. Reinicia el backend en Railway
2. Limpia el caché del navegador
3. Recarga la página en modo incógnito

🔌 Desconectado de la base de datos
```

---

## 🐛 Si Hay Errores

### Error: "Cannot find module 'pg'"

**Solución:**
```bash
npm install pg
```

### Error: "relation settings does not exist"

**Solución:** Ejecuta primero:
```bash
node crear-tabla-settings.js
```

### Error: "connection refused" o "timeout"

**Posibles causas:**
- La URL de la base de datos cambió
- Railway está caído
- Problemas de conexión a internet

**Solución:** Verifica la URL en Railway → Variables → `DATABASE_URL`

---

## ✅ Después de Ejecutar el Script

### 1. Reiniciar el Backend en Railway

1. Ve a Railway → https://railway.app
2. Selecciona tu proyecto → Tu servicio backend
3. Click en **"Restart"** (o los 3 puntos → Restart)
4. Espera a que reinicie

### 2. Limpiar Caché del Navegador

**Método Rápido:**
- Presiona `Ctrl + Shift + N` (modo incógnito)
- Abre tu sitio

**Método Completo:**
- Presiona `Ctrl + Shift + Delete`
- Selecciona "Caché de imágenes y archivos"
- Click en "Borrar datos"

### 3. Verificar

1. Abre tu sitio en modo incógnito
2. Presiona `F12` (consola)
3. Busca: `✅ Backend settings loaded successfully`
4. Verifica que muestre **"LA BOVEDA VIP"**

---

## 💡 Alternativa: Usar el Panel de Admin

Si prefieres no ejecutar scripts, puedes:

1. Ve a tu sitio: `https://tu-frontend.netlify.app/admin/login`
2. Inicia sesión
3. Ve a **"Configuración"** o **"Settings"**
4. Cambia **"Nombre del sitio"** a: `LA BOVEDA VIP`
5. Guarda

Esto también actualizará la base de datos y limpiará el caché automáticamente.

---

## 🚀 ¿Listo?

Ejecuta el script y dime qué resultado obtuviste. Si hay algún error, cópialo completo y te ayudo a solucionarlo.

