-- =====================================================
-- Script para Actualizar Settings de LA BOVEDA VIP
-- =====================================================
-- Este script actualiza el nombre del sitio y otros datos básicos
-- Ejecuta esto en Railway → Tu Base de Datos → Query

-- 1. Ver los settings actuales
SELECT 
    id, 
    "siteName", 
    "primaryColor", 
    "accentColor",
    "updatedAt"
FROM settings 
WHERE id = 'main_settings';

-- 2. Actualizar el nombre del sitio a "LA BOVEDA VIP"
UPDATE settings 
SET 
    "siteName" = 'LA BOVEDA VIP',
    "updatedAt" = NOW()
WHERE id = 'main_settings';

-- Si no existe el registro, crearlo
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

-- 3. Verificar que se actualizó correctamente
SELECT 
    id, 
    "siteName", 
    "updatedAt"
FROM settings 
WHERE id = 'main_settings';

-- =====================================================
-- NOTA: Después de ejecutar esto, necesitas:
-- 1. Reiniciar el backend en Railway (para limpiar caché)
-- 2. Limpiar el caché del navegador
-- 3. Recargar la página
-- =====================================================

