<template>
  <div ref="containerRef" class="w-full h-screen bg-image"></div>
  <IntroText>
    <template #rectangles>
      <IntroRectangles />
    </template>
  </IntroText>
</template>

<script setup>
import IntroText from "./IntroText.vue";
import IntroRectangles from "./IntroRectangles.vue";
</script>

