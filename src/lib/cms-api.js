// ========================================
// PORTFOLIO CMS API CLIENT
// Sistema completo de integración con Laravel CMS
// ========================================

import { supabase } from './supabase.js';

// Configuración base
const API_BASE_URL = import.meta.env.PUBLIC_CMS_API_URL || 'https://wlkjxdhjcbyimozkvuxb.supabase.co';
const API_VERSION = 'v1';

// ========================================
// CLIENTE BASE PARA APIS
// ========================================

class CMSApiClient {
  constructor() {
    this.baseUrl = API_BASE_URL;
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutos
  }

  // Método base para hacer peticiones
  async request(endpoint, options = {}) {
    const cacheKey = `${endpoint}_${JSON.stringify(options)}`;
    
    // Verificar cache
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        console.log(`✅ Cache hit: ${endpoint}`);
        return cached.data;
      }
    }

    try {
      console.log(`🔄 Fetching: ${endpoint}`);
      
      // Usar Supabase directamente por ahora
      const { data, error } = await supabase
        .from(endpoint)
        .select('*');

      if (error) throw error;

      // Guardar en cache
      this.cache.set(cacheKey, {
        data,
        timestamp: Date.now()
      });

      console.log(`✅ Success: ${endpoint} (${data?.length || 0} items)`);
      return data;

    } catch (error) {
      console.error(`❌ Error fetching ${endpoint}:`, error);
      return null;
    }
  }

  // Limpiar cache
  clearCache() {
    this.cache.clear();
  }

  // Invalidar cache específico
  invalidateCache(pattern) {
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    }
  }
}

// Instancia global del cliente
const apiClient = new CMSApiClient();

// ========================================
// API DE PERFIL PROFESIONAL
// ========================================

export async function getProfile() {
  try {
    const profiles = await apiClient.request('profile');
    return profiles?.[0] || null;
  } catch (error) {
    console.error('Error getting profile:', error);
    return getFallbackProfile();
  }
}

function getFallbackProfile() {
  return {
    id: 'fallback-1',
    full_name: 'Desarrollador Profesional',
    professional_title: 'Senior Full Stack Developer',
    bio: 'Desarrollador con experiencia en tecnologías modernas',
    email: 'contacto@portfolio.com',
    phone: '+34 600 000 000',
    location: 'España',
    skills: ['React', 'Laravel', 'Python', 'AWS'],
    years_experience: 5,
    is_available: true,
    timezone: 'Europe/Madrid'
  };
}

// ========================================
// API DE PROYECTOS
// ========================================

export async function getProjects() {
  try {
    const projects = await apiClient.request('projects');
    return projects || [];
  } catch (error) {
    console.error('Error getting projects:', error);
    return getFallbackProjects();
  }
}

export async function getFeaturedProjects() {
  try {
    const { data } = await supabase
      .from('projects')
      .select('*')
      .eq('is_featured', true)
      .eq('is_active', true)
      .order('order_position', { ascending: true });
    
    return data || [];
  } catch (error) {
    console.error('Error getting featured projects:', error);
    return getFallbackProjects().filter(p => p.is_featured);
  }
}

export async function getProjectById(id) {
  try {
    const { data } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();
    
    return data;
  } catch (error) {
    console.error('Error getting project by ID:', error);
    return null;
  }
}

export async function getProjectsByCategory(category) {
  try {
    const { data } = await supabase
      .from('projects')
      .select('*')
      .eq('category', category)
      .eq('is_active', true)
      .order('order_position', { ascending: true });
    
    return data || [];
  } catch (error) {
    console.error('Error getting projects by category:', error);
    return [];
  }
}

function getFallbackProjects() {
  return [
    {
      id: 'proj-1',
      title: 'E-commerce Platform',
      description: 'Plataforma completa de comercio electrónico',
      technologies: ['React', 'Node.js', 'MongoDB'],
      category: 'web-development',
      status: 'completed',
      is_featured: true,
      is_active: true,
      github_url: 'https://github.com/example/project',
      live_url: 'https://demo.project.com'
    }
  ];
}

// ========================================
// API DE CERTIFICADOS
// ========================================

// ========================================
// API DE CERTIFICADOS (NUEVO SISTEMA CMS)
// ========================================

// URL base del CMS Laravel
const CMS_BASE_URL = 'https://cms_real.test/api/v1';

