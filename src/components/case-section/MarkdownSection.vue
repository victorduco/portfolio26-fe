<template>
  <section :class="`case-${sectionType}`">
    <div class="markdown-content" v-html="markdownContent"></div>
  </section>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue";
import { initializeMarkdownParallax } from "@/composables/useParallaxImage";

const props = defineProps({
  caseId: {
    type: String,
    required: true,
  },
  sectionType: {
    type: String,
    required: true,
    validator: (value) => ["background", "challenge", "scale", "solution", "process", "results", "design", "audit", "redesign", "conclusion"].includes(value),
  },
  caseConfig: {
    type: Object,
    default: () => ({}),
  },
});

const markdownContent = ref("");

onMounted(async () => {
  try {
    const response = await fetch(
      `/content/cases/case${props.caseId}-${props.sectionType}.md`
    );
    const markdown = await response.text();
    markdownContent.value = renderMarkdown(markdown);

    // Initialize magnifier and parallax after content is rendered
    await nextTick();
    initializeMagnifiers();
    initializeMarkdownParallax();
  } catch (error) {
    console.error(`Error loading ${props.sectionType} content:`, error);
    markdownContent.value = "<p>Error loading content</p>";
  }
});

function initializeMagnifiers() {
  const containers = document.querySelectorAll('.fullscreen-image-container[data-magnifier="true"]');

  containers.forEach((container) => {
    const img = container.querySelector('.fullscreen-image-md');
    if (!img) return;

    let magnifier = null;
    let magnifierImage = null;

    const createMagnifier = () => {
      magnifier = document.createElement('div');
      magnifier.className = 'magnifier-md';

      magnifierImage = document.createElement('div');
      magnifierImage.className = 'magnifier-md__image';

      magnifier.appendChild(magnifierImage);
      container.appendChild(magnifier);
    };

    const handleMouseEnter = () => {
      if (!magnifier) createMagnifier();
      magnifier.style.opacity = '1';
      img.style.cursor = 'none';
    };

    const handleMouseLeave = () => {
      if (magnifier) {
        magnifier.style.opacity = '0';
      }
      img.style.cursor = 'default';
    };

    const handleMouseMove = (e) => {
      if (!magnifier || !magnifierImage) return;

      const rect = img.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const magnifierSize = 250;
      const zoomLevel = 2.5;
      const halfSize = magnifierSize / 2;

      // Position magnifier
      magnifier.style.left = `${x - halfSize}px`;
      magnifier.style.top = `${y - halfSize}px`;
      magnifier.style.width = `${magnifierSize}px`;
      magnifier.style.height = `${magnifierSize}px`;

      // Calculate actual image dimensions based on object-fit: contain
      const imgNaturalWidth = img.naturalWidth;
      const imgNaturalHeight = img.naturalHeight;
      const containerWidth = rect.width;
      const containerHeight = rect.height;

      // Calculate actual rendered size with object-fit: contain
      const containerRatio = containerWidth / containerHeight;
      const imageRatio = imgNaturalWidth / imgNaturalHeight;

      let renderedWidth, renderedHeight, offsetX, offsetY;
      if (imageRatio > containerRatio) {
        // Image is wider - width fills container
        renderedWidth = containerWidth;
        renderedHeight = containerWidth / imageRatio;
        offsetX = 0;
        offsetY = (containerHeight - renderedHeight) / 2;
      } else {
        // Image is taller - height fills container
        renderedHeight = containerHeight;
        renderedWidth = containerHeight * imageRatio;
        offsetX = (containerWidth - renderedWidth) / 2;
        offsetY = 0;
      }

      // Adjust mouse position to account for image offset
      const adjustedMouseX = x - offsetX;
      const adjustedMouseY = y - offsetY;

      // Get background color from parent background div
      const bgDiv = container.closest('.fullscreen-image-background');
      const bgColor = bgDiv?.style.backgroundColor || 'transparent';

      // Set background color and image
      magnifierImage.style.backgroundColor = bgColor;
      magnifierImage.style.backgroundImage = `url(${img.src})`;
      magnifierImage.style.backgroundSize = `${renderedWidth * zoomLevel}px ${renderedHeight * zoomLevel}px`;
      magnifierImage.style.backgroundPosition = `-${adjustedMouseX * zoomLevel - halfSize}px -${adjustedMouseY * zoomLevel - halfSize}px`;
    };

    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);
    container.addEventListener('mousemove', handleMouseMove);
  });
}

