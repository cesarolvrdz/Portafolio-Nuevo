// Sistema dinámico de datos que lee automáticamente desde Supabase
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

// Re-exportar funciones dinámicas
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

// Datos de fallback
const fallbackData = {
  profile: {
    id: 1,
    name: 'César Valdez',
    email: 'cesolvrdz@gmail.com',
    phone: '(833) 107-7911',
    location: 'México',
    bio: 'Desarrollador Full Stack apasionado por crear soluciones web innovadoras.',
    avatar_url: '/api/placeholder/400/400',
    website_url: 'https://cesolvrdz.dev',
    resume_url: '/cv.pdf',
    available_for_work: true,
    years_experience: 5
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
      description: 'Plataforma de comercio electrónico con React y Node.js',
      image_url: '/api/placeholder/600/400',
      tech_tags: ['React', 'Node.js', 'MongoDB'],
      project_url: 'https://github.com/cesolvrdz',
      github_url: 'https://github.com/cesolvrdz',
      status: 'completed',
      is_featured: true
    }
  ],
  settings: {
    site_name: 'César Valdez - Desarrollador Full Stack',
    site_description: 'Portafolio profesional',
    show_hero: 'true',
    show_about: 'true',
    show_projects: 'true',
    show_contact: 'true',
    seo_title: 'César Valdez - Desarrollador Full Stack',
    seo_description: 'Portafolio profesional de César Valdez',
    theme_color: '#3B82F6',
    google_analytics: '',
    favicon_url: '/favicon.svg'
  }
};

export async function getProfile() {
  try {
    const dynamicProfile = await getDynamicProfile();
    if (dynamicProfile) {
      console.log('✅ Perfil desde Supabase');
      return dynamicProfile;
    }
  } catch (error) {
    console.log('⚠️ Error perfil dinámico:', error.message);
  }
  
  console.log('🔄 Usando datos fallback - perfil');
  return fallbackData.profile;
}

export async function getSocialLinks() {
  try {
    const dynamicSocialLinks = await getDynamicSocialLinks();
    if (dynamicSocialLinks && dynamicSocialLinks.length > 0) {
      console.log('✅ Enlaces sociales desde Supabase');
      return dynamicSocialLinks;
    }
  } catch (error) {
    console.log('⚠️ Error enlaces sociales dinámicos:', error.message);
  }
  
  console.log('🔄 Usando datos fallback - enlaces sociales');
  return fallbackData.socialLinks;
}

export async function getProjects(featured = false, limit = null) {
  try {
    const dynamicProjects = await getDynamicProjects(featured, limit);
    if (dynamicProjects && dynamicProjects.length > 0) {
      console.log('✅ Proyectos desde Supabase');
      return dynamicProjects;
    }
  } catch (error) {
    console.log('⚠️ Error proyectos dinámicos:', error.message);
  }
  
  console.log('🔄 Usando datos fallback - proyectos');
  let projects = [...fallbackData.projects];
  
  if (featured) {
    projects = projects.filter(project => project.is_featured);
  }
  
  if (limit) {
    projects = projects.slice(0, limit);
  }
  
  return projects;
}

export async function getSiteSettings() {
  try {
    const dynamicSettings = await getDynamicSiteSettings();
    if (dynamicSettings && Object.keys(dynamicSettings).length > 0) {
      console.log('✅ Configuraciones desde Supabase');
      return dynamicSettings;
    }
  } catch (error) {
    console.log('⚠️ Error configuraciones dinámicas:', error.message);
  }
  
  console.log('🔄 Usando datos fallback - configuraciones');
  return fallbackData.settings;
}

export async function getSetting(key, defaultValue = null) {
  const settings = await getSiteSettings();
  return settings[key] || defaultValue;
}

export async function isSectionEnabled(sectionName) {
  const setting = await getSetting(`show_${sectionName}`, 'true');
  return setting === 'true' || setting === true;
}

export async function getPublicSettings() {
  const settings = await getSiteSettings();
  return {
    site_name: settings.site_name,
    site_description: settings.site_description,
    theme_color: settings.theme_color,
    seo_title: settings.seo_title,
    seo_description: settings.seo_description,
    google_analytics: settings.google_analytics,
    favicon_url: settings.favicon_url
  };
}

export async function getContactSettings() {
  const profile = await getProfile();
  const settings = await getSiteSettings();
  return {
    email: settings.contact_email || profile.email,
    phone: settings.contact_phone || profile.phone,
    location: settings.contact_location || profile.location,
    title: settings.contact_title || 'Contacto',
    show_email: settings.show_email !== 'false',
    show_phone: settings.show_phone !== 'false',
    show_location: settings.show_location !== 'false'
  };
}

export default {
  getTableData,
  getRecord,
  getAllData,
  searchContent,
  getProfile,
  getSocialLinks,
  getProjects,
  getSiteSettings,
  getSetting,
  isSectionEnabled,
  getPublicSettings,
  getContactSettings,
  getContentSettings,
  getSectionSettings,
  getSeoSettings,
  getThemeSettings,
  clearCache
};
