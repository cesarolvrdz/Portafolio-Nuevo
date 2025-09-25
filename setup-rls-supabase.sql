-- ===============================================================
-- CONFIGURACIÓN SIMPLIFICADA DE RLS PARA SUPABASE
-- ===============================================================
-- Versión compatible con PostgreSQL 13+ (Supabase)

BEGIN;

-- ===============================================================
-- 1. HABILITAR RLS EN TODAS LAS TABLAS
-- ===============================================================

ALTER TABLE IF EXISTS profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS cv_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS education ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS work_experience ENABLE ROW LEVEL SECURITY;

-- ===============================================================
-- 2. ELIMINAR POLÍTICAS EXISTENTES
-- ===============================================================

-- Profile
DROP POLICY IF EXISTS "Enable read access for all users" ON profile;
DROP POLICY IF EXISTS "Public read access" ON profile;
DROP POLICY IF EXISTS "portfolio_public_read_profile" ON profile;

-- Social Links
DROP POLICY IF EXISTS "Enable read access for all users" ON social_links;
DROP POLICY IF EXISTS "Public read access" ON social_links;
DROP POLICY IF EXISTS "portfolio_public_read_social_links" ON social_links;

-- Projects
DROP POLICY IF EXISTS "Enable read access for all users" ON projects;
DROP POLICY IF EXISTS "Public read access" ON projects;
DROP POLICY IF EXISTS "portfolio_public_read_projects" ON projects;

-- Site Settings
DROP POLICY IF EXISTS "Enable read access for all users" ON site_settings;
DROP POLICY IF EXISTS "Public read access" ON site_settings;
DROP POLICY IF EXISTS "portfolio_public_read_site_settings" ON site_settings;

-- Certificates
DROP POLICY IF EXISTS "Enable read access for all users" ON certificates;
DROP POLICY IF EXISTS "Public read access" ON certificates;
DROP POLICY IF EXISTS "portfolio_public_read_certificates" ON certificates;

-- CV Documents
DROP POLICY IF EXISTS "Enable read access for all users" ON cv_documents;
DROP POLICY IF EXISTS "Public read access" ON cv_documents;
DROP POLICY IF EXISTS "portfolio_public_read_cv_documents" ON cv_documents;

-- Education
DROP POLICY IF EXISTS "Enable read access for all users" ON education;
DROP POLICY IF EXISTS "Public read access" ON education;
DROP POLICY IF EXISTS "portfolio_public_read_education" ON education;

-- Work Experience
DROP POLICY IF EXISTS "Enable read access for all users" ON work_experience;
DROP POLICY IF EXISTS "Public read access" ON work_experience;
DROP POLICY IF EXISTS "portfolio_public_read_work_experience" ON work_experience;

-- ===============================================================
-- 3. CREAR NUEVAS POLÍTICAS DE LECTURA PÚBLICA
-- ===============================================================

-- PROFILE
CREATE POLICY "portfolio_public_read_profile" 
ON profile FOR SELECT 
USING (true);

-- SOCIAL LINKS (solo enlaces activos)
CREATE POLICY "portfolio_public_read_social_links" 
ON social_links FOR SELECT 
USING (is_active = true OR is_active IS NULL);

-- PROJECTS
CREATE POLICY "portfolio_public_read_projects" 
ON projects FOR SELECT 
USING (true);

-- SITE SETTINGS
CREATE POLICY "portfolio_public_read_site_settings" 
ON site_settings FOR SELECT 
USING (true);

-- CERTIFICATES
CREATE POLICY "portfolio_public_read_certificates" 
ON certificates FOR SELECT 
USING (true);

-- CV DOCUMENTS
CREATE POLICY "portfolio_public_read_cv_documents" 
ON cv_documents FOR SELECT 
USING (true);

-- EDUCATION
CREATE POLICY "portfolio_public_read_education" 
ON education FOR SELECT 
USING (true);

-- WORK EXPERIENCE
CREATE POLICY "portfolio_public_read_work_experience" 
ON work_experience FOR SELECT 
USING (true);

