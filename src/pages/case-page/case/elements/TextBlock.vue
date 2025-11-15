<template>
  <div v-if="content" class="text-block" v-html="renderedContent"></div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  content?: string
}

const props = defineProps<Props>()

const renderedContent = computed(() => {
  if (!props.content) return ''

  let html = props.content

  // Convert bold **text** or __text__
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/__(.+?)__/g, '<strong>$1</strong>')

  // Convert italic *text* or _text_
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>')
  html = html.replace(/_(.+?)_/g, '<em>$1</em>')

  // Convert inline code `code`
  html = html.replace(/`(.+?)`/g, '<code>$1</code>')

  // Convert links [text](url)
  html = html.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')

  // Convert unordered lists
  html = html.replace(/^\s*[-*+]\s+(.+)$/gm, '<li>$1</li>')
  html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')

  // Convert ordered lists
  html = html.replace(/^\s*\d+\.\s+(.+)$/gm, '<li>$1</li>')
  if (html.includes('<li>') && !html.includes('<ul>')) {
    html = html.replace(/(<li>.*<\/li>)/s, '<ol>$1</ol>')
  }

  // Convert paragraphs (split by double newlines)
  const paragraphs = html.split(/\n\n+/)
  html = paragraphs
    .map(p => {
      p = p.trim()
      // Don't wrap if already wrapped in HTML tags
      if (p.startsWith('<') && p.endsWith('>')) {
        return p
      }
      return p ? `<p>${p.replace(/\n/g, '<br>')}</p>` : ''
    })
    .join('')

  return html
})
</script>

<style scoped>
.text-block {
  width: 100%;
  max-width: 1200px;
  color: inherit;
}

.text-block :deep(p) {
  font-size: 16px;
  line-height: 1.8;
  margin-bottom: 24px;
  color: inherit;
  opacity: 0.8;
}

.text-block :deep(p:last-child) {
  margin-bottom: 0;
}

.text-block :deep(strong) {
  font-weight: 600;
  color: inherit;
}

.text-block :deep(em) {
  font-style: italic;
}

.text-block :deep(code) {
  background: rgba(0, 0, 0, 0.05);
  padding: 2px 8px;
  border-radius: 4px;
  font-family: 'Monaco', 'Courier New', monospace;
  font-size: 14px;
  color: inherit;
  opacity: 0.7;
}

.text-block :deep(a) {
  color: inherit;
  text-decoration: underline;
}

.text-block :deep(a:hover) {
  opacity: 0.7;
}

.text-block :deep(ul),
.text-block :deep(ol) {
  margin: 16px 0;
  padding-left: 24px;
}

.text-block :deep(li) {
  font-size: 16px;
  line-height: 1.8;
  margin-bottom: 8px;
  color: inherit;
  opacity: 0.8;
}

.text-block :deep(li:last-child) {
  margin-bottom: 0;
}
</style>
