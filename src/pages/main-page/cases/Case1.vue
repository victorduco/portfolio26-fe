<template>
  <div class="case1">
    <video
      class="case-video"
      src="@/assets/case-videos/case1.mp4"
      autoplay
      loop
      muted
      playsinline
    ></video>
    <RouterLink to="/case1" class="case-link" style="display: none">
      <h2>Case 1</h2>
      <p>View Details →</p>
    </RouterLink>
  </div>
</template>

<script setup>
import { RouterLink } from "vue-router";
</script>

<style scoped>
.case1 {
  width: 100vw;
  height: 100vh;
  background: #0d1117;
  display: flex;
  align-items: center;
  justify-content: center;
}

.case-video {
  width: 80vw;
  height: auto;
  border-radius: 16px;
  object-fit: contain;
}

.case-link {
  text-decoration: none;
  color: white;
  padding: 40px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  transition: all 0.3s ease;
  text-align: center;
}

.case-link:hover {
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-4px);
}

.case-link h2 {
  margin: 0 0 16px 0;
  font-size: 48px;
}

.case-link p {
  margin: 0;
  font-size: 18px;
  opacity: 0.7;
}
</style>
