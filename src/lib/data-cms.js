// ========================================
// PORTAFOLIO DATA - INTEGRACIÓN CON CMS LARAVEL
// Configurado específicamente para tu estructura de base de datos
// ========================================

import { 
  getProfile as getCMSProfile,
  getProjects as getCMSProjects,
  getFeaturedProjects as getCMSFeaturedProjects,
  getSocialLinks as getCMSSocialLinks,
  getSiteSettings as getCMSSiteSettings
} from './cms-data.js';

// Re-exportar funciones principales del CMS
export { 
  getProfile,
  getProjects,
  getFeaturedProjects,
  getSocialLinks,
  getSiteSettings,
  getContentSettings,
  getSectionSettings
};

/**
 * OBTENER PERFIL
 * Wrapper para la función del CMS
 */
export async function getProfile() {
  return await getCMSProfile();
}

/**
 * OBTENER PROYECTOS
 * Wrapper para la función del CMS
 */
export async function getProjects() {
  return await getCMSProjects();
}

/**
 * OBTENER PROYECTOS DESTACADOS
 * Wrapper para la función del CMS
 */
export async function getFeaturedProjects() {
  return await getCMSFeaturedProjects();
}

/**
 * OBTENER ENLACES SOCIALES
 * Wrapper para la función del CMS
 */
export async function getSocialLinks() {
  return await getCMSSocialLinks();
}

/**
 * OBTENER CONFIGURACIONES DEL SITIO
 * Wrapper para la función del CMS
 */
export async function getSiteSettings() {
  return await getCMSSiteSettings();
}

/**
 * OBTENER CONFIGURACIONES DE CONTENIDO
 * Filtrar configuraciones por grupo 'content'
 */
export async function getContentSettings() {
  return await getCMSSiteSettings('content');
}

/**
 * OBTENER CONFIGURACIONES DE SECCIONES
 * Filtrar configuraciones por grupo 'sections'
 */
export async function getSectionSettings() {
  return await getCMSSiteSettings('sections');
}