export async function getCertificates() {
  try {
    // Primero intentar desde CMS Laravel
    const response = await fetch(`${CMS_BASE_URL}/certificates`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Certificados cargados desde CMS Laravel:', result.data?.length || 0);
      return result.data || [];
    }
  } catch (error) {
    console.warn('⚠️ CMS Laravel no disponible, usando fallback Supabase:', error.message);
  }

  // Fallback a Supabase si CMS Laravel no está disponible
  try {
    const { data } = await supabase
      .from('certificates')
      .select('*')
      .eq('is_active', true)
      .order('order_position', { ascending: true });
    
    console.log('✅ Certificados cargados desde Supabase:', data?.length || 0);
    return data || [];
  } catch (error) {
    console.error('❌ Error en ambos sistemas:', error);
    return getFallbackCertificates();
  }
}

export async function getFeaturedCertificates() {
  try {
    // Intentar desde CMS Laravel
    const response = await fetch(`${CMS_BASE_URL}/certificates/featured`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Certificados destacados desde CMS Laravel:', result.data?.length || 0);
      return result.data || [];
    }
  } catch (error) {
    console.warn('⚠️ CMS Laravel no disponible para destacados:', error.message);
  }

  // Fallback a Supabase
  try {
    const { data } = await supabase
      .from('certificates')
      .select('*')
      .eq('is_featured', true)
      .eq('is_active', true)
      .order('order_position', { ascending: true });
    
    return data || [];
  } catch (error) {
    console.error('Error getting featured certificates:', error);
    return getFallbackCertificates().filter(c => c.is_featured);
  }
}

