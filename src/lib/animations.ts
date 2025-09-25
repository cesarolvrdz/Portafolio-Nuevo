/**
 * Sistema de animaciones para elementos que entran en viewport
 * Utiliza Intersection Observer para detectar cuando los elementos son visibles
 */

// Configuración de las animaciones
export const animationConfig = {
  threshold: 0.1, // Elemento visible al 10%
  rootMargin: '0px 0px -50px 0px', // Margen para activar antes
  duration: '0.6s',
  easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
};

// Tipos de animaciones disponibles
export const animationTypes = {
  fadeInUp: 'animate-fade-in-up',
  fadeInDown: 'animate-fade-in-down',
  fadeInLeft: 'animate-fade-in-left',
  fadeInRight: 'animate-fade-in-right',
  fadeIn: 'animate-fade-in',
  scaleIn: 'animate-scale-in',
  slideInUp: 'animate-slide-in-up',
  stagger: 'animate-stagger'
};

// Clase para manejar las animaciones de scroll
export class ScrollAnimations {
  private observer: IntersectionObserver | null = null;
  private animatedElements = new Set<Element>();

  constructor() {
    this.init();
  }

  private init() {
    if (typeof window === 'undefined') return;

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !this.animatedElements.has(entry.target)) {
            this.animateElement(entry.target);
            this.animatedElements.add(entry.target);
          }
        });
      },
      {
        threshold: animationConfig.threshold,
        rootMargin: animationConfig.rootMargin
      }
    );

    // Observar elementos que tienen atributos de animación
    this.observeElements();
  }

  private observeElements() {
    if (!this.observer) return;

    // Seleccionar elementos con data-animate
    const elements = document.querySelectorAll('[data-animate]');
    elements.forEach((element) => {
      this.observer!.observe(element);
    });

    // Seleccionar elementos con clases de animación
    const animatedElements = document.querySelectorAll('[class*="animate-"]');
    animatedElements.forEach((element) => {
      // Solo observar si no tiene la clase 'animate-' activa
      if (!element.className.includes('animate-active')) {
        this.observer!.observe(element);
      }
    });
  }

  private animateElement(element: Element) {
    const animationType = element.getAttribute('data-animate') || 'fadeInUp';
    const delay = element.getAttribute('data-animate-delay') || '0';
    const duration = element.getAttribute('data-animate-duration') || animationConfig.duration;

    // Agregar clases de animación
    element.classList.add('animate-active');
    
    // Aplicar delay si se especifica
    if (delay !== '0') {
      element.classList.add(`animate-delay-${delay}`);
    }

    // Aplicar duración personalizada
    if (duration !== animationConfig.duration) {
      (element as HTMLElement).style.animationDuration = duration;
    }

    // Para animaciones stagger, animar elementos hijos
    if (animationType === 'stagger') {
      this.applyStaggerAnimation(element);
    }
  }

  private applyStaggerAnimation(parent: Element) {
    const children = parent.children;
    Array.from(children).forEach((child, index) => {
      setTimeout(() => {
        child.classList.add('animate-active', 'animate-fade-in-up');
      }, index * 100); // 100ms de delay entre elementos
    });
  }

  // Método para reinicializar el observer (útil para contenido dinámico)
  public refresh() {
    if (this.observer) {
      this.observer.disconnect();
      this.animatedElements.clear();
      this.observeElements();
    }
  }

  // Método para limpiar
  public destroy() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    this.animatedElements.clear();
  }
}

// Función para inicializar las animaciones
export function initScrollAnimations(): ScrollAnimations {
  return new ScrollAnimations();
}

// Utility function para agregar animaciones a elementos dinámicos
export function addScrollAnimation(
  element: HTMLElement, 
  animationType: keyof typeof animationTypes = 'fadeInUp',
  delay: string = '0'
) {
  element.setAttribute('data-animate', animationType);
  if (delay !== '0') {
    element.setAttribute('data-animate-delay', delay);
  }
  
  // Si ya existe una instancia de ScrollAnimations, refrescar
  if (window.scrollAnimations) {
    (window.scrollAnimations as ScrollAnimations).refresh();
  }
}

// Declarar en window para acceso global
declare global {
  interface Window {
    scrollAnimations?: ScrollAnimations;
  }
}