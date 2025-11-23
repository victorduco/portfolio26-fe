<template>
  <section class="story-section">
    <!-- Heading -->
    <div v-if="heading" class="section-heading">
      <h4 v-if="!heading.subtitle" class="story-section-heading-single">
        {{ heading.main }}
      </h4>
      <div v-else class="story-section-heading-two-level">
        <div class="story-section-heading-subtitle">{{ heading.subtitle }}</div>
        <h4 class="story-section-heading-main">{{ heading.main }}</h4>
      </div>
    </div>

    <!-- Text before media -->
    <TextBlock v-if="textBefore" :content="textBefore" class="text-before" />

    <!-- Media component wrapped in MediaContainer -->
    <MediaContainer
      v-if="media"
      :type="getMediaContainerType(media.type)"
      :background-color="backgroundColor || media.props.backgroundColor || 'transparent'"
      :label="getMediaLabel(media.props)"
      :sources="media.props.sources || []"
      :overflow="getMediaOverflow(media.type)"
      :wrapper-class="getWrapperClass(media.type)"
      :container-class="getContainerClass(media.type)"
    >
      <component
        :is="getMediaComponent(media.type)"
        v-bind="getMediaProps(media.props)"
      />
    </MediaContainer>

    <!-- Text after media -->
    <TextBlock v-if="textAfter" :content="textAfter" class="text-after" />
  </section>
</template>

<script setup lang="ts">
import type { Component } from 'vue'
import TextBlock from '../elements/TextBlock.vue'
import MediaContainer from '../media/MediaContainer.vue'
import FullscreenImg from '../media/FullscreenImg.vue'
import FullscreenVideo from '../media/FullscreenVideo.vue'
import ParallaxImg from '../media/ParallaxImg.vue'
import HorizontalParallaxImg from '../media/HorizontalParallaxImg.vue'
import ChapteredVideo from '../media/ChapteredVideo.vue'
import TabbedVideo from '../media/TabbedVideo.vue'
import LayeredImg from '../media/LayeredImg.vue'
import { resolveMediaPath } from '@/utils/mediaResolver.js'

interface Heading {
  main: string
  subtitle?: string
}

interface Media {
  type: 'image' | 'video' | 'parallax' | 'horizontalParallax' | 'chaptered-video' | 'tabbed-video' | 'layered-cards'
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
  'tabbed-video': TabbedVideo,
  'layered-cards': LayeredImg,
}

function getMediaComponent(type: string): Component {
  return mediaComponents[type] || FullscreenImg
}

// Extract label from props
function getMediaLabel(props: Record<string, any>): string {
  return props.mediaLabel || ''
}

// Get MediaContainer type based on media type
function getMediaContainerType(mediaType: string): 'fullheight' | 'fullwidth' {
  if (mediaType === 'layered-cards') {
    return 'fullwidth'
  }
  return 'fullheight'
}

// Get overflow setting based on media type
function getMediaOverflow(mediaType: string): 'hidden' | 'visible' {
  if (mediaType === 'layered-cards') {
    return 'visible'
  }
  return 'hidden'
}

// Get wrapper class based on media type
function getWrapperClass(mediaType: string): string {
  const classMap: Record<string, string> = {
    'image': 'fullscreen-image-wrapper',
    'video': 'fullscreen-video-wrapper',
    'parallax': 'parallax-wrapper',
    'horizontalParallax': 'horizontal-parallax-wrapper',
    'chaptered-video': 'chaptered-video-wrapper',
    'tabbed-video': 'tabbed-video-wrapper',
    'layered-cards': 'layered-cards-wrapper',
  }
  return classMap[mediaType] || ''
}

// Get container class based on media type
function getContainerClass(mediaType: string): string {
  const classMap: Record<string, string> = {
    'layered-cards': 'layered-cards',
  }
  return classMap[mediaType] || ''
}

// Remove label-related props and resolve media paths before passing to media component
function getMediaProps(props: Record<string, any>): Record<string, any> {
  const { mediaLabel, backgroundColor, sources, ...rest } = props

  // Resolve all media paths in props
  const resolved: Record<string, any> = {}
  for (const [key, value] of Object.entries(rest)) {
    if (typeof value === 'string' && (value.startsWith('/images/') || value.startsWith('/videos/'))) {
      resolved[key] = resolveMediaPath(value)
    } else if (key === 'tabs' && Array.isArray(value)) {
      // Handle tabs array for tabbed-video component
      resolved[key] = value.map((tab: Record<string, any>) => ({
        ...tab,
        videoSrc: tab.videoSrc ? resolveMediaPath(tab.videoSrc) : tab.videoSrc,
      }))
    } else {
      resolved[key] = value
    }
  }

  return resolved
}
</script>

<style scoped>
.story-section {
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
  box-sizing: border-box;
}

.text-before {
  margin-bottom: -8px;
  width: 100%;
  max-width: 1200px;
  padding: 0 16px;
  box-sizing: border-box;
}

.text-after {
  margin-top: 0;
  margin-bottom: 0;
  width: 100%;
  max-width: 1200px;
  padding: 0 16px;
  box-sizing: border-box;
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
