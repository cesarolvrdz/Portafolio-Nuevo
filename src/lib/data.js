// Archivo de compatibilidad - redirecciona a las funciones del CMS
import { 
  getProfile as getCMSProfile,
  getProjects as getCMSProjects,
  getSocialLinks as getCMSSocialLinks,
  getSiteSettings as getCMSSiteSettings
} from './cms-data.js';

// Re-exportar funciones del CMS con nombres originales para compatibilidad
export const getProfile = getCMSProfile;
export const getProjects = getCMSProjects;
export const getSocialLinks = getCMSSocialLinks;

// Función auxiliar para configuraciones de sección usando site_settings
export async function getSectionSettings() {
  try {
    const settings = await getCMSSiteSettings();
    return {
      show_about: settings?.show_about !== false,
      show_projects: settings?.show_projects !== false,
      show_contact: settings?.show_contact !== false,
    };
  } catch (error) {
    console.error('Error loading section settings:', error);
    return {
      show_about: true,
      show_projects: true,
      show_contact: true,
    };
  }
}

// Función auxiliar para configuraciones de contenido usando site_settings
export async function getContentSettings() {
  try {
    const settings = await getCMSSiteSettings();
    return {
      projects_title: settings?.projects_title || 'Mis Proyectos',
      projects_description: settings?.projects_description || 'Explora mi trabajo y las soluciones innovadoras que he desarrollado',
      about_title: settings?.about_title || 'Sobre Mí',
      about_description: settings?.about_description || 'Información sobre mi experiencia profesional',
      featured_technologies: settings?.featured_technologies || null,
    };
  } catch (error) {
    console.error('Error loading content settings:', error);
    return {
      projects_title: 'Mis Proyectos',
      projects_description: 'Explora mi trabajo y las soluciones innovadoras que he desarrollado',
      about_title: 'Sobre Mí',
      about_description: 'Información sobre mi experiencia profesional',
      featured_technologies: null,
    };
  }
}

// Función auxiliar para configuraciones de contacto usando site_settings
export async function getContactSettings() {
  try {
    const settings = await getCMSSiteSettings();
    return {
      contact_email: settings?.contact_email,
      contact_phone: settings?.contact_phone,
      contact_location: settings?.contact_location,
      response_time: settings?.response_time || '24-48 horas',
    };
  } catch (error) {
    console.error('Error loading contact settings:', error);
    return {
      contact_email: null,
      contact_phone: null,
      contact_location: null,
      response_time: '24-48 horas',
    };
  }
}

// Función para obtener configuraciones del sitio (alias para compatibilidad)
export const getSiteSettings = getCMSSiteSettings;

// Funciones adicionales para Layout.astro
export async function getSeoSettings() {
  try {
    const settings = await getCMSSiteSettings();
    const profile = await getCMSProfile();
    return {
      site_title: settings?.site_title || settings?.site_name || profile?.name,
      site_description: settings?.site_description || profile?.bio,
      site_keywords: settings?.site_keywords || profile?.skills?.join(', '),
      site_author: settings?.site_author || profile?.name,
      site_url: settings?.site_url || 'https://portafolio-nuevo-seven-gamma.vercel.app',
      og_image: settings?.og_image || profile?.avatar_url,
    };
  } catch (error) {
    console.error('Error loading SEO settings:', error);
    return {
      site_title: 'Portfolio',
      site_description: 'Portafolio profesional',
      site_keywords: 'desarrollador, web, programador',
      site_author: 'Desarrollador',
      site_url: 'https://portafolio-nuevo-seven-gamma.vercel.app',
      og_image: null,
    };
  }
}

export async function getThemeSettings() {
  try {
    const settings = await getCMSSiteSettings();
    return {
      primary_color: settings?.primary_color || '#3B82F6',
      secondary_color: settings?.secondary_color || '#8B5CF6',
      dark_mode_enabled: settings?.dark_mode_enabled !== false,
      theme_style: settings?.theme_style || 'modern',
    };
  } catch (error) {
    console.error('Error loading theme settings:', error);
    return {
      primary_color: '#3B82F6',
      secondary_color: '#8B5CF6',
      dark_mode_enabled: true,
      theme_style: 'modern',
    };
  }
}

export async function getPublicSettings() {
  try {
    const settings = await getCMSSiteSettings();
    return {
      analytics_enabled: settings?.analytics_enabled !== false,
      google_analytics_id: settings?.google_analytics_id,
      contact_form_enabled: settings?.contact_form_enabled !== false,
      social_sharing_enabled: settings?.social_sharing_enabled !== false,
    };
  } catch (error) {
    console.error('Error loading public settings:', error);
    return {
      analytics_enabled: false,
      google_analytics_id: null,
      contact_form_enabled: true,
      social_sharing_enabled: true,
    };
  }
}

// Función auxiliar para obtener todos los datos de una vez
export async function getAllData() {
  try {
    const [profile, projects, socialLinks, siteSettings] = await Promise.all([
      getProfile(),
      getProjects(),
      getSocialLinks(),
      getSiteSettings(),
    ]);

    return {
      profile,
      projects,
      socialLinks,
      siteSettings,
      contentSettings: await getContentSettings(),
      sectionSettings: await getSectionSettings(),
      contactSettings: await getContactSettings(),
    };
  } catch (error) {
    console.error('Error loading all data:', error);
    return {
      profile: null,
      projects: [],
      socialLinks: [],
      siteSettings: {},
      contentSettings: {},
      sectionSettings: { show_about: true, show_projects: true, show_contact: true },
      contactSettings: {},
    };
  }
}