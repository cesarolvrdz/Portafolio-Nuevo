// ========================================
// SISTEMA DINÁMICO DE DATOS SUPABASE
// Este archivo ahora utiliza el sistema dinámico que lee automáticamente
// cualquier estructura de datos desde Supabase sin necesidad de tipado
// ========================================

import { 
  getTableData, 
  getRecord, 
  getAllData, 
  searchContent,
  getProfile as getDynamicProfile,
  getSocialLinks as getDynamicSocialLinks,
  getProjects as getDynamicProjects,
  getSiteSettings as getDynamicSiteSettings,
  getContentSettings,
  getSectionSettings,
  getSeoSettings,
  getThemeSettings,
  clearCache
} from './dynamic-data.js';

// Exportar funciones dinámicas principales
export { 
  getTableData, 
  getRecord, 
  getAllData, 
  searchContent,
  getContentSettings,
  getSectionSettings,
  getSeoSettings,
  getThemeSettings,
  clearCache
};

/**
 * FUNCIONES DE COMPATIBILIDAD CON DATOS DE FALLBACK
 * Estas funciones mantienen la compatibilidad con el código existente
 * pero ahora utilizan el sistema dinámico de Supabase como primera opción
 */

// Datos de fallback para cuando Supabase no esté disponible
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
 * Obtener información del perfil - SISTEMA DINÁMICO
 * Intenta usar Supabase primero, luego fallback
 */
export async function getProfile() {
  try {
    // Intentar obtener de Supabase usando el sistema dinámico
    const dynamicProfile = await getDynamicProfile();
    if (dynamicProfile) {
      console.log('✅ Perfil cargado desde Supabase');
      return dynamicProfile;
    }
  } catch (error) {
    console.log('⚠️ Error al cargar perfil dinámico:', error.message);
  }
  
  console.log('🔄 Usando datos de fallback para perfil');
  return fallbackData.profile;
}

/**
 * Obtener enlaces sociales - SISTEMA DINÁMICO
 * Intenta usar Supabase primero, luego fallback
 */
export async function getSocialLinks() {
  try {
    // Intentar obtener de Supabase usando el sistema dinámico
    const dynamicSocialLinks = await getDynamicSocialLinks();
    if (dynamicSocialLinks && dynamicSocialLinks.length > 0) {
      console.log(`✅ ${dynamicSocialLinks.length} enlaces sociales cargados desde Supabase`);
      return dynamicSocialLinks;
    }
  } catch (error) {
    console.log('⚠️ Error al cargar enlaces sociales dinámicos:', error.message);
  }
  
  console.log('🔄 Usando datos de fallback para enlaces sociales');
  return fallbackData.socialLinks;
}

/**
 * Obtener proyectos - SISTEMA DINÁMICO
 * Intenta usar Supabase primero, luego fallback
 */
export async function getProjects(featured = false, limit = null) {
  try {
    // Intentar obtener de Supabase usando el sistema dinámico
    const dynamicProjects = await getDynamicProjects(featured, limit);
    if (dynamicProjects && dynamicProjects.length > 0) {
      console.log(`✅ ${dynamicProjects.length} proyectos cargados desde Supabase ${featured ? '(destacados)' : ''}`);
      return dynamicProjects;
    }
  } catch (error) {
    console.log('⚠️ Error al cargar proyectos dinámicos:', error.message);
  }
  
  console.log('🔄 Usando datos de fallback para proyectos');
  let projects = [...fallbackData.projects];
  
  if (featured) {
    projects = projects.filter(project => project.is_featured);
  }
  
  if (limit) {
    projects = projects.slice(0, limit);
  }
  
  return projects;
}

/**
 * Obtener configuraciones del sitio - SISTEMA DINÁMICO
 * Intenta usar Supabase primero, luego fallback
 */
