<template>
  <div class="case2">
    <RouterLink to="/case2" class="case-link">
      <h2>Case 2</h2>
      <p>View Details →</p>
    </RouterLink>
  </div>
</template>

<script setup>
import { RouterLink } from "vue-router";
</script>

<style scoped>
.case2 {
  width: 100vw;
  height: 100vh;
  background: #1a1a2e;
  display: flex;
  align-items: center;
  justify-content: center;
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
