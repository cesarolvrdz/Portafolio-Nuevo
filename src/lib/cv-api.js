// 🔗 Servicio de API para CV con sistema híbrido Laravel CMS + Supabase
import { supabase, isSupabaseConfigured } from './supabase.js';

class CVApiService {
  constructor() {
    this.laravelBaseURL = 'https://cms_real.test/api/v1/cv';
    this.supabaseStorageURL = 'https://wlkjxdhjcbyimozkvuxb.supabase.co/storage/v1/object/public';
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutos
  }

  // 📥 Obtener CV actual por idioma - Sistema Híbrido
  async getCurrentCV(language = 'es') {
    const cacheKey = `current_cv_${language}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    // Primero intentar Laravel CMS
    try {
      const laravelCV = await this.getCurrentCVFromLaravel(language);
      if (laravelCV) {
        this.cache.set(cacheKey, {
          data: laravelCV,
          timestamp: Date.now()
        });
        return laravelCV;
      }
    } catch (error) {
      console.warn('Laravel CMS no disponible, intentando Supabase fallback:', error.message);
    }

    // Fallback a Supabase
    try {
      const supabaseCV = await this.getCurrentCVFromSupabase();
      if (supabaseCV) {
        this.cache.set(cacheKey, {
          data: supabaseCV,
          timestamp: Date.now()
        });
        return supabaseCV;
      }
    } catch (error) {
      console.error('Error en ambos sistemas:', error.message);
      throw new Error('No se pudo cargar el CV desde ningún sistema disponible');
    }
  }

  // 🎯 Obtener CV desde Laravel CMS
  async getCurrentCVFromLaravel(language = 'es') {
    const response = await fetch(`${this.laravelBaseURL}/current?language=${language}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Laravel API HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || 'Error obteniendo CV desde Laravel');
    }

    return result.data;
  }

  // 🎯 Obtener CV desde Supabase (fallback)
  async getCurrentCVFromSupabase() {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase no configurado');
    }

    // Intentar desde la tabla cv_documents primero
    try {
      const { data: cvDoc, error: cvError } = await supabase
        .from('cv_documents')
        .select('*')
        .eq('is_current', true)
        .single();

      if (!cvError && cvDoc) {
        console.log('✅ CV encontrado en tabla cv_documents');
        
        return {
          id: cvDoc.id,
          title: cvDoc.title || 'CV Actualizado',
          description: cvDoc.description || 'Currículum Vitae actualizado',
          file_url: cvDoc.file_url, // URL ya viene completa desde la tabla
          file_type: cvDoc.file_type || 'pdf',
          file_size: cvDoc.file_size || 0,
          version: cvDoc.version || '1.0',
          language: cvDoc.language || 'es',
          download_count: cvDoc.download_count || 0,
          is_current: cvDoc.is_current,
          created_at: cvDoc.created_at,
          updated_at: cvDoc.updated_at,
          source: 'supabase'
        };
      }
    } catch (error) {
      console.warn('⚠️ No se pudo obtener desde cv_documents:', error.message);
    }

    // Fallback: usar resume_url del perfil
    const { data: profile, error } = await supabase
      .from('profile')
      .select('name, resume_url, updated_at')
      .eq('is_active', true)
      .single();

    if (error) {
      throw new Error(`Supabase error: ${error.message}`);
    }

    if (!profile?.resume_url) {
      throw new Error('No hay CV configurado en el perfil ni en cv_documents');
    }

    console.log('✅ CV encontrado en perfil como fallback');

    // Convertir datos de Supabase al formato esperado
    return {
      id: 1,
      title: `CV - ${profile.name}`,
      description: 'Currículum Vitae actualizado',
      file_url: profile.resume_url,
      file_type: 'pdf',
      file_size: 0,
      version: '1.0',
      language: 'es',
      download_count: 0,
      is_current: true,
      created_at: profile.updated_at,
      updated_at: profile.updated_at,
      source: 'supabase'
    };
  }

  // 📊 Obtener estadísticas de CV - Sistema Híbrido
  async getCVStats() {
    const cacheKey = 'cv_stats';
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    // Primero intentar Laravel CMS
    try {
      const laravelStats = await this.getCVStatsFromLaravel();
      if (laravelStats) {
        this.cache.set(cacheKey, {
          data: laravelStats,
          timestamp: Date.now()
        });
        return laravelStats;
      }
    } catch (error) {
      console.warn('Laravel CMS stats no disponibles:', error.message);
    }

    // Fallback: obtener estadísticas desde Supabase cv_documents
    try {
      if (isSupabaseConfigured) {
        const { data: cvDocs, error } = await supabase
          .from('cv_documents')
          .select('download_count, language, version');

        if (!error && cvDocs) {
          const totalDownloads = cvDocs.reduce((sum, doc) => sum + (doc.download_count || 0), 0);
          const uniqueLanguages = [...new Set(cvDocs.map(doc => doc.language))].length;
          const uniqueVersions = [...new Set(cvDocs.map(doc => doc.version))].length;

          const supabaseStats = {
            total_downloads: totalDownloads,
            total_versions: uniqueVersions,
            languages_count: uniqueLanguages,
            source: 'supabase'
          };

          this.cache.set(cacheKey, {
            data: supabaseStats,
            timestamp: Date.now()
          });

          return supabaseStats;
        }
      }
    } catch (error) {
      console.warn('Supabase stats no disponibles:', error.message);
    }

    // Fallback final: estadísticas básicas
    const fallbackStats = {
      total_downloads: 0,
      total_versions: 1,
      languages_count: 1,
      source: 'fallback'
    };

    this.cache.set(cacheKey, {
      data: fallbackStats,
      timestamp: Date.now()
    });

    return fallbackStats;
  }

  // 🎯 Obtener estadísticas desde Laravel CMS
  async getCVStatsFromLaravel() {
    const response = await fetch(`${this.laravelBaseURL}/stats`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Laravel Stats HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data;
  }

  // 📥 Descargar CV - Sistema Híbrido
  async downloadCV(cvId, language = 'es') {
    // Obtener CV actual para determinar el sistema
    const currentCV = await this.getCurrentCV(language);
    
    if (currentCV.source === 'supabase') {
      // Para Supabase, intentar incrementar contador si es posible
      try {
        if (isSupabaseConfigured && currentCV.id) {
          await supabase
            .from('cv_documents')
            .update({ 
              download_count: (currentCV.download_count || 0) + 1,
              updated_at: new Date().toISOString()
            })
            .eq('id', currentCV.id);
          
          console.log('✅ Contador de descarga incrementado en Supabase');
        }
      } catch (error) {
        console.warn('⚠️ No se pudo incrementar contador en Supabase:', error.message);
      }

      return {
        success: true,
        download_url: currentCV.file_url,
        message: 'Descarga desde Supabase Storage'
      };
    }

    // Para Laravel CMS, usar endpoint de descarga con tracking
    try {
      const response = await fetch(`${this.laravelBaseURL}/${cvId}/download`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      
      // Limpiar cache para forzar actualización
      this.cache.delete(`current_cv_${language}`);
      this.cache.delete('cv_stats');
      
      return result.data;
    } catch (error) {
      console.error('Error downloading CV from Laravel:', error);
      
      // Fallback: descarga directa sin tracking
      return {
        success: true,
        download_url: currentCV.file_url,
        message: 'Descarga directa (sin tracking)'
      };
    }
  }

  // 🔄 Limpiar cache
  clearCache() {
    this.cache.clear();
  }

  // 📏 Formatear tamaño de archivo
  static formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // 📅 Formatear fecha
  static formatDate(dateString, locale = 'es-ES') {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}

export default CVApiService;