export async function getSiteSettings() {
  try {
    // Intentar obtener de Supabase usando el sistema dinámico
    const dynamicSettings = await getDynamicSiteSettings();
    if (dynamicSettings && Object.keys(dynamicSettings).length > 0) {
      console.log(`✅ ${Object.keys(dynamicSettings).length} configuraciones cargadas desde Supabase`);
      return dynamicSettings;
    }
  } catch (error) {
    console.log('⚠️ Error al cargar configuraciones dinámicas:', error.message);
  }
  
  console.log('🔄 Usando datos de fallback para configuraciones');
  return fallbackData.settings;
}

/**
 * Obtener configuración específica por clave
 */
export async function getSetting(key, defaultValue = null) {
  const settings = await getSiteSettings();
  return settings[key] || defaultValue;
}

/**
 * Verificar si una sección está habilitada
 */
export async function isSectionEnabled(sectionName) {
  const setting = await getSetting(`show_${sectionName}`, 'true');
  return setting === 'true' || setting === true;
}

/**
 * Obtener configuraciones de contenido específicas
 */
export async function getContentConfig() {
  const settings = await getSiteSettings();
  return {
    hero: {
      enabled: settings.show_hero === 'true',
      title: settings.hero_title,
      subtitle: settings.hero_subtitle
    },
    about: {
      enabled: settings.show_about === 'true', 
      title: settings.about_title || 'Acerca de Mí',
      description: settings.about_description
    },
    projects: {
      enabled: settings.show_projects === 'true',
      title: settings.projects_title || 'Proyectos',
      description: settings.projects_description
    },
    contact: {
      enabled: settings.show_contact === 'true',
      title: settings.contact_title || 'Contacto',
      email: settings.contact_email,
      phone: settings.contact_phone,
      location: settings.contact_location
    }
  };
}

/**
 * Buscar en todos los datos disponibles
 */
export async function searchAllData(searchTerm) {
  try {
    // Usar función de búsqueda dinámica si está disponible
    const searchResults = await searchContent(searchTerm);
    return searchResults;
  } catch (error) {
    console.log('⚠️ Error en búsqueda dinámica:', error.message);
    
    // Fallback: buscar en datos locales
    const results = [];
    const profile = await getProfile();
    const socialLinks = await getSocialLinks();
    const projects = await getProjects();
    
    // Buscar en perfil
    if (profile.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        profile.bio?.toLowerCase().includes(searchTerm.toLowerCase())) {
      results.push({ type: 'profile', data: profile });
    }
    
    // Buscar en proyectos
    projects.forEach(project => {
      if (project.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.description?.toLowerCase().includes(searchTerm.toLowerCase())) {
        results.push({ type: 'project', data: project });
      }
    });
    
    return results;
  }
}

/**
 * Limpiar toda la caché
 */
export function clearAllCache() {
  clearCache();
}

// Funciones auxiliares para compatibilidad
export async function getHeroData() {
  const profile = await getProfile();
  const settings = await getSiteSettings();
  
  return {
    name: profile.name,
    bio: profile.bio,
    avatar: profile.avatar_url,
    title: settings.hero_title || `${profile.name} - ${settings.site_name}`,
    subtitle: settings.hero_subtitle || profile.bio
  };
}

export async function getAboutData() {
  const profile = await getProfile();
  const settings = await getSiteSettings();
  
  return {
    ...profile,
    title: settings.about_title || 'Acerca de Mí',
    description: settings.about_description || profile.bio
  };
}

export async function getContactData() {
  const profile = await getProfile();
  const settings = await getSiteSettings();
  
  return {
    email: settings.contact_email || profile.email,
    phone: settings.contact_phone || profile.phone,
    location: settings.contact_location || profile.location,
    title: settings.contact_title || 'Contacto'
  };
}

export default {
  // Funciones principales dinámicas
  getTableData,
  getRecord,
  getAllData,
  searchContent,
  
  // Funciones específicas compatibles
  getProfile,
  getSocialLinks,
  getProjects,
  getSiteSettings,
  getSetting,
  isSectionEnabled,
  getContentConfig,
  
  // Funciones de configuración específica
  getContentSettings,
  getSectionSettings,
  getSeoSettings,
  getThemeSettings,
  
  // Funciones auxiliares
  getHeroData,
  getAboutData,
  getContactData,
  searchAllData,
  clearAllCache,
  clearCache
};
