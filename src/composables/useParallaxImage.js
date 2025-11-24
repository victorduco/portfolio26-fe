import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Initialize parallax effect for an image element
 * @param {HTMLElement} container - Container/trigger element
 * @param {HTMLElement} img - Image element to animate
 * @param {Object} options - Animation options
 */
export function initializeParallaxImage(container, img, options = {}) {
  if (!container || !img) return;

  const { speed = 1.3, scrub = 0.5, markers = false } = options;

  const setupAnimation = () => {
    const endY = -(img.offsetHeight - container.offsetHeight) * speed;
    gsap.fromTo(img, { y: 0 }, {
      y: endY,
      ease: "none",
      scrollTrigger: {
        trigger: container,
        start: "top bottom",
        end: "bottom top",
        scrub,
        markers,
        invalidateOnRefresh: true,
      },
    });
  };

  if (img.complete) {
    setupAnimation();
  } else {
    img.addEventListener('load', () => {
      setupAnimation();
      setTimeout(() => ScrollTrigger.refresh(), 100);
    });
  }
}

export function initializeMarkdownParallax() {
  document.querySelectorAll('.fullscreen-parallax-image').forEach((container) => {
    const images = container.querySelectorAll('.parallax-image');
    images.forEach((img) => {
      const speed = parseFloat(img.getAttribute('data-speed')) || (images.length > 1 ? 1.0 : 1.3);
      initializeParallaxImage(container, img, { speed, scrub: 0.5, markers: false });
    });
  });
}
