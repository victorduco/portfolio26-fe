<template>
  <section class="case-section">
    <!-- Heading -->
    <div v-if="heading" class="section-heading">
      <h4 v-if="!heading.subtitle" class="case-section-heading-single">
        {{ heading.main }}
      </h4>
      <div v-else class="case-section-heading-two-level">
        <div class="case-section-heading-subtitle">{{ heading.subtitle }}</div>
        <h4 class="case-section-heading-main">{{ heading.main }}</h4>
      </div>
    </div>

    <!-- Text before media -->
    <TextBlock v-if="textBefore" :content="textBefore" class="text-before" />

    <!-- Media component -->
    <component
      v-if="media"
      :is="getMediaComponent(media.type)"
      v-bind="{ backgroundColor, ...media.props }"
    />

    <!-- Text after media -->
    <TextBlock v-if="textAfter" :content="textAfter" class="text-after" />
  </section>
</template>

<script setup lang="ts">
import type { Component } from 'vue'
import TextBlock from '../elements/TextBlock.vue'
import FullscreenImg from '../media/FullscreenImg.vue'
import FullscreenVideo from '../media/FullscreenVideo.vue'
import ParallaxImg from '../media/ParallaxImg.vue'
import HorizontalParallaxImg from '../media/HorizontalParallaxImg.vue'
import ChapteredVideo from '../media/ChapteredVideo.vue'
import LayeredImg from '../media/LayeredImg.vue'

interface Heading {
  main: string
  subtitle?: string
}

interface Media {
  type: 'image' | 'video' | 'parallax' | 'horizontalParallax' | 'chaptered-video' | 'layered-cards'
  props: Record<string, any>
}

interface Props {
  heading?: Heading
  textBefore?: string
  media?: Media
  textAfter?: string
  backgroundColor?: string
}

defineProps<Props>()

const mediaComponents: Record<string, Component> = {
  'image': FullscreenImg,
  'video': FullscreenVideo,
  'parallax': ParallaxImg,
  'horizontalParallax': HorizontalParallaxImg,
  'chaptered-video': ChapteredVideo,
  'layered-cards': LayeredImg,
}

function getMediaComponent(type: string): Component {
  return mediaComponents[type] || FullscreenImg
}
</script>

<style scoped>
.case-section {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.section-heading {
  margin-top: 32px;
  margin-bottom: 16px;
  width: 100%;
  max-width: 1200px;
}

.text-before {
  margin-bottom: -8px;
  width: 100%;
  max-width: 1200px;
}

.text-after {
  margin-top: 64px;
  width: 100%;
  max-width: 1200px;
}

/* Mobile: Add horizontal padding for text content */
@media (max-width: 767px) {
  .section-heading {
    padding: 0 24px;
  }

  .text-before {
    padding: 0 24px;
  }

  .text-after {
    padding: 0 24px;
  }
}
</style>
