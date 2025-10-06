<template>
  <div class="case3">
    <RouterLink to="/case3" class="case-link">
      <h2>Case 3</h2>
      <p>View Details →</p>
    </RouterLink>
  </div>
</template>

<script setup>
import { RouterLink } from "vue-router";
</script>

<style scoped>
.case3 {
  width: 100vw;
  height: 100vh;
  background: #171717;
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
