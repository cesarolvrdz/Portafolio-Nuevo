// Accessibility enhancements para el portfolio
// Mejoras de accesibilidad y usabilidad

export interface AccessibilityOptions {
  announcements: boolean;
  keyboardNavigation: boolean;
  focusIndicators: boolean;
  screenReaderOptimization: boolean;
  colorBlindnessSupport: boolean;
}

// Clase principal para gestión de accesibilidad
export class AccessibilityManager {
  private options: AccessibilityOptions;
  private focusableElements: string = 'a, button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])';
  private currentFocusIndex: number = 0;
  private focusableElementsList: HTMLElement[] = [];

  constructor(options: Partial<AccessibilityOptions> = {}) {
    this.options = {
      announcements: true,
      keyboardNavigation: true,
      focusIndicators: true,
      screenReaderOptimization: true,
      colorBlindnessSupport: true,
      ...options
    };

    this.init();
  }

  // Inicializar el sistema de accesibilidad
  private init(): void {
    this.setupLiveRegion();
    this.setupKeyboardNavigation();
    this.setupFocusManagement();
    this.setupScreenReaderOptimizations();
    this.setupColorBlindnessSupport();
    this.setupSkipLinks();
    this.setupARIALabels();
    
    console.log('♿ Accessibility Manager initialized');
  }

  // Configurar región live para anuncios
  private setupLiveRegion(): void {
    if (!this.options.announcements) return;

    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.setAttribute('id', 'live-region');
    liveRegion.style.cssText = `
      position: absolute;
      left: -10000px;
      width: 1px;
      height: 1px;
      overflow: hidden;
    `;
    
    document.body.appendChild(liveRegion);
  }

  // Anunciar mensaje a lectores de pantalla
  public announce(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
    if (!this.options.announcements) return;

    const liveRegion = document.getElementById('live-region');
    if (liveRegion) {
      liveRegion.setAttribute('aria-live', priority);
      liveRegion.textContent = message;
      
      // Limpiar después de 1 segundo
      setTimeout(() => {
        liveRegion.textContent = '';
      }, 1000);
    }
  }

