import { supabase, isSupabaseConfigured } from './supabase.js';

// Cache para optimizar rendimiento
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

function getCacheKey(tableName, options = {}) {
  return `${tableName}_${JSON.stringify(options)}`;
}

function setCache(key, data) {
  cache.set(key, {
    data,
    timestamp: Date.now()
  });
}

function getCache(key) {
  const cached = cache.get(key);
  if (!cached) return null;
  
  const isExpired = Date.now() - cached.timestamp > CACHE_TTL;
  if (isExpired) {
    cache.delete(key);
    return null;
  }
  
  return cached.data;
}

// Datos de fallback
const fallbackData = {
  profile: {
    id: 1,
    name: 'César Valdez',
    email: 'cesolvrdz@gmail.com',
    phone: '(833) 107-7911',
    location: 'México',
    bio: 'Desarrollador Full Stack apasionado por crear soluciones web innovadoras y experiencias digitales excepcionales. Con experiencia en tecnologías modernas como React, Node.js, y bases de datos relacionales.',
    avatar_url: '/api/placeholder/400/400',
    website_url: 'https://cesolvrdz.dev',
    resume_url: '/cv.pdf',
    available_for_work: true,
    years_experience: 5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  socialLinks: [
    {
      id: 1,
      platform: 'github',
      url: 'https://github.com/cesolvrdz',
      username: 'cesolvrdz',
      is_active: true,
      sort_order: 1
    },
    {
      id: 2,
      platform: 'linkedin',
      url: 'https://linkedin.com/in/cesolvrdz',
      username: 'cesolvrdz',
      is_active: true,
      sort_order: 2
    }
  ],
  projects: [
    {
      id: 1,
      title: 'E-commerce Platform',
      description: 'Plataforma de comercio electrónico desarrollada con React y Node.js',
      image_url: '/api/placeholder/600/400',
      tech_tags: ['React', 'Node.js', 'MongoDB', 'Stripe'],
      project_url: 'https://github.com/cesolvrdz',
      github_url: 'https://github.com/cesolvrdz',
      status: 'completed',
      is_featured: true
    },
    {
      id: 2,
      title: 'Task Management App',
      description: 'Aplicación de gestión de tareas con funciones de colaboración en tiempo real',
      image_url: '/api/placeholder/600/400',
      tech_tags: ['Vue.js', 'Firebase', 'Vuetify'],
      project_url: 'https://github.com/cesolvrdz',
      github_url: 'https://github.com/cesolvrdz',
      status: 'completed',
      is_featured: true
    }
  ],
  settings: {
    site_name: 'César Valdez - Desarrollador Full Stack',
    site_description: 'Portafolio profesional de César Valdez, desarrollador full stack especializado en tecnologías web modernas.',
    theme_color: '#3B82F6',
    show_hero: 'true',
    show_about: 'true',
    show_projects: 'true',
    show_contact: 'true',
    projects_title: 'Proyectos',
    projects_description: 'Una selección de mis trabajos recientes y proyectos destacados.',
    about_title: 'Acerca de Mí',
    about_description: 'Conoce más sobre mi experiencia y habilidades.',
    contact_email: 'cesolvrdz@gmail.com',
    contact_phone: '(833) 107-7911',
    contact_location: 'México'
  }
};

/**
 * Obtener información del perfil
 */
export async function getProfile() {
  if (!isSupabaseConfigured) {
    return fallbackData.profile;
  }

  const cacheKey = getCacheKey('profile');
  const cached = getCache(cacheKey);
  if (cached) return cached;

  try {
    const { data, error } = await supabase
      .from('profile')
      .select('*')
      .single();

    if (error) throw error;
    
    setCache(cacheKey, data);
    return data;
  } catch (error) {
    console.warn('Error loading profile, using fallback:', error.message);
    return fallbackData.profile;
  }
}

/**
 * Obtener enlaces sociales activos
 */
export async function getSocialLinks() {
  if (!isSupabaseConfigured) {
    return fallbackData.socialLinks;
  }

  const cacheKey = getCacheKey('social_links');
  const cached = getCache(cacheKey);
  if (cached) return cached;

  try {
    const { data, error } = await supabase
      .from('social_links')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) throw error;
    
    setCache(cacheKey, data);
    return data || [];
  } catch (error) {
    console.warn('Error loading social links, using fallback:', error.message);
    return fallbackData.socialLinks;
  }
}

/**
 * Obtener configuraciones del sitio
 */
export async function getSiteSettings(group = null) {
  if (!isSupabaseConfigured) {
    return fallbackData.settings;
  }

  const cacheKey = getCacheKey('site_settings', { group });
  const cached = getCache(cacheKey);
  if (cached) return cached;

  try {
    let query = supabase.from('site_settings').select('*');
    
    if (group) {
      query = query.eq('group', group);
    }

    const { data, error } = await query;
    if (error) throw error;

    // Convertir array a objeto para fácil acceso
    let result = {};
    if (data && data.length > 0) {
      data.forEach(setting => {
        result[setting.key] = setting.value;
      });
    }
    
    setCache(cacheKey, result);
    return result;
  } catch (error) {
    console.warn('Error loading site settings, using fallback:', error.message);
    return fallbackData.settings;
  }
}

/**
 * Obtener proyectos
 */
export async function getProjects(featured = false, limit = null) {
  if (!isSupabaseConfigured) {
    let projects = [...fallbackData.projects];
    if (featured) {
      projects = projects.filter(p => p.is_featured);
    }
    if (limit && limit > 0) {
      projects = projects.slice(0, limit);
    }
    return projects;
  }

  const cacheKey = getCacheKey('projects', { featured, limit });
  const cached = getCache(cacheKey);
  if (cached) return cached;

  try {
    let query = supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (featured) {
      query = query.eq('is_featured', true);
    }

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;
    if (error) throw error;

    setCache(cacheKey, data);
    return data || [];
  } catch (error) {
    console.warn('Error loading projects, using fallback:', error.message);
    let projects = [...fallbackData.projects];
    if (featured) {
      projects = projects.filter(p => p.is_featured);
    }
    if (limit && limit > 0) {
      projects = projects.slice(0, limit);
    }
    return projects;
  }
}

/**
 * Funciones helper para configuraciones específicas
 */
export async function getSeoSettings() {
  return await getSiteSettings('seo');
}

export async function getContentSettings() {
  return await getSiteSettings('content');
}

export async function getSectionSettings() {
  return await getSiteSettings('sections');
}

export async function getContactSettings() {
  return await getSiteSettings('contact');
}

/**
 * Limpiar caché
 */
export function clearCache() {
  cache.clear();
}

export default {
  getProfile,
  getSocialLinks,
  getSiteSettings,
  getProjects,
  getContentSettings,
  getSectionSettings,
  getContactSettings,
  getSeoSettings,
  clearCache
};
