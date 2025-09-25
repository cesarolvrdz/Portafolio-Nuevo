// Internacionalización (i18n) para el portfolio
// Sistema de traducciones multiidioma

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

export interface Translations {
  [key: string]: {
    [language: string]: string;
  };
}

// Idiomas soportados
export const supportedLanguages: Language[] = [
  {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸'
  },
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸'
  },
  {
    code: 'pt',
    name: 'Portuguese',
    nativeName: 'Português',
    flag: '🇧🇷'
  }
];

// Traducciones del portfolio
export const translations: Translations = {
  // Navegación
  'nav.home': {
    es: 'Inicio',
    en: 'Home',
    pt: 'Início'
  },
  'nav.about': {
    es: 'Acerca de',
    en: 'About',
    pt: 'Sobre'
  },
  'nav.projects': {
    es: 'Proyectos',
    en: 'Projects',
    pt: 'Projetos'
  },
  'nav.experience': {
    es: 'Experiencia',
    en: 'Experience',
    pt: 'Experiência'
  },
  'nav.education': {
    es: 'Educación',
    en: 'Education',
    pt: 'Educação'
  },
  'nav.certificates': {
    es: 'Certificados',
    en: 'Certificates',
    pt: 'Certificados'
  },
  'nav.contact': {
    es: 'Contacto',
    en: 'Contact',
    pt: 'Contato'
  },

  // Hero Section
  'hero.greeting': {
    es: '¡Hola! Soy',
    en: 'Hello! I\'m',
    pt: 'Olá! Eu sou'
  },
  'hero.title': {
    es: 'Desarrollador Full Stack',
    en: 'Full Stack Developer',
    pt: 'Desenvolvedor Full Stack'
  },
  'hero.subtitle': {
    es: 'Creando experiencias digitales innovadoras con tecnologías modernas',
    en: 'Creating innovative digital experiences with modern technologies',
    pt: 'Criando experiências digitais inovadoras com tecnologias modernas'
  },
  'hero.availability.available': {
    es: 'Disponible para proyectos',
    en: 'Available for projects',
    pt: 'Disponível para projetos'
  },
  'hero.availability.busy': {
    es: 'Ocupado actualmente',
    en: 'Currently busy',
    pt: 'Atualmente ocupado'
  },
  'hero.cta.projects': {
    es: 'Ver Proyectos',
    en: 'View Projects',
    pt: 'Ver Projetos'
  },
  'hero.cta.contact': {
    es: 'Contactar',
    en: 'Contact Me',
    pt: 'Contato'
  },
  'hero.cta.cv': {
    es: 'Descargar CV',
    en: 'Download CV',
    pt: 'Baixar CV'
  },

  // About Section
  'about.title': {
    es: 'Sobre Mí',
    en: 'About Me',
    pt: 'Sobre Mim'
  },
  'about.subtitle': {
    es: 'Desarrollador apasionado por crear soluciones digitales efectivas',
    en: 'Developer passionate about creating effective digital solutions',
    pt: 'Desenvolvedor apaixonado por criar soluções digitais eficazes'
  },

  // Projects Section
  'projects.title': {
    es: 'Mis Proyectos',
    en: 'My Projects',
    pt: 'Meus Projetos'
  },
  'projects.subtitle': {
    es: 'Una colección de trabajos que demuestran mis habilidades técnicas',
    en: 'A collection of works that demonstrate my technical skills',
    pt: 'Uma coleção de trabalhos que demonstram minhas habilidades técnicas'
  },
  'projects.filter.all': {
    es: 'Todos',
    en: 'All',
    pt: 'Todos'
  },
  'projects.status.completed': {
    es: 'Completado',
    en: 'Completed',
    pt: 'Concluído'
  },
  'projects.status.inProgress': {
    es: 'En Desarrollo',
    en: 'In Progress',
    pt: 'Em Desenvolvimento'
  },
  'projects.status.planned': {
    es: 'Planificado',
    en: 'Planned',
    pt: 'Planejado'
  },
  'projects.viewDetails': {
    es: 'Ver Detalles',
    en: 'View Details',
    pt: 'Ver Detalhes'
  },
  'projects.viewDemo': {
    es: 'Ver Demo',
    en: 'View Demo',
    pt: 'Ver Demo'
  },
  'projects.viewCode': {
    es: 'Ver Código',
    en: 'View Code',
    pt: 'Ver Código'
  },

  // Experience Section
  'experience.title': {
    es: 'Mi Trayectoria',
    en: 'My Journey',
    pt: 'Minha Trajetória'
  },
  'experience.subtitle': {
    es: 'Un recorrido profesional enfocado en la excelencia técnica',
    en: 'A professional journey focused on technical excellence',
    pt: 'Uma jornada profissional focada na excelência técnica'
  },
  'experience.current': {
    es: 'Actual',
    en: 'Current',
    pt: 'Atual'
  },
  'experience.completed': {
    es: 'Completado',
    en: 'Completed',
    pt: 'Concluído'
  },
  'experience.duration': {
    es: 'Duración',
    en: 'Duration',
    pt: 'Duração'
  },
  'experience.achievements': {
    es: 'Logros Principales',
    en: 'Main Achievements',
    pt: 'Principais Conquistas'
  },
  'experience.technologies': {
    es: 'Stack Tecnológico',
    en: 'Tech Stack',
    pt: 'Stack Tecnológico'
  },
  'experience.projects': {
    es: 'Proyectos Destacados',
    en: 'Featured Projects',
    pt: 'Projetos Destacados'
  },

  // Education Section
  'education.title': {
    es: 'Mi Educación',
    en: 'My Education',
    pt: 'Minha Educação'
  },
  'education.subtitle': {
    es: 'Un viaje continuo de aprendizaje y crecimiento profesional',
    en: 'A continuous journey of learning and professional growth',
    pt: 'Uma jornada contínua de aprendizado e crescimento profissional'
  },
  'education.graduated': {
    es: 'Graduado',
    en: 'Graduated',
    pt: 'Graduado'
  },
  'education.completed': {
    es: 'Completado',
    en: 'Completed',
    pt: 'Concluído'
  },
  'education.certified': {
    es: 'Certificado',
    en: 'Certified',
    pt: 'Certificado'
  },
  'education.achievements': {
    es: 'Logros Destacados',
    en: 'Outstanding Achievements',
    pt: 'Conquistas Destacadas'
  },
  'education.courses': {
    es: 'Materias Destacadas',
    en: 'Featured Subjects',
    pt: 'Matérias Destacadas'
  },

  // Certificates Section
  'certificates.title': {
    es: 'Certificados',
    en: 'Certificates',
    pt: 'Certificados'
  },
  'certificates.subtitle': {
    es: 'Certificaciones que validan mis conocimientos técnicos',
    en: 'Certifications that validate my technical knowledge',
    pt: 'Certificações que validam meus conhecimentos técnicos'
  },
  'certificates.category.all': {
    es: 'Todos',
    en: 'All',
    pt: 'Todos'
  },
  'certificates.category.programming': {
    es: 'Programación',
    en: 'Programming',
    pt: 'Programação'
  },
  'certificates.category.cloud': {
    es: 'Cloud',
    en: 'Cloud',
    pt: 'Nuvem'
  },
  'certificates.category.design': {
    es: 'Diseño',
    en: 'Design',
    pt: 'Design'
  },
  'certificates.viewPDF': {
    es: 'Ver PDF',
    en: 'View PDF',
    pt: 'Ver PDF'
  },
  'certificates.download': {
    es: 'Descargar',
    en: 'Download',
    pt: 'Baixar'
  },

  // CV Section
  'cv.title': {
    es: 'Curriculum Vitae',
    en: 'Curriculum Vitae',
    pt: 'Curriculum Vitae'
  },
  'cv.subtitle': {
    es: 'Descarga mi CV en diferentes idiomas',
    en: 'Download my CV in different languages',
    pt: 'Baixe meu CV em diferentes idiomas'
  },
  'cv.preview': {
    es: 'Vista Previa',
    en: 'Preview',
    pt: 'Visualizar'
  },
  'cv.download': {
    es: 'Descargar',
    en: 'Download',
    pt: 'Baixar'
  },
  'cv.language.es': {
    es: 'Español',
    en: 'Spanish',
    pt: 'Espanhol'
  },
  'cv.language.en': {
    es: 'Inglés',
    en: 'English',
    pt: 'Inglês'
  },
  'cv.language.pt': {
    es: 'Portugués',
    en: 'Portuguese',
    pt: 'Português'
  },

  // Contact Section
  'contact.title': {
    es: 'Contáctame',
    en: 'Contact Me',
    pt: 'Entre em Contato'
  },
  'contact.subtitle': {
    es: '¿Tienes un proyecto en mente? ¡Hablemos!',
    en: 'Have a project in mind? Let\'s talk!',
    pt: 'Tem um projeto em mente? Vamos conversar!'
  },
  'contact.form.name': {
    es: 'Nombre',
    en: 'Name',
    pt: 'Nome'
  },
  'contact.form.email': {
    es: 'Email',
    en: 'Email',
    pt: 'Email'
  },
  'contact.form.subject': {
    es: 'Asunto',
    en: 'Subject',
    pt: 'Assunto'
  },
  'contact.form.message': {
    es: 'Mensaje',
    en: 'Message',
    pt: 'Mensagem'
  },
  'contact.form.send': {
    es: 'Enviar Mensaje',
    en: 'Send Message',
    pt: 'Enviar Mensagem'
  },
  'contact.form.sending': {
    es: 'Enviando...',
    en: 'Sending...',
    pt: 'Enviando...'
  },

  // Settings
  'settings.title': {
    es: 'Configuraciones',
    en: 'Settings',
    pt: 'Configurações'
  },
  'settings.theme': {
    es: 'Tema de Color',
    en: 'Color Theme',
    pt: 'Tema de Cor'
  },
  'settings.theme.light': {
    es: 'Claro',
    en: 'Light',
    pt: 'Claro'
  },
  'settings.theme.dark': {
    es: 'Oscuro',
    en: 'Dark',
    pt: 'Escuro'
  },
  'settings.theme.auto': {
    es: 'Auto',
    en: 'Auto',
    pt: 'Auto'
  },
  'settings.language': {
    es: 'Idioma',
    en: 'Language',
    pt: 'Idioma'
  },
  'settings.accessibility': {
    es: 'Accesibilidad',
    en: 'Accessibility',
    pt: 'Acessibilidade'
  },
  'settings.accessibility.reduceMotion': {
    es: 'Reducir animaciones',
    en: 'Reduce animations',
    pt: 'Reduzir animações'
  },
  'settings.accessibility.highContrast': {
    es: 'Alto contraste',
    en: 'High contrast',
    pt: 'Alto contraste'
  },
  'settings.accessibility.fontSize': {
    es: 'Tamaño de fuente',
    en: 'Font size',
    pt: 'Tamanho da fonte'
  },
  'settings.performance': {
    es: 'Rendimiento',
    en: 'Performance',
    pt: 'Desempenho'
  },
  'settings.performance.lazyLoading': {
    es: 'Carga diferida de imágenes',
    en: 'Lazy loading images',
    pt: 'Carregamento lazy de imagens'
  },
  'settings.performance.prefetch': {
    es: 'Precarga de páginas',
    en: 'Page prefetching',
    pt: 'Pré-carregamento de páginas'
  },
  'settings.reset': {
    es: 'Restaurar configuraciones',
    en: 'Reset settings',
    pt: 'Restaurar configurações'
  },
  'settings.export': {
    es: 'Exportar configuraciones',
    en: 'Export settings',
    pt: 'Exportar configurações'
  },

  // Months
  'month.january': {
    es: 'Enero',
    en: 'January',
    pt: 'Janeiro'
  },
  'month.february': {
    es: 'Febrero',
    en: 'February',
    pt: 'Fevereiro'
  },
  'month.march': {
    es: 'Marzo',
    en: 'March',
    pt: 'Março'
  },
  'month.april': {
    es: 'Abril',
    en: 'April',
    pt: 'Abril'
  },
  'month.may': {
    es: 'Mayo',
    en: 'May',
    pt: 'Maio'
  },
  'month.june': {
    es: 'Junio',
    en: 'June',
    pt: 'Junho'
  },
  'month.july': {
    es: 'Julio',
    en: 'July',
    pt: 'Julho'
  },
  'month.august': {
    es: 'Agosto',
    en: 'August',
    pt: 'Agosto'
  },
  'month.september': {
    es: 'Septiembre',
    en: 'September',
    pt: 'Setembro'
  },
  'month.october': {
    es: 'Octubre',
    en: 'October',
    pt: 'Outubro'
  },
  'month.november': {
    es: 'Noviembre',
    en: 'November',
    pt: 'Novembro'
  },
  'month.december': {
    es: 'Diciembre',
    en: 'December',
    pt: 'Dezembro'
  },

  // Time units
  'time.year': {
    es: 'año',
    en: 'year',
    pt: 'ano'
  },
  'time.years': {
    es: 'años',
    en: 'years',
    pt: 'anos'
  },
  'time.month': {
    es: 'mes',
    en: 'month',
    pt: 'mês'
  },
  'time.months': {
    es: 'meses',
    en: 'months',
    pt: 'meses'
  },

  // Status messages
  'status.loading': {
    es: 'Cargando...',
    en: 'Loading...',
    pt: 'Carregando...'
  },
  'status.error': {
    es: 'Error al cargar',
    en: 'Error loading',
    pt: 'Erro ao carregar'
  },
  'status.success': {
    es: 'Éxito',
    en: 'Success',
    pt: 'Sucesso'
  },
  'status.saved': {
    es: 'Guardado',
    en: 'Saved',
    pt: 'Salvo'
  }
};

