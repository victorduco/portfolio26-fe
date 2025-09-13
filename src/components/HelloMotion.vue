<template>
  <div>
    <h1 ref="motionEl">Hello World с Motion One и Vue!</h1>
    <button @click="animate">Animate</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { animate } from 'motion'

const motionEl = ref(null)

function animate() {
  if (motionEl.value) {
    animate(motionEl.value, { scale: [1, 1.5, 1], rotate: [0, 360, 0] }, { duration: 1.2 })
  }
}
</script>

<style scoped>
h1 {
  transition: color 0.3s;
  color: #42b983;
}
button {
  margin-top: 16px;
  padding: 8px 16px;
  font-size: 1rem;
}
</style>
