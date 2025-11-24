<template>
  <div v-if="content" class="text-block" v-html="renderedContent"></div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ content?: string }>()

const renderedContent = computed(() => {
  if (!props.content) return ''
  let html = props.content
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/__(.+?)__/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>').replace(/_(.+?)_/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    .replace(/^\s*[-*+]\s+(.+)$/gm, '<li>$1</li>').replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
    .replace(/^\s*\d+\.\s+(.+)$/gm, '<li>$1</li>')
  if (html.includes('<li>') && !html.includes('<ul>')) html = html.replace(/(<li>.*<\/li>)/s, '<ol>$1</ol>')
  return html.split(/\n\n+/).map(p => {
    p = p.trim()
    return p.startsWith('<') && p.endsWith('>') ? p : p ? `<p>${p.replace(/\n/g, '<br>')}</p>` : ''
  }).join('')
})
</script>

<style scoped>
.text-block { width: 100%; max-width: 1200px; color: inherit; }
.text-block :deep(p), .text-block :deep(li) {
  font-size: 16px; line-height: 1.8; color: inherit; opacity: 0.8;
}
.text-block :deep(p) { margin-bottom: 24px; }
.text-block :deep(p:last-child), .text-block :deep(li:last-child) { margin-bottom: 0; }
.text-block :deep(li) { margin-bottom: 8px; }
.text-block :deep(strong) { font-weight: 600; color: inherit; }
.text-block :deep(em) { font-style: italic; }
.text-block :deep(code) {
  background: rgba(0, 0, 0, 0.05); padding: 2px 8px; border-radius: 4px;
  font-family: 'Monaco', 'Courier New', monospace; font-size: 14px; color: inherit; opacity: 0.7;
}
.text-block :deep(a) { color: inherit; text-decoration: underline; }
.text-block :deep(a:hover) { opacity: 0.7; }
.text-block :deep(ul), .text-block :deep(ol) { margin: 16px 0; padding-left: 24px; }
</style>
