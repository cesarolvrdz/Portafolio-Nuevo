import { supabase, isSupabaseConfigured } from './supabase.js';

// Cache dinámico
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

function getCacheKey(table, options = {}) {
  return `${table}_${JSON.stringify(options)}`;
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

/**
 * Obtener TODOS los datos de cualquier tabla de Supabase dinámicamente
 */
export async function getTableData(tableName, options = {}) {
  if (!isSupabaseConfigured) {
    console.log(`Supabase not configured, returning empty data for ${tableName}`);
    return [];
  }

  const cacheKey = getCacheKey(tableName, options);
  const cached = getCache(cacheKey);
  if (cached) return cached;

  try {
    let query = supabase.from(tableName).select('*');

    // Aplicar filtros dinámicos si se proporcionan
    if (options.filter) {
      Object.entries(options.filter).forEach(([key, value]) => {
        query = query.eq(key, value);
      });
    }

    // Aplicar ordenamiento dinámico
    if (options.orderBy) {
      const { column, ascending = true } = options.orderBy;
      query = query.order(column, { ascending });
    }

    // Aplicar límite si se especifica
    if (options.limit) {
      query = query.limit(options.limit);
    }

    // Aplicar rango si se especifica
    if (options.range) {
      const { from, to } = options.range;
      query = query.range(from, to);
    }

    const { data, error } = await query;
    
    if (error) {
      console.warn(`Error loading ${tableName}:`, error.message);
      return [];
    }

    setCache(cacheKey, data || []);
    return data || [];
  } catch (error) {
    console.warn(`Error connecting to ${tableName}:`, error.message);
    return [];
  }
}

/**
 * Obtener UN registro específico de cualquier tabla
 */
export async function getRecord(tableName, id) {
  if (!isSupabaseConfigured) {
    return null;
  }

  const cacheKey = `${tableName}_record_${id}`;
  const cached = getCache(cacheKey);
  if (cached) return cached;

  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.warn(`Error loading record ${id} from ${tableName}:`, error.message);
      return null;
    }

    setCache(cacheKey, data);
    return data;
  } catch (error) {
    console.warn(`Error connecting to ${tableName}:`, error.message);
    return null;
  }
}

/**
 * Obtener estructura de una tabla (nombres de columnas y tipos)
 */
export async function getTableSchema(tableName) {
  if (!isSupabaseConfigured) {
    return {};
  }

  try {
    // Obtener un registro para inferir la estructura
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(1);

    if (error || !data || data.length === 0) {
      return {};
    }

    const record = data[0];
    const schema = {};
    
    Object.entries(record).forEach(([key, value]) => {
      schema[key] = {
        type: typeof value,
        hasValue: value !== null && value !== undefined,
        example: value
      };
    });

    return schema;
  } catch (error) {
    console.warn(`Error getting schema for ${tableName}:`, error.message);
    return {};
  }
}

/**
 * Listar todas las tablas disponibles (método aproximado)
 */
export async function getAvailableTables() {
  if (!isSupabaseConfigured) {
    return [];
  }

  // Lista de tablas comunes que podríamos buscar
  const commonTables = [
    'profile', 'profiles', 'user', 'users',
    'social_links', 'social_media', 'links',
    'projects', 'portfolio', 'works',
    'site_settings', 'settings', 'config', 'configuration',
    'posts', 'blog', 'articles', 'content',
    'skills', 'technologies', 'expertise',
    'experience', 'work_experience', 'jobs',
    'education', 'certifications', 'achievements',
    'testimonials', 'reviews', 'feedback',
    'contact', 'contact_info', 'about'
  ];

  const availableTables = [];

  for (const table of commonTables) {
    try {
      const { error } = await supabase
        .from(table)
        .select('id')
        .limit(1);

      if (!error) {
        availableTables.push(table);
      }
    } catch (e) {
      // Tabla no existe, continuar
    }
  }

  return availableTables;
}

/**
 * Obtener todos los datos disponibles de todas las tablas
 */
