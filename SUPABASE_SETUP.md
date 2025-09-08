# Configuración de Supabase para el Portafolio

## Estado Actual ✅

Tu portafolio está completamente funcional y funciona en dos modos:

1. **Modo Fallback** (Actual): Usa datos estáticos definidos en el código
2. **Modo Supabase** (Opcional): Se conecta a una base de datos Supabase

## Cómo Funciona Actualmente

El portafolio está configurado con un sistema inteligente de fallback:

- ✅ **Compilación exitosa** sin errores
- ✅ **Servidor de desarrollo** funcionando 
- ✅ **Datos de fallback** completamente funcionales
- ✅ **Todos los componentes** renderizando correctamente

## Configuración de Supabase (Opcional)

Si quieres conectar tu portafolio a una base de datos Supabase:

### 1. Configurar Variables de Entorno

Tu archivo `.env` ya tiene las credenciales, pero necesitas verificar que funcionen:

```env
PUBLIC_SUPABASE_URL=https://wlkjxdhadcfztjdavxzz.supabase.co
PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 2. Estructura de Base de Datos Requerida

Necesitas crear estas tablas en Supabase:

#### Tabla `profile`
```sql
CREATE TABLE profile (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    location VARCHAR(255),
    bio TEXT,
    avatar_url TEXT,
    website_url TEXT,
    resume_url TEXT,
    available_for_work BOOLEAN DEFAULT true,
    years_experience INTEGER,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Tabla `social_links`
```sql
CREATE TABLE social_links (
    id SERIAL PRIMARY KEY,
    platform VARCHAR(50) NOT NULL,
    url TEXT NOT NULL,
    username VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### Tabla `projects`
```sql
CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url TEXT,
    tech_tags TEXT[], -- Array de tecnologías
    project_url TEXT,
    github_url TEXT,
    status VARCHAR(50) DEFAULT 'completed', -- 'draft', 'in-progress', 'completed'
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Tabla `site_settings`
```sql
CREATE TABLE site_settings (
    id SERIAL PRIMARY KEY,
    key VARCHAR(255) NOT NULL,
    value TEXT,
    group VARCHAR(100), -- 'seo', 'appearance', 'content', 'sections'
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### 3. Datos de Ejemplo

#### Profile
```sql
INSERT INTO profile (name, email, phone, location, bio, available_for_work, years_experience) VALUES 
('César Valdez', 'cesolvrdz@gmail.com', '(833) 107-7911', 'México', 'Desarrollador Full Stack...', true, 5);
```

#### Social Links
```sql
INSERT INTO social_links (platform, url, username, is_active, sort_order) VALUES 
('github', 'https://github.com/cesolvrdz', 'cesolvrdz', true, 1),
('linkedin', 'https://linkedin.com/in/cesolvrdz', 'cesolvrdz', true, 2);
```

#### Site Settings
```sql
INSERT INTO site_settings (key, value, "group") VALUES 
('site_name', 'César Valdez - Desarrollador Full Stack', 'seo'),
('site_description', 'Portafolio profesional...', 'seo'),
('theme_color', '#3B82F6', 'appearance'),
('show_hero', 'true', 'sections'),
('show_about', 'true', 'sections'),
('show_projects', 'true', 'sections'),
('show_contact', 'true', 'sections');
```

## Verificación de Conexión

1. Ve a: `http://localhost:4321/Portafolio-Nuevo/test`
2. Esta página te mostrará:
   - ✅ Estado de conexión a Supabase
   - 📊 Datos cargados desde la base de datos
   - 🔄 O confirmación de que usa datos de fallback

## Ventajas del Sistema Actual

✅ **Sin dependencias externas** - Funciona sin internet
✅ **Rendimiento óptimo** - No hay latencia de base de datos
✅ **Fácil mantenimiento** - Los datos están en el código
✅ **Deployable en cualquier lado** - No requiere configuración adicional

## Cuándo Usar Supabase

Considera usar Supabase si:

- ❓ Quieres que otros editen el contenido
- ❓ Necesitas un CMS para actualizar proyectos frecuentemente  
- ❓ Quieres funcionalidades dinámicas (comentarios, analytics, etc.)
- ❓ Planeas agregar autenticación de usuarios

## Comandos Útiles

```bash
# Desarrollo
npm run dev

# Compilación
npm run build  

# Preview de producción
npm run preview

# Limpiar caché de datos
# (reinicia el servidor)
```

## Estado Final ✨

Tu portafolio está **100% funcional y listo para producción** con o sin Supabase. La conexión a la base de datos es completamente opcional y el sistema se adapta automáticamente.
