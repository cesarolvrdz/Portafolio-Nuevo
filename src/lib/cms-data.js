// ========================================
// INTEGRACIÓN ESPECÍFICA CON CMS LARAVEL
// Configurado para la estructura exacta de tu base de datos
// ========================================

import { supabase, isSupabaseConfigured } from './supabase.js';

/**
 * OBTENER PERFIL DESDE CMS
 * Estructura específica del CMS Laravel: profile tabla
 */
export async function getProfile() {
  if (!isSupabaseConfigured) {
    console.warn('⚠️ Supabase no configurado, usando datos de fallback');
    return getFallbackProfile();
  }

  try {
    console.log('🔄 Cargando perfil desde CMS...');
    
    const { data, error } = await supabase
      .from('profile')
      .select(`
        id,
        name,
        title,
        bio,
        email,
        location,
        phone,
        resume_url,
        skills,
        avatar_url,
        is_active,
        created_at,
        updated_at
      `)
      .eq('is_active', true)
      .single();

    if (error) {
      console.error('❌ Error al obtener perfil:', error);
      return getFallbackProfile();
    }

    if (data) {
      console.log('✅ Perfil desde CMS');
      
      // Procesar skills si vienen como JSONB
      if (data.skills) {
        try {
          data.skills = typeof data.skills === 'string' 
            ? JSON.parse(data.skills) 
            : data.skills;
        } catch (e) {
          console.warn('Skills no es JSON válido');
          data.skills = [];
        }
      }
      
      return data;
    }

    return getFallbackProfile();
  } catch (error) {
    console.error('❌ Error de conexión al obtener perfil:', error);
    return getFallbackProfile();
  }
}

/**
 * OBTENER PROYECTOS DESDE CMS
 * Estructura específica: projects tabla
 */
export async function getProjects() {
  if (!isSupabaseConfigured) {
    console.warn('⚠️ Supabase no configurado, usando datos de fallback');
    return getFallbackProjects();
  }

  try {
    console.log('🔄 Cargando proyectos desde CMS...');
    
    const { data, error } = await supabase
      .from('projects')
      .select(`
        id,
        title,
        description,
        github_url,
        demo_url,
        image_url,
        status,
        featured,
        created_at,
        updated_at
      `)
      .order('featured', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error al obtener proyectos:', error);
      return getFallbackProjects();
    }

    if (data && data.length > 0) {
      console.log(`✅ ${data.length} proyectos desde CMS`);
      
      // Procesar technologies si vienen como JSONB
      return data.map(project => ({
        ...project,
        technologies: typeof project.technologies === 'string' 
          ? JSON.parse(project.technologies) 
          : project.technologies || []
      }));
    }

    return getFallbackProjects();
  } catch (error) {
    console.error('❌ Error de conexión al obtener proyectos:', error);
    return getFallbackProjects();
  }
}

/**
 * OBTENER PROYECTOS DESTACADOS
 */
export async function getFeaturedProjects() {
  if (!isSupabaseConfigured) {
    return getFallbackProjects().filter(p => p.featured);
  }

  try {
    console.log('🔄 Cargando proyectos destacados desde CMS...');
    
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('status', 'active')
      .eq('featured', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error al obtener proyectos destacados:', error);
      return getFallbackProjects().filter(p => p.featured);
    }

    if (data && data.length > 0) {
      console.log(`✅ ${data.length} proyectos destacados desde CMS`);
      return data.map(project => ({
        ...project,
        technologies: typeof project.technologies === 'string' 
          ? JSON.parse(project.technologies) 
          : project.technologies || []
      }));
    }

    return getFallbackProjects().filter(p => p.featured);
  } catch (error) {
    console.error('❌ Error de conexión al obtener proyectos destacados:', error);
    return getFallbackProjects().filter(p => p.featured);
  }
}

/**
 * OBTENER ENLACES SOCIALES DESDE CMS
 * Estructura específica: social_links tabla
 */