  // Configurar navegación por teclado
  private setupKeyboardNavigation(): void {
    if (!this.options.keyboardNavigation) return;

    document.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'Tab':
          this.handleTabNavigation(e);
          break;
        case 'Escape':
          this.handleEscapeKey(e);
          break;
        case 'Enter':
        case ' ':
          this.handleActivation(e);
          break;
        case 'ArrowUp':
        case 'ArrowDown':
        case 'ArrowLeft':
        case 'ArrowRight':
          this.handleArrowNavigation(e);
          break;
        case 'Home':
        case 'End':
          this.handleHomeEndNavigation(e);
          break;
      }
    });

    // Navegación por secciones con Alt + número
    document.addEventListener('keydown', (e) => {
      if (e.altKey && e.key >= '1' && e.key <= '9') {
        e.preventDefault();
        this.navigateToSection(parseInt(e.key));
      }
    });
  }

  // Manejar navegación con Tab
  private handleTabNavigation(e: KeyboardEvent): void {
    this.updateFocusableElementsList();
    
    // Trap focus en modales
    const modal = document.querySelector('[role="dialog"]:not([aria-hidden="true"])');
    if (modal) {
      this.trapFocus(e, modal as HTMLElement);
    }
  }

  // Trap focus dentro de un elemento
  private trapFocus(e: KeyboardEvent, container: HTMLElement): void {
    const focusableElements = container.querySelectorAll(this.focusableElements) as NodeListOf<HTMLElement>;
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  }

  // Manejar tecla Escape
  private handleEscapeKey(e: KeyboardEvent): void {
    // Cerrar modales
    const modal = document.querySelector('[role="dialog"]:not([aria-hidden="true"])');
    if (modal) {
      const closeButton = modal.querySelector('[data-close-modal]') as HTMLElement;
      if (closeButton) {
        closeButton.click();
      }
    }

    // Cerrar menús desplegables
    const dropdown = document.querySelector('[aria-expanded="true"]');
    if (dropdown) {
      dropdown.setAttribute('aria-expanded', 'false');
    }
  }

  // Manejar activación con Enter/Espacio
  private handleActivation(e: KeyboardEvent): void {
    const target = e.target as HTMLElement;
    
    // Activar elementos clickeables que no son nativamente activables
    if (target.hasAttribute('role') && 
        ['button', 'tab', 'menuitem'].includes(target.getAttribute('role') || '')) {
      e.preventDefault();
      target.click();
    }
  }

  // Manejar navegación con flechas
  private handleArrowNavigation(e: KeyboardEvent): void {
    const target = e.target as HTMLElement;
    
    // Navegación en tabs
    if (target.getAttribute('role') === 'tab') {
      this.handleTabNavigation(e);
    }
    
    // Navegación en menús
    if (target.getAttribute('role') === 'menuitem') {
      this.handleMenuNavigation(e);
    }
  }

  // Navegación en tabs
  private handleTabListNavigation(e: KeyboardEvent): void {
    const tabList = (e.target as HTMLElement).closest('[role="tablist"]');
    if (!tabList) return;

    const tabs = tabList.querySelectorAll('[role="tab"]') as NodeListOf<HTMLElement>;
    const currentIndex = Array.from(tabs).indexOf(e.target as HTMLElement);
    let nextIndex = currentIndex;

    switch (e.key) {
      case 'ArrowLeft':
      case 'ArrowUp':
        nextIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
        break;
      case 'ArrowRight':
      case 'ArrowDown':
        nextIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
        break;
      case 'Home':
        nextIndex = 0;
        break;
      case 'End':
        nextIndex = tabs.length - 1;
        break;
    }

    if (nextIndex !== currentIndex) {
      e.preventDefault();
      tabs[nextIndex].focus();
      tabs[nextIndex].click();
    }
  }

  // Navegación en menús
  private handleMenuNavigation(e: KeyboardEvent): void {
    const menu = (e.target as HTMLElement).closest('[role="menu"]');
    if (!menu) return;

    const items = menu.querySelectorAll('[role="menuitem"]') as NodeListOf<HTMLElement>;
    const currentIndex = Array.from(items).indexOf(e.target as HTMLElement);
    let nextIndex = currentIndex;

    switch (e.key) {
      case 'ArrowUp':
        nextIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
        break;
      case 'ArrowDown':
        nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
        break;
      case 'Home':
        nextIndex = 0;
        break;
      case 'End':
        nextIndex = items.length - 1;
        break;
    }

    if (nextIndex !== currentIndex) {
      e.preventDefault();
      items[nextIndex].focus();
    }
  }

  // Manejar navegación Home/End
  private handleHomeEndNavigation(e: KeyboardEvent): void {
    const target = e.target as HTMLElement;
    
    if (['INPUT', 'TEXTAREA'].includes(target.tagName)) return;

    if (e.key === 'Home') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      this.announce('Navegado al inicio de la página');
    } else if (e.key === 'End') {
      e.preventDefault();
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      this.announce('Navegado al final de la página');
    }
  }

  // Navegar a sección específica
  private navigateToSection(sectionNumber: number): void {
    const sections = document.querySelectorAll('section, main > div');
    const section = sections[sectionNumber - 1] as HTMLElement;
    
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
      
      // Enfocar el primer elemento enfocable de la sección
      const focusable = section.querySelector(this.focusableElements) as HTMLElement;
      if (focusable) {
        focusable.focus();
      }
      
      const sectionName = section.getAttribute('aria-label') || 
                         section.querySelector('h1, h2, h3')?.textContent || 
                         `Sección ${sectionNumber}`;
      this.announce(`Navegando a ${sectionName}`);
    }
  }

  // Actualizar lista de elementos enfocables
  private updateFocusableElementsList(): void {
    this.focusableElementsList = Array.from(
      document.querySelectorAll(this.focusableElements)
    ).filter(el => {
      const element = el as HTMLElement;
      return element.offsetParent !== null && 
             !element.hasAttribute('disabled') &&
             element.getAttribute('aria-hidden') !== 'true';
    }) as HTMLElement[];
  }

  // Configurar gestión de foco
  private setupFocusManagement(): void {
    if (!this.options.focusIndicators) return;

    // Mejorar indicadores de foco
    const style = document.createElement('style');
    style.textContent = `
      /* Indicadores de foco mejorados */
      .focus-visible,
      *:focus-visible {
        outline: 3px solid #4F46E5;
        outline-offset: 2px;
        border-radius: 4px;
      }
      
      /* Foco para elementos interactivos */
      button:focus-visible,
      a:focus-visible,
      input:focus-visible,
      textarea:focus-visible,
      select:focus-visible {
        box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.3);
      }
      
      /* Foco para elementos personalizados */
      [role="button"]:focus-visible,
      [role="tab"]:focus-visible,
      [role="menuitem"]:focus-visible {
        outline: 3px solid #4F46E5;
        outline-offset: 2px;
      }
      
      /* Indicador de foco skip link */
      .skip-link:focus {
        position: fixed;
        top: 1rem;
        left: 1rem;
        z-index: 9999;
        background: #4F46E5;
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 0.375rem;
        text-decoration: none;
        transform: translateY(0);
      }
    `;
    document.head.appendChild(style);

    // Gestionar focus visible
    this.setupFocusVisible();
  }

  // Configurar focus-visible para navegación por teclado
  private setupFocusVisible(): void {
    let hadKeyboardEvent = false;

    const keyboardEventHandler = () => {
      hadKeyboardEvent = true;
    };

    const mouseEventHandler = () => {
      hadKeyboardEvent = false;
    };

    const focusHandler = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (hadKeyboardEvent) {
        target.classList.add('focus-visible');
      }
    };

    const blurHandler = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      target.classList.remove('focus-visible');
    };

    document.addEventListener('keydown', keyboardEventHandler);
    document.addEventListener('mousedown', mouseEventHandler);
    document.addEventListener('focus', focusHandler, true);
    document.addEventListener('blur', blurHandler, true);
  }

  // Configurar optimizaciones para lectores de pantalla
  private setupScreenReaderOptimizations(): void {
    if (!this.options.screenReaderOptimization) return;

    // Agregar landmarks semánticos
    this.addLandmarks();
    
    // Configurar actualizaciones dinámicas
    this.setupDynamicUpdates();
    
    // Mejorar navegación de formularios
    this.enhanceFormAccessibility();
  }

  // Agregar landmarks ARIA
  private addLandmarks(): void {
    // Identificar y marcar regiones principales
    const header = document.querySelector('header');
    if (header && !header.getAttribute('role')) {
      header.setAttribute('role', 'banner');
    }

    const nav = document.querySelector('nav');
    if (nav && !nav.getAttribute('role')) {
      nav.setAttribute('role', 'navigation');
      nav.setAttribute('aria-label', 'Navegación principal');
    }

    const main = document.querySelector('main');
    if (main && !main.getAttribute('role')) {
      main.setAttribute('role', 'main');
    }

    const footer = document.querySelector('footer');
    if (footer && !footer.getAttribute('role')) {
      footer.setAttribute('role', 'contentinfo');
    }

    // Marcar secciones importantes
    const sections = document.querySelectorAll('section');
    sections.forEach((section, index) => {
      if (!section.getAttribute('aria-label') && !section.getAttribute('aria-labelledby')) {
        const heading = section.querySelector('h1, h2, h3, h4, h5, h6');
        if (heading) {
          const id = heading.id || `section-heading-${index}`;
          heading.id = id;
          section.setAttribute('aria-labelledby', id);
        }
      }
    });
  }

  // Configurar actualizaciones dinámicas
  private setupDynamicUpdates(): void {
    // Observer para cambios en el DOM
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as HTMLElement;
              this.enhanceNewElement(element);
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // Mejorar elemento recién agregado
  private enhanceNewElement(element: HTMLElement): void {
    // Agregar ARIA labels si faltan
    if (element.tagName === 'BUTTON' && !element.getAttribute('aria-label')) {
      const text = element.textContent?.trim();
      if (text) {
        element.setAttribute('aria-label', text);
      }
    }

    // Configurar elementos interactivos
    if (element.hasAttribute('onclick') && !element.getAttribute('role')) {
      element.setAttribute('role', 'button');
      element.setAttribute('tabindex', '0');
    }
  }

  // Mejorar accesibilidad de formularios
  private enhanceFormAccessibility(): void {
    const forms = document.querySelectorAll('form');
    
    forms.forEach((form) => {
      // Asociar labels con inputs
      const inputs = form.querySelectorAll('input, textarea, select');
      inputs.forEach((input) => {
        const inputElement = input as HTMLInputElement;
        
        if (!inputElement.getAttribute('aria-label') && !inputElement.getAttribute('aria-labelledby')) {
          const label = form.querySelector(`label[for="${inputElement.id}"]`);
          if (label) {
            label.setAttribute('for', inputElement.id);
          } else {
            // Buscar label padre
            const parentLabel = inputElement.closest('label');
            if (parentLabel && parentLabel.textContent) {
              inputElement.setAttribute('aria-label', parentLabel.textContent.trim());
            }
          }
        }

        // Agregar descripciones de error
        if (inputElement.hasAttribute('required')) {
          inputElement.setAttribute('aria-required', 'true');
        }
      });

      // Configurar validación accesible
      form.addEventListener('submit', (e) => {
        const firstInvalidInput = form.querySelector(':invalid') as HTMLElement;
        if (firstInvalidInput) {
          e.preventDefault();
          firstInvalidInput.focus();
          this.announce('Por favor, revisa los errores en el formulario');
        }
      });
    });
  }

  // Configurar soporte para daltonismo
  private setupColorBlindnessSupport(): void {
    if (!this.options.colorBlindnessSupport) return;

    // Agregar patrones a elementos que solo usan color para información
    const style = document.createElement('style');
    style.textContent = `
      /* Patrones para elementos de estado */
      .status-success:before {
        content: "✓ ";
        font-weight: bold;
      }
      
      .status-error:before {
        content: "✗ ";
        font-weight: bold;
      }
      
      .status-warning:before {
        content: "⚠ ";
        font-weight: bold;
      }
      
      /* Patrones para elementos requeridos */
      [required]:not([aria-label*="requerido"]):after,
      [aria-required="true"]:not([aria-label*="requerido"]):after {
        content: " *";
        color: #DC2626;
        font-weight: bold;
      }
      
      /* Mejores indicadores para links */
      a:not([class*="button"]):not([class*="btn"]) {
        text-decoration: underline;
      }
      
      /* Patrones para filtros activos */
      .filter-active:before {
        content: "● ";
        font-weight: bold;
      }
    `;
    document.head.appendChild(style);
  }

  // Configurar skip links
  private setupSkipLinks(): void {
    const skipLinks = [
      { href: '#main', text: 'Saltar al contenido principal' },
      { href: '#navigation', text: 'Saltar a la navegación' },
      { href: '#footer', text: 'Saltar al pie de página' }
    ];

    const skipContainer = document.createElement('div');
    skipContainer.className = 'skip-links';
    skipContainer.style.cssText = `
      position: fixed;
      top: -40px;
      left: 0;
      z-index: 10000;
    `;

    skipLinks.forEach((link) => {
      const skipLink = document.createElement('a');
      skipLink.href = link.href;
      skipLink.textContent = link.text;
      skipLink.className = 'skip-link';
      skipLink.style.cssText = `
        position: absolute;
        top: 0;
        left: -9999px;
        width: 1px;
        height: 1px;
        overflow: hidden;
        background: #4F46E5;
        color: white;
        padding: 0.5rem 1rem;
        text-decoration: none;
        border-radius: 0 0 0.375rem 0.375rem;
        transition: all 0.3s ease;
      `;

      skipLink.addEventListener('focus', () => {
        skipLink.style.cssText = `
          position: fixed;
          top: 0;
          left: 1rem;
          width: auto;
          height: auto;
          overflow: visible;
          background: #4F46E5;
          color: white;
          padding: 0.5rem 1rem;
          text-decoration: none;
          border-radius: 0 0 0.375rem 0.375rem;
          z-index: 10001;
        `;
      });

      skipLink.addEventListener('blur', () => {
        skipLink.style.cssText = `
          position: absolute;
          top: 0;
          left: -9999px;
          width: 1px;
          height: 1px;
          overflow: hidden;
        `;
      });

      skipContainer.appendChild(skipLink);
    });

    document.body.insertBefore(skipContainer, document.body.firstChild);
  }

  // Configurar labels ARIA automáticos
  private setupARIALabels(): void {
    // Configurar botones sin label
    const buttons = document.querySelectorAll('button:not([aria-label]):not([aria-labelledby])');
    buttons.forEach((button) => {
      const buttonElement = button as HTMLButtonElement;
      const text = buttonElement.textContent?.trim();
      const icon = buttonElement.querySelector('svg, i');
      
      if (!text && icon) {
        // Intentar determinar la función del botón por su contexto
        const parent = buttonElement.closest('[data-action]');
        const action = parent?.getAttribute('data-action') || 'acción';
        buttonElement.setAttribute('aria-label', `Botón de ${action}`);
      }
    });

    // Configurar links sin contexto
    const links = document.querySelectorAll('a:not([aria-label]):not([aria-labelledby])');
    links.forEach((link) => {
      const linkElement = link as HTMLAnchorElement;
      const text = linkElement.textContent?.trim();
      
      if (text === 'Ver más' || text === 'Leer más' || text === 'Click aquí') {
        const section = linkElement.closest('section, article, div[class*="card"]');
        const heading = section?.querySelector('h1, h2, h3, h4, h5, h6');
        if (heading) {
          linkElement.setAttribute('aria-label', `${text}: ${heading.textContent}`);
        }
      }
    });

    // Configurar imágenes decorativas
    const images = document.querySelectorAll('img:not([alt]):not([aria-label])');
    images.forEach((img) => {
      const imgElement = img as HTMLImageElement;
      if (imgElement.closest('[data-decorative]') || 
          imgElement.src.includes('decoration') ||
          imgElement.src.includes('background')) {
        imgElement.setAttribute('alt', '');
        imgElement.setAttribute('role', 'presentation');
      }
    });
  }

  // Verificar estado de accesibilidad
  public checkAccessibility(): string[] {
    const issues: string[] = [];

    // Verificar imágenes sin alt
    const imagesWithoutAlt = document.querySelectorAll('img:not([alt])');
    if (imagesWithoutAlt.length > 0) {
      issues.push(`${imagesWithoutAlt.length} imágenes sin texto alternativo`);
    }

    // Verificar botones sin label
    const buttonsWithoutLabel = document.querySelectorAll('button:not([aria-label]):not([aria-labelledby])');
    const buttonsWithoutText = Array.from(buttonsWithoutLabel).filter(btn => !btn.textContent?.trim());
    if (buttonsWithoutText.length > 0) {
      issues.push(`${buttonsWithoutText.length} botones sin etiqueta accesible`);
    }

    // Verificar contraste (simulado)
    const lowContrastElements = document.querySelectorAll('.text-gray-400, .text-gray-300');
    if (lowContrastElements.length > 0) {
      issues.push(`${lowContrastElements.length} elementos con posible bajo contraste`);
    }

    // Verificar headings jerárquicos
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    let lastLevel = 0;
    let hierarchyIssues = 0;
    
    headings.forEach(heading => {
      const level = parseInt(heading.tagName[1]);
      if (level > lastLevel + 1) {
        hierarchyIssues++;
      }
      lastLevel = level;
    });
    
    if (hierarchyIssues > 0) {
      issues.push(`${hierarchyIssues} problemas en la jerarquía de encabezados`);
    }

    // Mostrar resultados
    if (issues.length === 0) {
      this.announce('Verificación de accesibilidad completada: no se encontraron problemas');
      console.log('✅ Accessibility check: No issues found');
    } else {
      console.warn('⚠️ Accessibility issues found:', issues);
      this.announce(`Verificación de accesibilidad: ${issues.length} problemas encontrados`);
    }

    return issues;
  }

  // Activar/desactivar funciones de accesibilidad
  public toggleFeature(feature: keyof AccessibilityOptions, enabled: boolean): void {
    this.options[feature] = enabled;
    
    // Re-aplicar configuraciones si es necesario
    switch (feature) {
      case 'announcements':
        if (!enabled) {
          const liveRegion = document.getElementById('live-region');
          if (liveRegion) {
            liveRegion.remove();
          }
        } else {
          this.setupLiveRegion();
        }
        break;
      
      case 'focusIndicators':
        if (!enabled) {
          document.querySelectorAll('.focus-visible').forEach(el => {
            el.classList.remove('focus-visible');
          });
        }
        break;
    }
  }
}

// Función para inicializar accesibilidad
export function initAccessibility(options?: Partial<AccessibilityOptions>): AccessibilityManager {
  const manager = new AccessibilityManager(options);
  
  // Hacer disponible globalmente para debugging
  if (typeof window !== 'undefined') {
    (window as any).accessibilityManager = manager;
  }
  
  return manager;
}

// Función helper para anuncios rápidos
export function announce(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
  if (typeof window !== 'undefined' && (window as any).accessibilityManager) {
    (window as any).accessibilityManager.announce(message, priority);
  }
}