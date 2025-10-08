<template>
  <section class="case3-process">
    <div class="markdown-content" v-html="markdownContent"></div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const markdownContent = ref('');

onMounted(async () => {
  try {
    const response = await fetch('/docs/cases/case3-process.md');
    const markdown = await response.text();
    markdownContent.value = renderMarkdown(markdown);
  } catch (error) {
    markdownContent.value = '<p>Error loading content</p>';
  }
});

function renderMarkdown(md) {
  return md
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    .replace(/```(\w+)?\n([\s\S]*?)```/gim, '<pre><code>$2</code></pre>')
    .replace(/`([^`]+)`/gim, '<code>$1</code>')
    .replace(/^\- (.*$)/gim, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
    .replace(/^\d+\. (.*$)/gim, '<li>$1</li>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(?!<[hul]|<pre)/gm, '<p>')
    .replace(/(?![hul]>|pre>)$/gm, '</p>');
}
</script>

<style scoped>
.case3-process {
  width: 100vw;
  min-height: 100vh;
  background: #171717;
  padding: 80px 48px 48px;
}

.markdown-content {
  max-width: 900px;
  margin: 0 auto;
  color: #ffffff;
}

.markdown-content :deep(h1) {
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 32px;
  color: #ffffff;
}

.markdown-content :deep(h2) {
  font-size: 32px;
  font-weight: 600;
  margin-top: 48px;
  margin-bottom: 24px;
  color: #ffffff;
}

.markdown-content :deep(h3) {
  font-size: 24px;
  font-weight: 600;
  margin-top: 32px;
  margin-bottom: 16px;
  color: #e5e5e5;
}

.markdown-content :deep(p) {
  font-size: 16px;
  line-height: 1.8;
  margin-bottom: 16px;
  color: #e5e5e5;
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
  color: #e5e5e5;
}

.markdown-content :deep(code) {
  background: #262626;
  padding: 2px 8px;
  border-radius: 4px;
  font-family: 'Monaco', 'Courier New', monospace;
  font-size: 14px;
  color: #a3a3a3;
}

.markdown-content :deep(pre) {
  background: #262626;
  padding: 16px;
  border-radius: 8px;
  overflow-x: auto;
  margin: 24px 0;
}

.markdown-content :deep(pre code) {
  background: transparent;
  padding: 0;
  color: #e5e5e5;
}

.markdown-content :deep(strong) {
  font-weight: 600;
  color: #ffffff;
}

.markdown-content :deep(em) {
  font-style: italic;
}

@media (max-width: 768px) {
  .case3-process {
    padding: 60px 24px 24px;
  }

  .markdown-content :deep(h1) {
    font-size: 36px;
  }

  .markdown-content :deep(h2) {
    font-size: 28px;
  }

  .markdown-content :deep(h3) {
    font-size: 20px;
  }
}
</style>