function renderMarkdown(md) {
  // Get background color from case config (same as video background for case 1)
  const bgColor = props.caseConfig?.videoBackground || 'transparent';

  return (
    md
      // Parallax images: ![fullscreen|parallax|Label](url) or ![fullscreen|parallax](url)
      .replace(
        /!\[fullscreen\|parallax(?:\|(.*?))?\]\((.*?)\)/gim,
        (_match, label, url) => {
          return `___PARALLAX_IMAGE___${url}___BG_${bgColor}___LABEL_${label || ''}___END___`;
        }
      )
      // Fullscreen images with magnifier, label and sources: ![fullscreen|magnifier|Label|sources:Name:url,Name2:url2](url)
      .replace(
        /!\[fullscreen\|magnifier\|(.*?)\|sources:(.*?)\]\((.*?)\)/gim,
        `___FULLSCREEN_IMAGE___$3___BG_${bgColor}___MAG_true___PARALLAX_false___LABEL_$1___SOURCES_$2___END___`
      )
      // Fullscreen images with label and sources: ![fullscreen|Label|sources:Name:url,Name2:url2](url)
      .replace(
        /!\[fullscreen\|(.*?)\|sources:(.*?)\]\((.*?)\)/gim,
        `___FULLSCREEN_IMAGE___$3___BG_${bgColor}___MAG_false___PARALLAX_false___LABEL_$1___SOURCES_$2___END___`
      )
      // Fullscreen images with magnifier and sources (no label): ![fullscreen|magnifier|sources:Name:url](url)
      .replace(
        /!\[fullscreen\|magnifier\|sources:(.*?)\]\((.*?)\)/gim,
        `___FULLSCREEN_IMAGE___$2___BG_${bgColor}___MAG_true___PARALLAX_false___LABEL____SOURCES_$1___END___`
      )
      // Fullscreen images with sources only (no label, no magnifier): ![fullscreen|sources:Name:url](url)
      .replace(
        /!\[fullscreen\|sources:(.*?)\]\((.*?)\)/gim,
        `___FULLSCREEN_IMAGE___$2___BG_${bgColor}___MAG_false___PARALLAX_false___LABEL____SOURCES_$1___END___`
      )
      // Fullscreen images with magnifier and label: ![fullscreen|magnifier|Label](url)
      .replace(
        /!\[fullscreen\|magnifier\|(.*?)\]\((.*?)\)/gim,
        `___FULLSCREEN_IMAGE___$2___BG_${bgColor}___MAG_true___PARALLAX_false___LABEL_$1___SOURCES____END___`
      )
      // Fullscreen images with magnifier: ![fullscreen|magnifier](url)
      .replace(
        /!\[fullscreen\|magnifier\]\((.*?)\)/gim,
        `___FULLSCREEN_IMAGE___$1___BG_${bgColor}___MAG_true___PARALLAX_false___LABEL____SOURCES____END___`
      )
      // Fullscreen images with label: ![fullscreen|Label](url)
      .replace(
        /!\[fullscreen\|(.*?)\]\((.*?)\)/gim,
        `___FULLSCREEN_IMAGE___$2___BG_${bgColor}___MAG_false___PARALLAX_false___LABEL_$1___SOURCES____END___`
      )
      // Fullscreen images: ![fullscreen](url) - use unique placeholder
      .replace(
        /!\[fullscreen\]\((.*?)\)/gim,
        `___FULLSCREEN_IMAGE___$1___BG_${bgColor}___MAG_false___PARALLAX_false___LABEL____SOURCES____END___`
      )
      .replace(/^### (.*$)/gim, "<h3>$1</h3>")
      .replace(/^## (.*$)/gim, "<h2>$1</h2>")
      .replace(/^# (.*$)/gim, "<h1>$1</h1>")
      .replace(/\*\*(.*?)\*\*/gim, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/gim, "<em>$1</em>")
      .replace(/```(\w+)?\n([\s\S]*?)```/gim, "<pre><code>$2</code></pre>")
      .replace(/`([^`]+)`/gim, "<code>$1</code>")
      .replace(/\|(.+)\|/g, (match) => {
        const cells = match.split("|").filter((c) => c.trim());
        const isHeader = cells.some((c) => c.includes("---"));
        if (isHeader) return "";
        const tag = cells[0].match(/^\s*[A-Z]/) ? "th" : "td";
        return (
          "<tr>" +
          cells.map((c) => `<${tag}>${c.trim()}</${tag}>`).join("") +
          "</tr>"
        );
      })
      .replace(/(<tr>.*<\/tr>)+/s, "<table>$&</table>")
      .replace(/^> (.+)$/gim, "<blockquote>$1</blockquote>")
      .replace(/^\- (.*$)/gim, "<li>$1</li>")
      .replace(/(<li>.*<\/li>)/s, "<ul>$1</ul>")
      .replace(/^\d+\. (.*$)/gim, "<li>$1</li>")
      .replace(/---$/gm, "<hr>")
      .replace(/\n\n/g, "</p><p>")
      .replace(/^(?!<[hult]|<pre|<blockquote|<hr|___)/gm, "<p>")
      .replace(/(?![hult]>|pre>|blockquote>|hr>|___)$/gm, "</p>")
      // Replace parallax image placeholder with HTML
      .replace(
        /___PARALLAX_IMAGE___(.*?)___BG_(.*?)___LABEL_(.*?)___END___/gim,
        (_match, url, bg, label) => {
          const labelHtml = label ? `<h3 class="parallax-image-label">${label}</h3>` : '';
          return `<div class="fullscreen-parallax-wrapper">${labelHtml}<div class="fullscreen-parallax-image"><div class="parallax-background-container" style="background-color: ${bg};"><div class="parallax-image-container"><img src="${url}" alt="Parallax image" class="parallax-image" loading="lazy" /></div></div></div></div>`;
        }
      )
      // Replace placeholder with actual image after paragraph processing
      .replace(
        /___FULLSCREEN_IMAGE___(.*?)___BG_(.*?)___MAG_(.*?)___PARALLAX_(.*?)___LABEL_(.*?)___SOURCES_(.*?)___END___/gim,
        (match, url, bg, mag, _parallax, label, sources) => {
          // Parse sources: "Name:url,Name2:url2" -> array of {name, url}
          const sourcesArray = sources ? sources.split(',').map(s => {
            const [name, url] = s.split(':');
            return { name: name?.trim() || '', url: url?.trim() || '' };
          }).filter(s => s.name && s.url) : [];

          const sourcesAttr = sourcesArray.length > 0 ? ` data-sources='${JSON.stringify(sourcesArray)}'` : '';

          let labelHtml = '';
          if (label && sourcesArray.length > 0) {
            // Label with sources in parentheses
            const sourcesText = sourcesArray.length > 1 ? 'Sources' : 'Source';
            const sourceLinks = sourcesArray.map(s => `<a href="${s.url}" target="_blank" rel="noopener noreferrer" class="source-link">${s.name}</a>`).join(', ');
            labelHtml = `<h3 class="fullscreen-image-label">${label} <span class="image-sources-inline">(${sourcesText}: ${sourceLinks})</span></h3>`;
          } else if (label) {
            // Label only
            labelHtml = `<h3 class="fullscreen-image-label">${label}</h3>`;
          } else if (sourcesArray.length > 0) {
            // Sources only (no label)
            const sourcesText = sourcesArray.length > 1 ? 'Sources' : 'Source';
            const sourceLinks = sourcesArray.map(s => `<a href="${s.url}" target="_blank" rel="noopener noreferrer" class="source-link">${s.name}</a>`).join(', ');
            labelHtml = `<div class="image-sources">${sourcesText}: ${sourceLinks}</div>`;
          }

          return `<div class="fullscreen-image-wrapper-md">${labelHtml}<div class="fullscreen-image-wrapper"><div class="fullscreen-image-background" style="background-color: ${bg};"><div class="fullscreen-image-container" data-magnifier="${mag}"${sourcesAttr}><img src="${url}" alt="Fullscreen image" class="fullscreen-image-md" loading="lazy" /></div></div></div></div>`;
        }
      )
      // Clean up empty paragraphs and paragraphs around images
      .replace(/<p><\/p>/g, "")
      .replace(
        /<p>(<div class="fullscreen-image-wrapper-md".*?<\/div><\/div>)<\/p>/g,
        "$1"
      )
      .replace(
        /<p>(<div class="fullscreen-image-wrapper".*?<\/div>)<\/p>/g,
        "$1"
      )
      .replace(
        /<p>(<div class="fullscreen-parallax-wrapper".*?<\/div><\/div><\/div><\/div>)<\/p>/g,
        "$1"
      )
      // Clean up orphaned </p> and <p> around block elements
      .replace(/<\/p><p>(<div class="fullscreen-image-wrapper-md">)/g, "$1")
      .replace(/<\/p><p>(<div class="fullscreen-image-wrapper")/g, "$1")
      .replace(/<\/p><p>(<div class="fullscreen-parallax-wrapper">)/g, "$1")
      .replace(/(<\/div><\/div>)<\/p><p>/g, "$1")
      .replace(/(<\/div>)<\/p><p>/g, "$1")
      .replace(/(<\/div><\/div><\/div><\/div>)<\/p><p>/g, "$1")
      // Clean up orphaned tags at the start/end
      .replace(/^<\/p>/, "")
      .replace(/<p>$/g, "")
  );
}
</script>

<style scoped>
.case-background,
.case-challenge,
.case-scale,
.case-solution,
.case-process,
.case-results,
.case-design,
.case-audit,
.case-redesign,
.case-conclusion {
  width: 100%;
  padding: 80px 16px 48px;
  overflow-x: hidden;
  display: flex;
  justify-content: center;
}

.markdown-content {
  width: 100%;
  max-width: 1200px;
  color: inherit;
  --font-size-h1: clamp(32px, 6vw, 48px);
  --font-size-h2: clamp(24px, 4vw, 32px);
  --font-size-h3: clamp(20px, 3vw, 24px);
}

.markdown-content :deep(h1) {
  font-family: var(--case-title-font, var(--font-family-base));
  font-size: clamp(32px, 5vw, 48px);
  font-weight: var(--font-weight-semibold);
  margin-bottom: 24px;
  color: inherit;
}

.markdown-content :deep(h2) {
  font-family: var(--case-title-font, var(--font-family-base));
  font-size: clamp(24px, 4vw, 32px);
  font-weight: var(--font-weight-semibold);
  margin-top: 48px;
  margin-bottom: 24px;
  color: inherit;
}

.markdown-content :deep(h3) {
  font-family: var(--case-title-font, var(--font-family-base));
  font-size: clamp(18px, 3vw, 24px);
  font-weight: var(--font-weight-medium);
  margin-top: 32px;
  margin-bottom: 16px;
  color: inherit;
  opacity: 0.8;
}

.markdown-content :deep(p) {
  font-size: 16px;
  line-height: 1.8;
  margin-bottom: 24px;
  color: inherit;
  opacity: 0.8;
}

/* Группировка: абзац + fullscreen картинка */
.markdown-content :deep(p + .fullscreen-image-wrapper-md) {
  margin-top: -8px;
}

.markdown-content :deep(p + .fullscreen-image-wrapper) {
  margin-top: -8px;
}

/* Больший отступ между группами */
.markdown-content :deep(.fullscreen-image-wrapper-md + p) {
  margin-top: 64px;
}

.markdown-content :deep(.fullscreen-image-wrapper + p) {
  margin-top: 64px;
}

.markdown-content :deep(ul),
.markdown-content :deep(ol) {
  margin: 16px 0;
  padding-left: 24px;
}

.markdown-content :deep(li) {
  font-size: 16px;
  line-height: 1.8;
  margin-bottom: 8px;
  color: inherit;
  opacity: 0.8;
}

.markdown-content :deep(code) {
  background: rgba(0, 0, 0, 0.05);
  padding: 2px 8px;
  border-radius: 4px;
  font-family: "Monaco", "Courier New", monospace;
  font-size: 14px;
  color: inherit;
  opacity: 0.7;
}

.markdown-content :deep(pre) {
  background: rgba(0, 0, 0, 0.05);
  padding: 16px;
  border-radius: 8px;
  overflow-x: auto;
  margin: 24px 0;
}

.markdown-content :deep(pre code) {
  background: transparent;
  padding: 0;
  color: inherit;
  opacity: 0.8;
}

.markdown-content :deep(strong) {
  font-weight: 600;
  color: inherit;
}

.markdown-content :deep(em) {
  font-style: italic;
}

.markdown-content :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 24px 0;
}

.markdown-content :deep(th),
.markdown-content :deep(td) {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.markdown-content :deep(th) {
  font-weight: 600;
  color: inherit;
  background: rgba(0, 0, 0, 0.05);
}

.markdown-content :deep(td) {
  color: inherit;
  opacity: 0.8;
}

.markdown-content :deep(blockquote) {
  border-left: 4px solid rgba(0, 0, 0, 0.2);
  padding-left: 16px;
  margin: 24px 0;
  font-style: italic;
  color: inherit;
  opacity: 0.7;
}

.markdown-content :deep(hr) {
  border: none;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  margin: 48px 0;
}

/* Fullscreen images in markdown - outer wrapper for label */
.markdown-content :deep(.fullscreen-image-wrapper-md) {
  width: 100vw;
  position: relative;
  left: 50%;
  margin-left: -50vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 16px;
  box-sizing: border-box;
  margin-top: 48px;
  margin-bottom: 0;
}

.markdown-content :deep(.fullscreen-image-label) {
  width: 100%;
  max-width: 1200px;
  margin: 0 0 -8px 0;
  padding: 0;
  font-family: var(--font-family-base);
  font-weight: var(--font-weight-medium);
  font-size: 14px;
  line-height: 1.2;
  color: inherit;
  opacity: 0.5;
}

.markdown-content :deep(.image-sources) {
  width: 100%;
  max-width: 1200px;
  margin: 0 0 -8px 0;
  padding: 0;
  font-family: var(--font-family-base);
  font-weight: var(--font-weight-medium);
  font-size: 14px;
  line-height: 1.2;
  color: inherit;
  opacity: 0.5;
}

.markdown-content :deep(.image-sources-inline) {
  font-family: var(--font-family-base);
  font-weight: var(--font-weight-medium);
  font-size: 14px;
  line-height: 1.2;
  color: inherit;
  opacity: 1;
}

.markdown-content :deep(.source-link) {
  color: inherit;
  text-decoration: underline;
  transition: opacity 0.2s ease;
}

.markdown-content :deep(.source-link:hover) {
  opacity: 0.7;
}

/* Fullscreen images in markdown */
.markdown-content :deep(.fullscreen-image-wrapper) {
  width: 100%;
  padding: 16px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
}

.markdown-content :deep(.fullscreen-image-background) {
  width: 100%;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.markdown-content :deep(.fullscreen-image-container) {
  position: relative;
  width: 100%;
  overflow: hidden;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Parallax images in markdown - fullscreen positioning and spacing */
.markdown-content :deep(.fullscreen-parallax-wrapper) {
  width: 100vw;
  position: relative;
  left: 50%;
  margin-left: -50vw;
  margin-top: 48px;
  margin-bottom: 0;
}

.markdown-content :deep(.parallax-image-label) {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto -8px;
  padding: 0 16px;
  font-family: var(--font-family-base);
  font-weight: var(--font-weight-medium);
  font-size: 14px;
  line-height: 1.2;
  color: inherit;
  opacity: 0.5;
}

.markdown-content :deep(.fullscreen-parallax-image) {
  width: 100%;
  height: 100vh;
  padding: 16px;
  box-sizing: border-box;
}

.markdown-content :deep(.parallax-background-container) {
  width: 100%;
  height: 100%;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.markdown-content :deep(.parallax-image-container) {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.markdown-content :deep(.parallax-image) {
  width: 100%;
  height: 200%;
  min-height: 200%;
  max-width: none;
  max-height: none;
  object-fit: cover;
  object-position: top center;
  display: block;
  position: absolute;
  top: 0;
  left: 0;
}

/* Spacing for parallax images */
.markdown-content :deep(p + .fullscreen-parallax-wrapper) {
  margin-top: -8px;
}

.markdown-content :deep(.fullscreen-parallax-wrapper + p) {
  margin-top: 64px;
}

/* If wrapper ends up inside a paragraph, fix it */
.markdown-content :deep(p .fullscreen-image-wrapper) {
  margin-top: 0;
  margin-bottom: 0;
}

.markdown-content :deep(p .fullscreen-parallax-wrapper) {
  margin-top: 0;
  margin-bottom: 0;
}

.markdown-content :deep(p:has(.fullscreen-image-wrapper)) {
  margin: 0;
  padding: 0;
}

.markdown-content :deep(.fullscreen-image-md) {
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  object-fit: contain;
  display: block;
  margin: auto;
}

/* Magnifier styles for markdown images */
.markdown-content :deep(.magnifier-md) {
  position: absolute;
  border: 3px solid rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  pointer-events: none;
  z-index: 10;
  box-shadow:
    0 0 0 1px rgba(0, 0, 0, 0.1),
    0 8px 32px rgba(0, 0, 0, 0.2),
    inset 0 0 0 1px rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(0px);
  overflow: hidden;
  transition: opacity 0.15s ease;
  opacity: 0;
}

.markdown-content :deep(.magnifier-md__image) {
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  border-radius: 50%;
}

@media (max-width: 768px) {
  .case-background,
  .case-challenge,
  .case-scale,
  .case-solution,
  .case-process,
  .case-results,
  .case-design,
  .case-audit,
  .case-redesign,
  .case-conclusion {
    padding: 60px 16px 24px;
  }

  .markdown-content {
    --font-size-h1: 36px;
    --font-size-h2: 28px;
    --font-size-h3: 20px;
  }

  .markdown-content :deep(h1) {
    margin-bottom: 16px;
  }
}
</style>