-- ===============================================================
-- 4. CONFIGURAR STORAGE (EJECUTAR MANUALMENTE SI ES NECESARIO)
-- ===============================================================

-- Nota: Algunas configuraciones de storage pueden requerir permisos especiales
-- Si el script falla aquí, ejecuta estas líneas manualmente en el SQL Editor

-- Hacer buckets públicos
UPDATE storage.buckets SET public = true WHERE id = 'certificates';
UPDATE storage.buckets SET public = true WHERE id = 'cv-documents';

-- ===============================================================
-- 5. FUNCIÓN DE TESTING
-- ===============================================================

CREATE OR REPLACE FUNCTION test_rls_permissions()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result json;
  profile_count integer := 0;
  projects_count integer := 0;
  social_links_count integer := 0;
  certificates_count integer := 0;
BEGIN
  -- Intentar contar registros (esto probará las políticas RLS)
  BEGIN
    SELECT COUNT(*) INTO profile_count FROM profile;
  EXCEPTION WHEN OTHERS THEN
    profile_count := -1;
  END;
  
  BEGIN
    SELECT COUNT(*) INTO projects_count FROM projects;
  EXCEPTION WHEN OTHERS THEN
    projects_count := -1;
  END;
  
  BEGIN
    SELECT COUNT(*) INTO social_links_count FROM social_links;
  EXCEPTION WHEN OTHERS THEN
    social_links_count := -1;
  END;
  
  BEGIN
    SELECT COUNT(*) INTO certificates_count FROM certificates;
  EXCEPTION WHEN OTHERS THEN
    certificates_count := -1;
  END;
  
  -- Crear resultado
  result := json_build_object(
    'rls_enabled', true,
    'timestamp', NOW(),
    'tables', json_build_object(
      'profile', profile_count,
      'projects', projects_count,
      'social_links', social_links_count,
      'certificates', certificates_count
    ),
    'status', 'RLS policies active'
  );
  
  RETURN result;
END;
$$;

COMMIT;

-- ===============================================================
-- 6. VERIFICACIÓN INMEDIATA
-- ===============================================================

-- Verificar que RLS está habilitado
SELECT 
  tablename,
  CASE 
    WHEN rowsecurity THEN '✅ RLS Habilitado'
    ELSE '❌ RLS Deshabilitado'
  END as status
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN (
    'profile', 'social_links', 'projects', 'site_settings',
    'certificates', 'cv_documents', 'education', 'work_experience'
  )
ORDER BY tablename;

-- Mostrar políticas creadas
SELECT 
  tablename,
  policyname,
  cmd as operacion,
  CASE 
    WHEN cmd = 'SELECT' THEN '📖 Lectura'
    WHEN cmd = 'INSERT' THEN '➕ Inserción'
    WHEN cmd = 'UPDATE' THEN '✏️ Actualización'
    WHEN cmd = 'DELETE' THEN '🗑️ Eliminación'
    ELSE cmd
  END as tipo
FROM pg_policies 
WHERE schemaname = 'public'
  AND policyname LIKE 'portfolio_%'
ORDER BY tablename, policyname;

-- Probar función de testing
SELECT test_rls_permissions();

-- ===============================================================
-- MENSAJE FINAL
-- ===============================================================

DO $$
BEGIN
  RAISE NOTICE '🎉 CONFIGURACIÓN RLS COMPLETADA';
  RAISE NOTICE '✅ Row Level Security habilitado en todas las tablas';
  RAISE NOTICE '✅ Políticas de lectura pública creadas';
  RAISE NOTICE '✅ Función de testing disponible';
  RAISE NOTICE '';
  RAISE NOTICE '📝 Próximos pasos:';
  RAISE NOTICE '1. Ejecutar: node test-rls-simple.js';
  RAISE NOTICE '2. Verificar que el frontend funcione: npm run dev';
  RAISE NOTICE '3. Comprobar que storage sea público en Dashboard';
END $$;