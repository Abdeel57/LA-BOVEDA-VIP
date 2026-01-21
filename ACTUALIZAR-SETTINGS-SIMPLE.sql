-- =====================================================
-- ACTUALIZAR SETTINGS A "LA BOVEDA VIP"
-- =====================================================
-- Copia y pega esto en Railway → PostgreSQL → Query

-- Paso 1: Actualizar el nombre del sitio
UPDATE settings 
SET 
    "siteName" = 'LA BOVEDA VIP',
    "updatedAt" = NOW()
WHERE id = 'main_settings';

-- Paso 2: Si no existe, crearlo
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

-- Paso 3: Verificar que se actualizó
SELECT 
    id, 
    "siteName", 
    "updatedAt"
FROM settings 
WHERE id = 'main_settings';

-- =====================================================
-- RESULTADO ESPERADO:
-- id: main_settings
-- siteName: LA BOVEDA VIP
-- updatedAt: [fecha reciente]
-- =====================================================

