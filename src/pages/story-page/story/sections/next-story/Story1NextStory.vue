<template>
  <div class="story1-next-story">
    <!-- Text Container -->
    <div class="text-container">
      <p class="company-text">Apple</p>
      <h2 class="main-text">
        Transforming Account Reconciliation with AI-Driven User Experience
      </h2>
      <div class="tags-container">
        <span class="tag">Global User Research</span>
        <span class="tag-separator">•</span>
        <span class="tag">Concept-to-Launch Design</span>
        <span class="tag-separator">•</span>
        <span class="tag">Cross-Domain UX Alignment</span>
      </div>
    </div>

    <!-- Button -->
    <a href="/story/one" class="line-element" @click.prevent="handleClick">
      <span class="open-story-text">Open Story</span>
    </a>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const handleClick = (event) => {
  event.preventDefault();
  router.push("/story/one");
};
</script>

<style scoped>
.story1-next-story {
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
}

/* Text Container - positioned at final animation state */
.text-container {
  position: absolute;
  top: 50%;
  left: 50%;
  /* Final state: translate(-50%, 0) + y: -210px */
  transform: translate(-50%, -210px);
  text-align: center;
  z-index: 1;
  width: 90vw;
  max-width: 1200px;
}

.company-text {
  margin: 0 0 12px 0;
  font-family: 'Noto Sans', sans-serif;
  font-weight: 700;
  font-size: clamp(16px, 2vw, 28px);
  line-height: 1.4;
  color: #007aff;
  text-align: center;
  width: 100%;
  max-width: none;
}

.main-text {
  margin: 0;
  font-family: 'Noto Sans', sans-serif;
  font-weight: 600;
  font-size: clamp(24px, 2.2vw, 48px);
  line-height: 1.2;
  color: #000000;
}

.tags-container {
  margin: 16px 0 0 0;
  display: flex;
  gap: 4px;
  justify-content: center;
  align-items: center;
}

.tag {
  font-family: 'Noto Sans', sans-serif;
  font-weight: 500;
  font-size: 18px;
  line-height: 1.4;
  color: #666666;
}

.tag-separator {
  font-family: 'Noto Sans', sans-serif;
  font-size: 18px;
  line-height: 1.4;
  color: #666666;
  opacity: 0.5;
}

/* Button - final animation state */
.line-element {
  position: absolute;
  top: 50%;
  left: 50%;
  /* Final state: translate(-50%, -50%) + y: 105px */
  transform: translate(-50%, calc(-50% + 105px));
  display: flex;
  align-items: center;
  justify-content: center;
  width: 280px;
  height: 60px;
  border: 4px solid #007aff;
  border-radius: 30px;
  overflow: hidden;
  cursor: pointer;
  text-decoration: none;
  box-sizing: border-box;
  z-index: 3;
  background-color: transparent;
  transition: background-color 0.2s ease, border-color 0.2s ease;
}

.line-element:hover {
  background-color: rgba(255, 255, 255, 0.8);
  border-color: rgba(0, 122, 255, 0.8);
}

.line-element:hover .open-story-text {
  color: rgba(0, 122, 255, 0.8);
}

.open-story-text {
  font-family: 'Noto Sans', sans-serif;
  font-weight: 700;
  font-size: 20px;
  line-height: 1.4;
  color: #007aff;
  white-space: nowrap;
}

/* Mobile styles */
@media (max-width: 767px) {
  .text-container {
    /* Final state on mobile: translate(-50%, 0) + y: -200px */
    transform: translate(-50%, -200px);
    width: 100%;
    max-width: 100%;
    padding-left: clamp(16px, 4vw, 32px);
    padding-right: clamp(16px, 4vw, 32px);
    box-sizing: border-box;
  }

  .company-text {
    text-align: center;
  }

  .main-text {
    width: 100%;
    text-align: center;
  }

  .tags-container {
    flex-direction: column;
    gap: 8px;
    align-items: stretch;
    justify-content: center;
    width: 100%;
  }

  .tag {
    width: 100%;
    text-align: center;
  }

  .tag-separator {
    display: none;
  }

  .line-element {
    /* Final state on mobile: translate(-50%, -50%) + y: 100px */
    transform: translate(-50%, calc(-50% + 100px));
    width: calc(100vw - 48px);
    border-radius: 0px;
  }
}
</style>