// Clase para manejar internacionalización
export class I18n {
  private currentLanguage: string = 'es';
  private fallbackLanguage: string = 'es';

  constructor(language?: string) {
    this.currentLanguage = language || this.detectLanguage();
    this.setDocumentLanguage();
  }

  // Detectar idioma del navegador
  private detectLanguage(): string {
    const browserLang = navigator.language.split('-')[0];
    return supportedLanguages.find(lang => lang.code === browserLang)?.code || 'es';
  }

  // Establecer idioma del documento
  private setDocumentLanguage(): void {
    document.documentElement.lang = this.currentLanguage;
  }

  // Obtener traducción
  public t(key: string, params?: { [key: string]: string | number }): string {
    const translation = translations[key];
    
    if (!translation) {
      console.warn(`Translation missing for key: ${key}`);
      return key;
    }

    let text = translation[this.currentLanguage] || translation[this.fallbackLanguage] || key;

    // Reemplazar parámetros
    if (params) {
      Object.keys(params).forEach(param => {
        text = text.replace(`{{${param}}}`, String(params[param]));
      });
    }

    return text;
  }

  // Cambiar idioma
  public setLanguage(language: string): void {
    if (supportedLanguages.find(lang => lang.code === language)) {
      this.currentLanguage = language;
      this.setDocumentLanguage();
      this.updatePageTexts();
      this.saveLanguagePreference();
    }
  }

