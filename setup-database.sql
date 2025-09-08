-- SCRIPT SQL PARA CREAR TODAS LAS TABLAS DEL PORTAFOLIO
-- Ejecuta esto en el SQL Editor de tu dashboard de Supabase

-- 1. Tabla de perfil
CREATE TABLE IF NOT EXISTS profile (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    location TEXT,
    bio TEXT,
    avatar_url TEXT,
    website_url TEXT,
    resume_url TEXT,
    available_for_work BOOLEAN DEFAULT true,
    years_experience INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tabla de enlaces sociales
CREATE TABLE IF NOT EXISTS social_links (
    id SERIAL PRIMARY KEY,
    platform TEXT NOT NULL,
    url TEXT NOT NULL,
    username TEXT,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Tabla de proyectos
CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    tech_tags TEXT[],
    project_url TEXT,
    github_url TEXT,
    status TEXT DEFAULT 'completed',
    is_featured BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Tabla de configuraciones del sitio
CREATE TABLE IF NOT EXISTS site_settings (
    id SERIAL PRIMARY KEY,
    key TEXT UNIQUE NOT NULL,
    value TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Insertar datos de ejemplo en profile
INSERT INTO profile (name, email, phone, location, bio, avatar_url, website_url, years_experience)
VALUES (
    'César Valdez',
    'cesolvrdz@gmail.com',
    '(833) 107-7911',
    'México',
    'Desarrollador Full Stack apasionado por crear soluciones web innovadoras y experiencias digitales excepcionales. Especializado en tecnologías modernas como React, Node.js, y bases de datos relacionales.',
    'https://via.placeholder.com/400x400/3B82F6/ffffff?text=CV',
    'https://cesolvrdz.dev',
    5
)
ON CONFLICT DO NOTHING;

-- 6. Insertar enlaces sociales de ejemplo
INSERT INTO social_links (platform, url, username, sort_order) VALUES
('github', 'https://github.com/cesolvrdz', 'cesolvrdz', 1),
('linkedin', 'https://linkedin.com/in/cesolvrdz', 'cesolvrdz', 2),
('twitter', 'https://twitter.com/cesolvrdz', 'cesolvrdz', 3)
ON CONFLICT DO NOTHING;

-- 7. Insertar proyectos de ejemplo
INSERT INTO projects (title, description, image_url, tech_tags, project_url, github_url, is_featured, sort_order) VALUES
(
    'E-commerce Platform',
    'Plataforma de comercio electrónico completa desarrollada con React y Node.js. Incluye sistema de pagos, gestión de inventario, y panel de administración.',
    'https://via.placeholder.com/600x400/06D6A0/ffffff?text=E-commerce',
    ARRAY['React', 'Node.js', 'MongoDB', 'Stripe', 'Express'],
    'https://github.com/cesolvrdz/ecommerce-platform',
    'https://github.com/cesolvrdz/ecommerce-platform',
    true,
    1
),
(
    'Task Management App',
    'Aplicación de gestión de tareas con funciones de colaboración en tiempo real. Desarrollada con Vue.js y Firebase.',
    'https://via.placeholder.com/600x400/F72585/ffffff?text=Tasks',
    ARRAY['Vue.js', 'Firebase', 'Vuetify', 'PWA'],
    'https://github.com/cesolvrdz/task-manager',
    'https://github.com/cesolvrdz/task-manager',
    true,
    2
),
(
    'Portfolio Website',
    'Sitio web de portafolio personal desarrollado con Astro y Tailwind CSS. Diseño responsive y optimizado para SEO.',
    'https://via.placeholder.com/600x400/4361EE/ffffff?text=Portfolio',
    ARRAY['Astro', 'Tailwind CSS', 'TypeScript', 'Supabase'],
    'https://cesolvrdz.dev',
    'https://github.com/cesolvrdz/portfolio',
    true,
    3
)
ON CONFLICT DO NOTHING;

-- 8. Insertar configuraciones del sitio
INSERT INTO site_settings (key, value, description) VALUES
('site_name', 'César Valdez - Desarrollador Full Stack', 'Nombre del sitio web'),
('site_description', 'Portafolio profesional de César Valdez, desarrollador full stack especializado en tecnologías web modernas.', 'Descripción del sitio'),
('theme_color', '#3B82F6', 'Color principal del tema'),
('show_hero', 'true', 'Mostrar sección hero'),
('show_about', 'true', 'Mostrar sección acerca de'),
('show_projects', 'true', 'Mostrar sección proyectos'),
('show_contact', 'true', 'Mostrar sección contacto'),
('projects_title', 'Mis Proyectos', 'Título de la sección de proyectos'),
('projects_description', 'Una selección de mis trabajos recientes y proyectos destacados.', 'Descripción de la sección de proyectos'),
('about_title', 'Acerca de Mí', 'Título de la sección acerca de'),
('contact_title', 'Contacto', 'Título de la sección de contacto'),
('seo_title', 'César Valdez - Desarrollador Full Stack | Portafolio', 'Título SEO'),
('seo_description', 'Desarrollador Full Stack con 5+ años de experiencia. Especializado en React, Node.js, y tecnologías modernas.', 'Descripción SEO'),
('google_analytics', '', 'ID de Google Analytics')
ON CONFLICT (key) DO NOTHING;

-- 9. Habilitar Row Level Security (RLS) - Opcional para seguridad
ALTER TABLE profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- 10. Crear políticas para permitir lectura pública
CREATE POLICY "Enable read access for all users" ON profile FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON social_links FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON projects FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON site_settings FOR SELECT USING (true);

-- ¡LISTO! Tu base de datos ya tiene todos los datos necesarios
-- Ahora tu portafolio debería mostrar toda la información automáticamente