export async function getAllData() {
  if (!isSupabaseConfigured) {
    return {};
  }

  const tables = await getAvailableTables();
  const allData = {};

  for (const table of tables) {
    try {
      const data = await getTableData(table);
      if (data && data.length > 0) {
        allData[table] = data;
      }
    } catch (error) {
      console.warn(`Error loading ${table}:`, error.message);
    }
  }

  return allData;
}

/**
 * Buscar datos por contenido (búsqueda textual en todas las tablas)
 */
export async function searchContent(searchTerm) {
  const allData = await getAllData();
  const results = [];

  Object.entries(allData).forEach(([tableName, records]) => {
    records.forEach((record, index) => {
      // Buscar en todos los campos de texto
      Object.entries(record).forEach(([field, value]) => {
        if (typeof value === 'string' && value.toLowerCase().includes(searchTerm.toLowerCase())) {
          results.push({
            table: tableName,
            record,
            field,
            match: value,
            index
          });
        }
      });
    });
  });

  return results;
}

// Funciones específicas para compatibilidad con el código existente
export async function getProfile() {
  const profiles = await getTableData('profile');
  return profiles.length > 0 ? profiles[0] : await getTableData('profiles').then(data => data[0]) || null;
}

export async function getSocialLinks() {
  return await getTableData('social_links', {
    filter: { is_active: true },
    orderBy: { column: 'created_at', ascending: true }
  }) || await getTableData('social_media') || await getTableData('links') || [];
}

export async function getProjects(featured = false, limit = null) {
  const options = {};
  
  if (featured) {
    options.filter = { is_featured: true };
  }
  
  if (limit) {
    options.limit = limit;
  }

  options.orderBy = { column: 'created_at', ascending: false };

  return await getTableData('projects', options) || await getTableData('portfolio', options) || [];
}

export async function getSiteSettings() {
  const settings = await getTableData('site_settings') || await getTableData('settings') || [];
  
  // Convertir array de configuraciones a objeto
  const settingsObj = {};
  settings.forEach(setting => {
    if (setting.key && setting.value) {
      settingsObj[setting.key] = setting.value;
    }
  });

  return settingsObj;
}

// Funciones helper
export async function getContentSettings() {
  const allSettings = await getSiteSettings();
  const contentSettings = {};
  
  Object.entries(allSettings).forEach(([key, value]) => {
    if (key.includes('content') || key.includes('title') || key.includes('description')) {
      contentSettings[key] = value;
    }
  });

  return contentSettings;
}

export async function getSectionSettings() {
  const allSettings = await getSiteSettings();
  const sectionSettings = {};
  
  Object.entries(allSettings).forEach(([key, value]) => {
    if (key.includes('show_') || key.includes('enable_') || key.includes('display_')) {
      sectionSettings[key] = value;
    }
  });

  return sectionSettings;
}

export async function getSeoSettings() {
  const allSettings = await getSiteSettings();
  const seoSettings = {};
  
  Object.entries(allSettings).forEach(([key, value]) => {
    if (key.includes('seo') || key.includes('site_') || key.includes('meta_')) {
      seoSettings[key] = value;
    }
  });

  return seoSettings;
}

export async function getThemeSettings() {
  const allSettings = await getSiteSettings();
  const themeSettings = {};
  
  Object.entries(allSettings).forEach(([key, value]) => {
    if (key.includes('theme') || key.includes('color') || key.includes('style')) {
      themeSettings[key] = value;
    }
  });

  return themeSettings;
}

export function clearCache() {
  cache.clear();
}

export default {
  // Funciones dinámicas principales
  getTableData,
  getRecord,
  getTableSchema,
  getAvailableTables,
  getAllData,
  searchContent,
  
  // Funciones específicas compatibles
  getProfile,
  getSocialLinks,
  getProjects,
  getSiteSettings,
  getContentSettings,
  getSectionSettings,
  getSeoSettings,
  getThemeSettings,
  clearCache
};