  // Obtener idioma actual
  public getCurrentLanguage(): string {
    return this.currentLanguage;
  }

  // Obtener idiomas soportados
  public getSupportedLanguages(): Language[] {
    return supportedLanguages;
  }

  // Actualizar textos de la página
  private updatePageTexts(): void {
    // Buscar elementos con atributo data-i18n
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      if (key) {
        const htmlElement = element as HTMLElement;
        
        // Verificar si es un placeholder, title u otro atributo
        const attribute = element.getAttribute('data-i18n-attr');
        if (attribute) {
          element.setAttribute(attribute, this.t(key));
        } else {
          htmlElement.textContent = this.t(key);
        }
      }
    });

    // Disparar evento personalizado para que los componentes se actualicen
    window.dispatchEvent(new CustomEvent('languageChanged', {
      detail: { language: this.currentLanguage }
    }));
  }

  // Guardar preferencia de idioma
  private saveLanguagePreference(): void {
    try {
      localStorage.setItem('portfolio-language', this.currentLanguage);
    } catch (error) {
      console.error('Error saving language preference:', error);
    }
  }

  // Cargar preferencia de idioma
  public loadLanguagePreference(): string {
    try {
      return localStorage.getItem('portfolio-language') || this.detectLanguage();
    } catch (error) {
      console.error('Error loading language preference:', error);
      return this.detectLanguage();
    }
  }

  // Formatear fecha según el idioma
  public formatDate(date: Date, options?: Intl.DateTimeFormatOptions): string {
    const defaultOptions: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };

    return new Intl.DateTimeFormat(this.currentLanguage, options || defaultOptions).format(date);
  }

  // Formatear número según el idioma
  public formatNumber(number: number, options?: Intl.NumberFormatOptions): string {
    return new Intl.NumberFormat(this.currentLanguage, options).format(number);
  }

  // Formatear moneda
  public formatCurrency(amount: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat(this.currentLanguage, {
      style: 'currency',
      currency: currency
    }).format(amount);
  }

  // Pluralización simple
  public plural(count: number, singularKey: string, pluralKey: string): string {
    return count === 1 ? this.t(singularKey) : this.t(pluralKey);
  }

  // Obtener dirección del texto (para idiomas RTL en el futuro)
  public getTextDirection(): 'ltr' | 'rtl' {
    // Por ahora todos los idiomas soportados son LTR
    return 'ltr';
  }
}

// Crear instancia global
let i18nInstance: I18n;

// Función helper para usar en templates
export function useI18n(): I18n {
  if (!i18nInstance) {
    i18nInstance = new I18n();
  }
  return i18nInstance;
}

// Función helper para traducir
export function t(key: string, params?: { [key: string]: string | number }): string {
  return useI18n().t(key, params);
}

// Función para inicializar i18n en el cliente
export function initI18n(): void {
  if (typeof window !== 'undefined') {
    // Cargar idioma guardado
    const savedLanguage = localStorage.getItem('portfolio-language');
    i18nInstance = new I18n(savedLanguage || undefined);
    
    // Hacer i18n disponible globalmente
    (window as any).i18n = i18nInstance;
    (window as any).t = (key: string, params?: any) => i18nInstance.t(key, params);
    
    console.log('🌐 i18n initialized with language:', i18nInstance.getCurrentLanguage());
  }
}