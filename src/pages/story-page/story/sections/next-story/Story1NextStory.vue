<template>
  <div class="story1-next-story">
    <div class="text-container">
      <p class="company-text">Apple</p>
      <h2 class="main-text">Transforming Account Reconciliation with AI-Driven User Experience</h2>
      <div class="tags-container">
        <span class="tag">Global User Research</span>
        <span class="tag-separator">•</span>
        <span class="tag">Concept-to-Launch Design</span>
        <span class="tag-separator">•</span>
        <span class="tag">Cross-Domain UX Alignment</span>
      </div>
    </div>
    <a href="/story/one" class="line-element" @click.prevent="$router.push('/story/one')">
      <span class="open-story-text">Open Story</span>
    </a>
  </div>
</template>

<style scoped>
.story1-next-story { --font: 'Noto Sans', sans-serif; position: relative; width: 100%; height: 100vh; display: flex; align-items: center; justify-content: center; background-color: #f5f5f5; }

.text-container { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -210px); text-align: center; z-index: 1; width: 90vw; max-width: 1200px; }
.company-text { margin: 0 0 12px; font: 700 clamp(16px, 2vw, 28px)/1.4 var(--font); color: #007aff; }
.main-text { margin: 0; font: 600 clamp(24px, 2.2vw, 48px)/1.2 var(--font); color: #000; }
.tags-container { margin: 16px 0 0; display: flex; gap: 4px; justify-content: center; align-items: center; }
.tag, .tag-separator { font: 500 18px/1.4 var(--font); color: #666; }
.tag-separator { opacity: 0.5; }

.line-element { position: absolute; top: 50%; left: 50%; transform: translate(-50%, calc(-50% + 105px)); display: flex; align-items: center; justify-content: center; width: 280px; height: 60px; border: 4px solid #007aff; border-radius: 30px; cursor: pointer; text-decoration: none; z-index: 3; background: transparent; transition: background-color 0.2s, border-color 0.2s; }
.line-element:hover { background-color: rgba(255, 255, 255, 0.8); border-color: rgba(0, 122, 255, 0.8); }
.line-element:hover .open-story-text { color: rgba(0, 122, 255, 0.8); }
.open-story-text { font: 700 20px/1.4 var(--font); color: #007aff; white-space: nowrap; }

@media (max-width: 767px) {
  .text-container { transform: translate(-50%, -200px); width: 100%; max-width: 100%; padding: 0 clamp(16px, 4vw, 32px); box-sizing: border-box; }
  .company-text, .main-text { text-align: center; width: 100%; }
  .tags-container { flex-direction: column; gap: 8px; align-items: stretch; width: 100%; }
  .tag { width: 100%; text-align: center; }
  .tag-separator { display: none; }
}
</style>
