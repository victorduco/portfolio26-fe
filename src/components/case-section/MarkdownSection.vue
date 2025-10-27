<template>
  <section :class="`case-${sectionType}`">
    <div class="markdown-content" v-html="markdownContent"></div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps({
  caseId: {
    type: String,
    required: true,
  },
  sectionType: {
    type: String,
    required: true,
    validator: (value) => ['task', 'process', 'results'].includes(value),
  },
  caseConfig: {
    type: Object,
    default: () => ({}),
  },
});

const markdownContent = ref('');

onMounted(async () => {
  try {
    const response = await fetch(`/docs/cases/case${props.caseId}-${props.sectionType}.md`);
    const markdown = await response.text();
    markdownContent.value = renderMarkdown(markdown);
  } catch (error) {
    console.error(`Error loading ${props.sectionType} content:`, error);
    markdownContent.value = '<p>Error loading content</p>';
  }
});

function renderMarkdown(md) {
  return md
    // Fullscreen images: ![fullscreen](url) - use unique placeholder
    .replace(/!\[fullscreen\]\((.*?)\)/gim, '___FULLSCREEN_IMAGE___$1___END___')
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    .replace(/```(\w+)?\n([\s\S]*?)```/gim, '<pre><code>$2</code></pre>')
    .replace(/`([^`]+)`/gim, '<code>$1</code>')
    .replace(/\|(.+)\|/g, (match) => {
      const cells = match.split('|').filter(c => c.trim());
      const isHeader = cells.some(c => c.includes('---'));
      if (isHeader) return '';
      const tag = cells[0].match(/^\s*[A-Z]/) ? 'th' : 'td';
      return '<tr>' + cells.map(c => `<${tag}>${c.trim()}</${tag}>`).join('') + '</tr>';
    })
    .replace(/(<tr>.*<\/tr>)+/s, '<table>$&</table>')
    .replace(/^> (.+)$/gim, '<blockquote>$1</blockquote>')
    .replace(/^\- (.*$)/gim, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
    .replace(/^\d+\. (.*$)/gim, '<li>$1</li>')
    .replace(/---$/gm, '<hr>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(?!<[hult]|<pre|<blockquote|<hr|___)/gm, '<p>')
    .replace(/(?![hult]>|pre>|blockquote>|hr>|___)$/gm, '</p>')
    // Replace placeholder with actual image after paragraph processing
    .replace(/___FULLSCREEN_IMAGE___(.*?)___END___/gim, '<div class="fullscreen-image-wrapper"><img src="$1" alt="Fullscreen image" class="fullscreen-image-md" loading="lazy" /></div>')
    // Clean up empty paragraphs and paragraphs around images
    .replace(/<p><\/p>/g, '')
    .replace(/<p>(<div class="fullscreen-image-wrapper">.*?<\/div>)<\/p>/g, '$1')
    // Clean up orphaned </p> and <p> around block elements
    .replace(/<\/p><p>(<div class="fullscreen-image-wrapper">)/g, '$1')
    .replace(/(<\/div>)<\/p><p>/g, '$1')
    // Clean up orphaned tags at the start/end
    .replace(/^<\/p>/, '')
    .replace(/<p>$/g, '');
}
</script>

<style scoped>
.case-task,
.case-process,
.case-results {
  width: 100%;
  min-height: 100vh;
  padding: 80px 48px 48px;
  overflow-x: hidden;
}

.markdown-content {
  max-width: 900px;
  margin: 0 auto;
  color: inherit;
  --font-size-h1: clamp(32px, 6vw, 48px);
  --font-size-h2: clamp(24px, 4vw, 32px);
  --font-size-h3: clamp(20px, 3vw, 24px);
}

.markdown-content :deep(h1) {
  margin-bottom: 32px;
  color: inherit;
}

.markdown-content :deep(h2) {
  margin-top: 48px;
  margin-bottom: 24px;
  color: inherit;
}

.markdown-content :deep(h3) {
  margin-top: 32px;
  margin-bottom: 16px;
  color: inherit;
  opacity: 0.8;
}

.markdown-content :deep(p) {
  font-size: 16px;
  line-height: 1.8;
  margin-bottom: 16px;
  color: inherit;
  opacity: 0.8;
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
  font-family: 'Monaco', 'Courier New', monospace;
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

/* Fullscreen images in markdown */
.markdown-content :deep(.fullscreen-image-wrapper) {
  width: 100vw;
  height: 100vh;
  position: relative;
  left: 50%;
  margin-left: -50vw;
  padding: 16px;
  box-sizing: border-box;
  margin-top: 48px;
  margin-bottom: 48px;
  display: block;
}

/* If wrapper ends up inside a paragraph, fix it */
.markdown-content :deep(p .fullscreen-image-wrapper) {
  margin-top: 0;
  margin-bottom: 0;
}

.markdown-content :deep(p:has(.fullscreen-image-wrapper)) {
  margin: 0;
  padding: 0;
}

.markdown-content :deep(.fullscreen-image-md) {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12px;
  display: block;
}

@media (max-width: 768px) {
  .case-task,
  .case-process,
  .case-results {
    padding: 60px 24px 24px;
  }

  .markdown-content {
    --font-size-h1: 36px;
    --font-size-h2: 28px;
    --font-size-h3: 20px;
  }
}
</style>