export async function getCertificatesByCategory(category) {
  try {
    // Intentar desde CMS Laravel
    const response = await fetch(`${CMS_BASE_URL}/certificates/category/${category}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    });

    if (response.ok) {
      const result = await response.json();
      console.log(`✅ Certificados de categoría '${category}' desde CMS Laravel:`, result.data?.length || 0);
      return result.data || [];
    }
  } catch (error) {
    console.warn(`⚠️ CMS Laravel no disponible para categoría '${category}':`, error.message);
  }

  // Fallback a Supabase
  try {
    const { data } = await supabase
      .from('certificates')
      .select('*')
      .eq('category', category)
      .eq('is_active', true)
      .order('order_position', { ascending: true });
    
    return data || [];
  } catch (error) {
    console.error('Error getting certificates by category:', error);
    return [];
  }
}

export async function getCertificateCategories() {
  try {
    // Intentar desde CMS Laravel
    const response = await fetch(`${CMS_BASE_URL}/certificates/categories`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Categorías de certificados desde CMS Laravel:', result.data?.length || 0);
      return result.data || [];
    }
  } catch (error) {
    console.warn('⚠️ CMS Laravel no disponible para categorías:', error.message);
  }

  // Fallback a Supabase
  try {
    const { data } = await supabase
      .from('certificates')
      .select('category')
      .eq('is_active', true);
    
    const categories = [...new Set(data?.map(c => c.category))];
    return categories;
  } catch (error) {
    console.error('Error getting certificate categories:', error);
    return ['programming', 'design', 'marketing'];
  }
}

function getFallbackCertificates() {
  return [
    {
      id: 'cert-1',
      title: 'React Advanced Certification',
      institution: 'Meta',
      category: 'programming',
      image_url: '/certificates/react-cert.jpg',
      pdf_url: '/certificates/react-cert.pdf',
      skills: ['React', 'JavaScript', 'Frontend'],
      is_featured: true,
      is_active: true
    }
  ];
}

// ========================================
// API DE CV
// ========================================

export async function getCurrentCV() {
  try {
    const { data } = await supabase
      .from('cv')
      .select('*')
      .eq('is_current', true)
      .single();
    
    return data;
  } catch (error) {
    console.error('Error getting current CV:', error);
    return getFallbackCV();
  }
}

export async function getCVByLanguage(language) {
  try {
    const { data } = await supabase
      .from('cv')
      .select('*')
      .eq('language', language)
      .single();
    
    return data;
  } catch (error) {
    console.error('Error getting CV by language:', error);
    return getFallbackCV();
  }
}

export async function getCVLanguages() {
  try {
    const { data } = await supabase
      .from('cv')
      .select('language')
      .eq('is_active', true);
    
    return data?.map(cv => cv.language) || ['es'];
  } catch (error) {
    console.error('Error getting CV languages:', error);
    return ['es', 'en'];
  }
}

export async function downloadCV(language = null) {
  try {
    // Incrementar contador de descarga
    const cv = language ? await getCVByLanguage(language) : await getCurrentCV();
    
    if (cv?.file_url) {
      // Crear enlace de descarga
      const link = document.createElement('a');
      link.href = cv.file_url;
      link.download = `CV_${cv.title || 'Portfolio'}.pdf`;
      link.click();
      
      // Incrementar contador (opcional)
      console.log(`📄 CV downloaded: ${cv.title}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error downloading CV:', error);
    return false;
  }
}

function getFallbackCV() {
  return {
    id: 'cv-1',
    title: 'CV Profesional',
    language: 'es',
    file_url: '/cv/cv-profesional.pdf',
    version: '1.0',
    updated_at: new Date().toISOString()
  };
}

// ========================================
// API DE DISPONIBILIDAD
// ========================================

export async function getAvailability() {
  try {
    const { data } = await supabase
      .from('availability')
      .select('*')
      .single();
    
    return data;
  } catch (error) {
    console.error('Error getting availability:', error);
    return getFallbackAvailability();
  }
}

function getFallbackAvailability() {
  return {
    is_available: true,
    availability_type: 'open_to_opportunities',
    work_types: ['full-time', 'contract'],
    work_modes: ['remote', 'hybrid'],
    available_from: new Date().toISOString().split('T')[0]
  };
}

// ========================================
// API DE FORMACIÓN ACADÉMICA
// ========================================

export async function getEducation() {
  try {
    const education = await apiClient.request('education');
    return education || [];
  } catch (error) {
    console.error('Error getting education:', error);
    return [];
  }
}

function getFallbackEducation() {
  return [
    {
      id: 'edu-1',
      institution: 'Universidad Tecnológica',
      degree: 'Ingeniería en Sistemas',
      field_of_study: 'Desarrollo de Software',
      start_date: '2018-09-01',
      end_date: '2022-06-30',
      is_current: false,
      grade: '8.5/10',
      type: 'degree'
    }
  ];
}

// ========================================
// API DE EXPERIENCIA LABORAL
// ========================================

export async function getWorkExperience() {
  try {
    const experience = await apiClient.request('work_experience');
    return experience || [];
  } catch (error) {
    console.error('Error getting work experience:', error);
    return [];
  }
}

function getFallbackWorkExperience() {
  return [
    {
      id: 'work-1',
      company: 'Tech Solutions',
      position: 'Senior Full Stack Developer',
      employment_type: 'full-time',
      start_date: '2022-07-01',
      end_date: null,
      is_current: true,
      location: 'Madrid, España',
      location_type: 'hybrid',
      technologies: ['React', 'Laravel', 'AWS']
    }
  ];
}

// ========================================
// API DE ENLACES SOCIALES
// ========================================

export async function getSocialLinks() {
  try {
    const links = await apiClient.request('social_links');
    return links || [];
  } catch (error) {
    console.error('Error getting social links:', error);
    return getFallbackSocialLinks();
  }
}

function getFallbackSocialLinks() {
  return [
    {
      id: 'social-1',
      platform: 'LinkedIn',
      url: 'https://linkedin.com/in/profile',
      icon: 'fab fa-linkedin',
      color: '#0077B5',
      is_active: true
    }
  ];
}

// ========================================
// API DE CONFIGURACIONES DEL SITIO
// ========================================

export async function getSiteSettings() {
  try {
    const settings = await apiClient.request('site_settings');
    
    // Convertir array de configuraciones a objeto
    const settingsObj = {};
    settings?.forEach(setting => {
      settingsObj[setting.key] = setting.value;
    });
    
    return settingsObj;
  } catch (error) {
    console.error('Error getting site settings:', error);
    return getFallbackSiteSettings();
  }
}

function getFallbackSiteSettings() {
  return {
    site_title: 'Portfolio Profesional',
    meta_description: 'Portfolio de desarrollo web',
    primary_color: '#3B82F6',
    secondary_color: '#10B981',
    theme: 'light',
    show_availability: true,
    contact_form_enabled: true
  };
}

// ========================================
// UTILIDADES DE CACHE Y OPTIMIZACIÓN
// ========================================

export function clearAllCache() {
  apiClient.clearCache();
  console.log('🔄 Cache cleared');
}

export function preloadData() {
  // Precargar datos principales para mejor performance
  Promise.all([
    getProfile(),
    getFeaturedProjects(),
    getFeaturedCertificates(),
    getCurrentCV(),
    getAvailability(),
    getSiteSettings()
  ]).then(() => {
    console.log('✅ Essential data preloaded');
  });
}

// Auto-preload en desarrollo
if (import.meta.env.DEV) {
  preloadData();
}