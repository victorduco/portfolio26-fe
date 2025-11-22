<template>
  <div class="case1-next-project">
    <!-- Text Container (positioned above) -->
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

    <!-- Button (positioned below) -->
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
.case1-next-project {
  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #1a1a1a;
}

/* Text Container (positioned above center) */
.text-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, calc(-50% - 105px));
  text-align: center;
  width: 90vw;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  align-items: center;
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
  display: block;
  box-sizing: border-box;
}

.main-text {
  margin: 0;
  font-family: 'Noto Sans', sans-serif;
  font-weight: 600;
  font-size: clamp(24px, 2.2vw, 48px);
  line-height: 1.2;
  color: #ffffff;
  text-align: center;
  width: 100%;
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
  color: #999999;
}

.tag-separator {
  font-family: 'Noto Sans', sans-serif;
  font-size: 18px;
  line-height: 1.4;
  color: #999999;
  opacity: 0.5;
}

/* Button (positioned below center) */
.line-element {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, calc(50% + 45px));
  display: flex;
  align-items: center;
  justify-content: center;
  width: 280px;
  height: 60px;
  border: 4px solid #007aff;
  border-radius: 30px;
  background-color: #1a1a1a;
  cursor: pointer;
  text-decoration: none;
  box-sizing: border-box;
  transition: background-color 0.2s ease, border-color 0.2s ease;
}

.line-element:hover {
  background-color: rgba(26, 26, 26, 0.8);
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
    transform: translate(-50%, calc(-50% - 100px));
    width: calc(100vw - 48px);
    max-width: calc(100vw - 48px);
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
    transform: translate(-50%, calc(50% + 40px));
    width: calc(100vw - 48px);
  }
}
</style>
