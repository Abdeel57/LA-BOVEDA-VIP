# 🚀 Ejecutar Actualización de Settings - LA BOVEDA VIP

## ✅ Opción 1: Ejecutar Script Node.js (Recomendado)

### Paso 1: Instalar dependencias (si no las tienes)

```bash
cd backend
npm install
```

### Paso 2: Configurar la URL de la base de datos

El script ya tiene tu URL configurada, pero puedes verificar:

```bash
# En Windows PowerShell
$env:DATABASE_URL="postgresql://user:password@host:port/database"

# O crear un archivo .env en backend/ con:
# DATABASE_URL=postgresql://user:password@host:port/database
```

### Paso 3: Ejecutar el script

```bash
# Desde la raíz del proyecto
node actualizar-settings.js
```

**O si estás en el directorio backend:**

```bash
cd ..
node actualizar-settings.js
```

---

## ✅ Opción 2: Ejecutar SQL Directamente en Railway

### Paso 1: Ve a Railway

1. Abre https://railway.app
2. Inicia sesión
3. Selecciona tu proyecto
4. Click en tu servicio **PostgreSQL**

### Paso 2: Abre la Consola SQL

1. Click en la pestaña **"Query"** o **"Data"**
2. O busca **"Query"** en el menú

### Paso 3: Copia y Pega este SQL

```sql
-- Actualizar settings a LA BOVEDA VIP
INSERT INTO settings (
    id,
    "siteName",
    "logoAnimation",
    "primaryColor",
    "secondaryColor",
    "accentColor",
    "actionColor",
    "paymentAccounts",
    "faqs",
    "createdAt",
    "updatedAt"
)
VALUES (
    'main_settings',
    'LA BOVEDA VIP',
    'rotate',
    '#111827',
    '#1f2937',
    '#ec4899',
    '#0ea5e9',
    '[]'::jsonb,
    '[]'::jsonb,
    NOW(),
    NOW()
)
ON CONFLICT (id) DO UPDATE SET
    "siteName" = EXCLUDED."siteName",
    "updatedAt" = NOW();

-- Verificar que se actualizó
SELECT id, "siteName", "updatedAt" 
FROM settings 
WHERE id = 'main_settings';
```

### Paso 4: Ejecuta el SQL

1. Click en **"Run"** o **"Execute"**
2. Deberías ver: `1 row affected` o similar
3. Y en la segunda query verás: `siteName: 'LA BOVEDA VIP'`

---

## ✅ Opción 3: Usar Railway CLI

### Paso 1: Instalar Railway CLI

```bash
# En PowerShell (Windows)
iwr https://railway.app/install.ps1 | iex

# O con npm
npm install -g @railway/cli
```

### Paso 2: Conectar a Railway

```bash
railway login
railway link
```

### Paso 3: Ejecutar el SQL

```bash
railway run psql < ACTUALIZAR-SETTINGS-LA-BOVEDA-VIP.sql
```

---

## 🔍 Verificar que Funcionó

Después de ejecutar cualquiera de las opciones, verifica:

### En Railway (Query):

```sql
SELECT id, "siteName", "updatedAt" 
FROM settings 
WHERE id = 'main_settings';
```

Deberías ver:
```
id: 'main_settings'
siteName: 'LA BOVEDA VIP'
updatedAt: [fecha reciente]
```

---

## 📝 Próximos Pasos DESPUÉS de Actualizar la BD

### 1. Reiniciar el Backend en Railway

1. Ve a Railway → Tu servicio backend
2. Click en **"Restart"** o los 3 puntos → **Restart**
3. Espera a que reinicie (verás los logs)

### 2. Limpiar Caché del Navegador

**Método Rápido:**
- Presiona `Ctrl + Shift + N` (modo incógnito)
- Abre tu sitio

**Método Completo:**
- Presiona `Ctrl + Shift + Delete`
- Selecciona "Caché de imágenes y archivos"
- Click en "Borrar datos"

### 3. Verificar que Funciona

1. Abre tu sitio en modo incógnito
2. Presiona `F12` (consola)
3. Busca: `✅ Backend settings loaded successfully`
4. Verifica que el sitio muestre **"LA BOVEDA VIP"**

---

## 🐛 Si Hay Errores

### Error: "relation settings does not exist"

**Solución:** La tabla no existe. Ejecuta primero:

```sql
-- Crear tabla settings si no existe
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
);
```

### Error: "connection refused" o "timeout"

**Solución:** 
- Verifica que la URL de la base de datos sea correcta
- Verifica que Railway esté funcionando
- Intenta desde Railway directamente (Opción 2)

---

## ✅ Checklist

- [ ] SQL ejecutado correctamente (1 row affected)
- [ ] Settings verificados (siteName = 'LA BOVEDA VIP')
- [ ] Backend reiniciado en Railway
- [ ] Caché del navegador limpiado
- [ ] Sitio muestra "LA BOVEDA VIP" correctamente

---

## 🚀 ¿Cuál Opción Prefieres?

1. **Opción 1 (Script Node.js)** - Más fácil si tienes Node.js instalado
2. **Opción 2 (Railway Query)** - Más visual, desde la interfaz web
3. **Opción 3 (Railway CLI)** - Para usuarios avanzados

**Recomendación:** Empieza con **Opción 2** (Railway Query) porque es la más visual y fácil de verificar.


