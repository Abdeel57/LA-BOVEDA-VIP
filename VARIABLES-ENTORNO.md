# 🔐 Variables de Entorno - LA BOVEDA VIP

Esta guía detalla todas las variables de entorno que necesitas configurar para el frontend y backend.

---

## 📱 FRONTEND

### Ubicación del archivo
Crea un archivo `.env` en la raíz del directorio `frontend/`

### Variables Requeridas

```env
# Entorno de ejecución
NODE_ENV=development

# URL del API Backend
# En desarrollo: http://localhost:3000/api
# En producción: https://tu-backend.railway.app/api o tu URL de producción
VITE_API_URL=http://localhost:3000/api
```

### Variables Opcionales

```env
# API Key de Gemini (si usas funciones de IA)
# GEMINI_API_KEY=tu_api_key_de_gemini_aqui
```

### 📝 Notas Importantes para Frontend

- **`VITE_API_URL`**: 
  - En desarrollo local, el proxy de Vite redirige automáticamente `/api` a `http://localhost:3000`
  - En producción, DEBES configurar esta variable con la URL completa de tu backend
  - Ejemplo producción: `VITE_API_URL=https://tu-backend.railway.app/api`

- **Prefijo `VITE_`**: 
  - Todas las variables de entorno en Vite deben tener el prefijo `VITE_` para ser accesibles en el código del cliente
  - Solo las variables con este prefijo estarán disponibles en `import.meta.env`

---

## 🖥️ BACKEND

### Ubicación del archivo
Crea un archivo `.env` en la raíz del directorio `backend/`

### Variables Requeridas (Obligatorias)

```env
# Base de Datos PostgreSQL
# Formato: postgresql://usuario:contraseña@host:puerto/nombre_base_datos
# Ejemplo Railway: postgresql://postgres:password@host.railway.app:5432/railway
DATABASE_URL=postgresql://user:password@host:port/database

# Configuración del Servidor
NODE_ENV=development
PORT=3000

# Seguridad - JWT Secret
# ⚠️ IMPORTANTE: Cambia esto por una clave secreta fuerte y única
# Genera una clave segura: puedes usar openssl rand -base64 32
JWT_SECRET=tu_clave_secreta_super_segura_aqui_cambiar_en_produccion

# CORS - URLs permitidas (separadas por comas)
# Incluye todas las URLs donde se desplegará tu frontend
CORS_ORIGINS=http://localhost:5173,http://localhost:3001,https://tu-dominio.netlify.app
```

### Variables Opcionales

```env
# Redis Cache (Opcional pero recomendado para producción)
# Si no se configura, el sistema usará caché en memoria
# Formato: redis://usuario:contraseña@host:puerto
# Ejemplo Railway: redis://default:password@host.railway.app:6379
REDIS_URL=redis://user:password@host:port

# Cloudinary - Para subida de imágenes (Opcional)
# Si no se configura, las imágenes se guardarán localmente
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret

# Meta Pixel ID (Opcional - para tracking de Facebook/Meta)
# Si no se configura, se usará un ID por defecto
META_PIXEL_ID=1234567890123456

# Render Deploy Hook (Opcional - solo si usas Render)
RENDER_DEPLOY_HOOK=https://api.render.com/deploy/srv-xxx
```

---

## 🚀 Configuración por Entorno

### Desarrollo Local

#### Frontend `.env`
```env
NODE_ENV=development
VITE_API_URL=http://localhost:3000/api
```

#### Backend `.env`
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/labovedavip
NODE_ENV=development
PORT=3000
JWT_SECRET=dev_secret_key_change_in_production
CORS_ORIGINS=http://localhost:5173,http://localhost:3001
```

### Producción (Railway/Netlify)

#### Frontend `.env` (en Netlify o tu plataforma de hosting)
```env
NODE_ENV=production
VITE_API_URL=https://tu-backend.railway.app/api
```

#### Backend `.env` (en Railway)
```env
DATABASE_URL=postgresql://postgres:password@host.railway.app:5432/railway
NODE_ENV=production
PORT=3000
JWT_SECRET=clave_super_secreta_generada_aleatoriamente
CORS_ORIGINS=https://tu-dominio.netlify.app,https://www.tu-dominio.com
REDIS_URL=redis://default:password@host.railway.app:6379
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
META_PIXEL_ID=tu_pixel_id_real
```

---

## 📋 Checklist de Configuración

### Frontend
- [ ] Crear archivo `frontend/.env`
- [ ] Configurar `VITE_API_URL` con la URL de tu backend
- [ ] En producción, asegurarse de que la URL sea HTTPS
- [ ] Verificar que `NODE_ENV` esté configurado correctamente

### Backend
- [ ] Crear archivo `backend/.env`
- [ ] Configurar `DATABASE_URL` con tu conexión PostgreSQL
- [ ] Generar y configurar `JWT_SECRET` (clave segura)
- [ ] Configurar `CORS_ORIGINS` con todas las URLs del frontend
- [ ] Configurar `PORT` (Railway lo puede asignar automáticamente)
- [ ] (Opcional) Configurar `REDIS_URL` para caché mejorado
- [ ] (Opcional) Configurar Cloudinary para imágenes
- [ ] (Opcional) Configurar `META_PIXEL_ID` para tracking

---

## 🔒 Seguridad

### ⚠️ IMPORTANTE - Archivos que NO deben subirse a Git

Los siguientes archivos están en `.gitignore` y NO deben subirse:

- `frontend/.env`
- `backend/.env`
- `config-cliente.json` (contiene datos sensibles)
- Cualquier archivo con credenciales

### Generar JWT_SECRET Seguro

En Linux/Mac:
```bash
openssl rand -base64 32
```

En Windows (PowerShell):
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

O usa un generador online seguro: https://randomkeygen.com/

---

## 🛠️ Troubleshooting

### Frontend no se conecta al Backend

1. Verifica que `VITE_API_URL` esté configurada correctamente
2. En producción, asegúrate de usar HTTPS
3. Verifica que el backend esté corriendo y accesible
4. Revisa la consola del navegador para errores de CORS

### Backend no se conecta a la Base de Datos

1. Verifica que `DATABASE_URL` tenga el formato correcto
2. Asegúrate de que la base de datos esté accesible desde tu servidor
3. Verifica credenciales (usuario, contraseña, host, puerto)
4. En Railway, verifica que la base de datos esté vinculada al servicio

### Errores de CORS

1. Verifica que la URL del frontend esté en `CORS_ORIGINS`
2. Asegúrate de incluir todas las variantes (con/sin www, http/https)
3. En producción, usa HTTPS en ambas URLs

### Redis no funciona

- El sistema funciona sin Redis usando caché en memoria
- Si quieres Redis, verifica que `REDIS_URL` tenga el formato correcto
- En Railway, agrega Redis como servicio adicional

---

## 📚 Referencias

- Archivos de ejemplo:
  - `frontend/.env.example` (no existe, usa este documento)
  - `backend/env.example`
- Documentación adicional:
  - `backend/REDIS_SETUP.md` - Configuración de Redis
  - `DEPLOY-BACKEND-RAILWAY.md` - Despliegue en Railway



