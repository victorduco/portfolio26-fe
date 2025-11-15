<template>
  <section class="case-section">
    <!-- Heading -->
    <div v-if="heading" class="section-heading">
      <h3 v-if="!heading.subtitle" class="case-section-heading-single">
        {{ heading.main }}
      </h3>
      <div v-else class="case-section-heading-two-level">
        <div class="case-section-heading-subtitle">{{ heading.subtitle }}</div>
        <h3 class="case-section-heading-main">{{ heading.main }}</h3>
      </div>
    </div>

    <!-- Text before media -->
    <TextBlock v-if="textBefore" :content="textBefore" class="text-before" />

    <!-- Media component -->
    <component
      v-if="media"
      :is="getMediaComponent(media.type)"
      v-bind="{ ...media.props, backgroundColor }"
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
import ChapteredVideo from '../media/ChapteredVideo.vue'
import LayeredImg from '../media/LayeredImg.vue'

interface Heading {
  main: string
  subtitle?: string
}

interface Media {
  type: 'image' | 'video' | 'parallax' | 'chaptered-video' | 'layered-cards'
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
  padding: 0 16px;
}

.text-before {
  margin-bottom: -8px;
  width: 100%;
  max-width: 1200px;
  padding: 0 16px;
}

.text-after {
  margin-top: 64px;
  width: 100%;
  max-width: 1200px;
  padding: 0 16px;
}
</style>