export async function getSocialLinks() {
  if (!isSupabaseConfigured) {
    console.warn('⚠️ Supabase no configurado, usando datos de fallback');
    return getFallbackSocialLinks();
  }

  try {
    console.log('🔄 Cargando enlaces sociales desde CMS...');
    
    const { data, error } = await supabase
      .from('social_links')
      .select(`
        id,
        platform,
        url,
        icon,
        is_active,
        created_at,
        updated_at
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('❌ Error al obtener enlaces sociales:', error);
      return getFallbackSocialLinks();
    }

    if (data && data.length > 0) {
      console.log(`✅ ${data.length} enlaces sociales desde CMS`);
      return data;
    }

    return getFallbackSocialLinks();
  } catch (error) {
    console.error('❌ Error de conexión al obtener enlaces sociales:', error);
    return getFallbackSocialLinks();
  }
}

/**
 * OBTENER CONFIGURACIONES DEL SITIO DESDE CMS
 * Estructura específica: site_settings tabla
 */
export async function getSiteSettings(group = null) {
  if (!isSupabaseConfigured) {
    console.warn('⚠️ Supabase no configurado, usando datos de fallback');
    return getFallbackSiteSettings();
  }

  try {
    console.log('🔄 Cargando configuraciones desde CMS...');
    
    let query = supabase
      .from('site_settings')
      .select(`
        id,
        key,
        value,
        group,
        description,
        type,
        created_at,
        updated_at
      `);
    
    if (group) {
      query = query.eq('group', group);
    }

    const { data, error } = await query;

    if (error) {
      console.error('❌ Error al obtener configuraciones:', error);
      return getFallbackSiteSettings();
    }

    if (data && data.length > 0) {
      console.log(`✅ ${data.length} configuraciones desde CMS`);
      
      // Convertir a objeto clave-valor para fácil acceso
      const settings = {};
      data.forEach(setting => {
        let value = setting.value;
        
        // Procesar según el tipo
        if (setting.type === 'boolean') {
          value = value === 'true' || value === true;
        } else if (setting.type === 'json') {
          try {
            value = JSON.parse(value);
          } catch (e) {
            console.warn(`No se pudo parsear JSON para ${setting.key}`);
          }
        }
        
        settings[setting.key] = value;
      });
      
      return settings;
    }

    return getFallbackSiteSettings();
  } catch (error) {
    console.error('❌ Error de conexión al obtener configuraciones:', error);
    return getFallbackSiteSettings();
  }
}

// ========================================
// DATOS DE FALLBACK
// ========================================

function getFallbackProfile() {
  return {
    id: 1,
    name: 'César Olvera Rodríguez',
    title: 'Desarrollador Full Stack',
    bio: 'Desarrollador Full Stack apasionado por crear soluciones web innovadoras y experiencias digitales excepcionales.',
    email: 'cesolvrdz@gmail.com',
    location: 'México',
    phone: '(833) 107-7911',
    resume_url: '/cv.pdf',
    skills: ['JavaScript', 'React', 'Node.js', 'Laravel', 'Vue.js', 'PHP', 'MySQL'],
    avatar_url: null,
    is_active: true
  };
}

function getFallbackProjects() {
  return [
    {
      id: 1,
      title: 'Proyecto de Ejemplo',
      description: 'Descripción completa del proyecto...',
      technologies: ['React', 'Node.js', 'MongoDB'],
      github_url: 'https://github.com/cesarolvrdz/proyecto',
      demo_url: 'https://proyecto.vercel.app',
      image_url: '/api/placeholder/600/400',
      status: 'completed',
      featured: true,
      created_at: '2025-01-01'
    }
  ];
}

function getFallbackSocialLinks() {
  return [
    {
      id: 1,
      platform: 'github',
      url: 'https://github.com/cesarolvrdz',
      icon: 'fab fa-github',
      is_active: true,
    },
    {
      id: 2,
      platform: 'twitter',
      url: 'https://twitter.com/cesarolvrdz',
      icon: 'fab fa-twitter',
      is_active: true,
    }
  ];
}

function getFallbackSiteSettings() {
  return {
    site_title: 'César Olvera Rodríguez - Desarrollador Full Stack',
    site_description: 'Portafolio profesional de César Olvera Rodríguez',
    hero_title: 'César Olvera Rodríguez',
    hero_subtitle: 'Desarrollador Full Stack',
    show_about: true,
    show_projects: true,
    show_contact: true
  };
}
