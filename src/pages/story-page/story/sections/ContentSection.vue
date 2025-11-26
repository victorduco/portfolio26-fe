<template>
  <section class="story-section">
    <div v-if="heading" class="section-heading content-block">
      <h4 v-if="!heading.sectionTag" class="story-section-heading-single">{{ heading.main }}</h4>
      <div v-else class="story-section-heading-two-level">
        <div class="story-section-heading-subtitle">{{ heading.sectionTag }}</div>
        <h4 class="story-section-heading-main">{{ heading.main }}</h4>
      </div>
    </div>
    <TextBlock v-if="textBefore" :content="textBefore" class="text-before content-block" />
    <MediaContainer v-if="media" :type="cfg.type" :background-color="backgroundColor || media.props.backgroundColor || 'transparent'"
      :label="media.props.mediaLabel || ''" :sources="media.props.sources || []" :overflow="cfg.overflow"
      :wrapper-class="cfg.wrapper" :container-class="cfg.container">
      <component :is="mediaComponents[media.type] || FullscreenImg" v-bind="getMediaProps(media.props, backgroundColor)" />
    </MediaContainer>
    <TextBlock v-if="textAfter" :content="textAfter" class="text-after content-block" />
  </section>
</template>

<script setup lang="ts">
import type { Component } from 'vue'
import { computed } from 'vue'
import TextBlock from '../elements/TextBlock.vue'
import MediaContainer from '../media/MediaContainer.vue'
import FullscreenImg from '../media/FullscreenImg.vue'
import FullscreenVideo from '../media/FullscreenVideo.vue'
import ParallaxImg from '../media/ParallaxImg.vue'
import HorizontalParallaxImg from '../media/HorizontalParallaxImg.vue'
import ChapteredVideo from '../media/ChapteredVideo.vue'
import TabbedVideo from '../media/TabbedVideo.vue'
import TabbedImg from '../media/TabbedImg.vue'
import LayeredImg from '../media/LayeredImg.vue'
import { resolveMediaPath } from '@/utils/mediaResolver.js'

interface Props { heading?: { main: string; sectionTag?: string }; textBefore?: string; media?: { type: string; props: Record<string, any> }; textAfter?: string; backgroundColor?: string }
const props = defineProps<Props>()

const mediaComponents: Record<string, Component> = { image: FullscreenImg, video: FullscreenVideo, parallax: ParallaxImg, horizontalParallax: HorizontalParallaxImg, 'chaptered-video': ChapteredVideo, 'tabbed-video': TabbedVideo, 'tabbed-img': TabbedImg, 'layered-cards': LayeredImg }

const mediaConfig: Record<string, { type: 'fullheight' | 'fullwidth'; overflow: 'hidden' | 'visible'; wrapper: string; container: string }> = {
  image: { type: 'fullheight', overflow: 'hidden', wrapper: 'fullscreen-image-wrapper', container: '' },
  video: { type: 'fullheight', overflow: 'hidden', wrapper: 'fullscreen-video-wrapper', container: '' },
  parallax: { type: 'fullheight', overflow: 'hidden', wrapper: 'parallax-wrapper', container: '' },
  horizontalParallax: { type: 'fullheight', overflow: 'hidden', wrapper: 'horizontal-parallax-wrapper', container: '' },
  'chaptered-video': { type: 'fullheight', overflow: 'hidden', wrapper: 'chaptered-video-wrapper', container: '' },
  'tabbed-video': { type: 'fullheight', overflow: 'hidden', wrapper: 'tabbed-video-wrapper', container: '' },
  'tabbed-img': { type: 'fullheight', overflow: 'hidden', wrapper: 'tabbed-img-wrapper', container: '' },
  'layered-cards': { type: 'fullwidth', overflow: 'visible', wrapper: 'layered-cards-wrapper', container: 'layered-cards' },
}
const defaultCfg = { type: 'fullheight' as const, overflow: 'hidden' as const, wrapper: '', container: '' }
const cfg = computed(() => props.media ? (mediaConfig[props.media.type] || defaultCfg) : defaultCfg)

function getMediaProps(p: Record<string, any>, bgColor?: string): Record<string, any> {
  const { mediaLabel, backgroundColor, sources, ...rest } = p
  const resolved: Record<string, any> = {}
  for (const [k, v] of Object.entries(rest)) {
    if (typeof v === 'string' && (v.startsWith('/images/') || v.startsWith('/videos/'))) resolved[k] = resolveMediaPath(v)
    else if (k === 'tabs' && Array.isArray(v)) resolved[k] = v.map((t: any) => ({
      ...t,
      videoSrc: t.videoSrc ? resolveMediaPath(t.videoSrc) : t.videoSrc,
      imageSrc: t.imageSrc ? resolveMediaPath(t.imageSrc) : t.imageSrc,
      imageSrcState2: t.imageSrcState2 ? resolveMediaPath(t.imageSrcState2) : t.imageSrcState2
    }))
    else resolved[k] = v
  }
  resolved.backgroundColor = backgroundColor || bgColor || '#ffffff'
  return resolved
}
</script>

<style scoped>
.story-section { width: 100%; display: flex; flex-direction: column; align-items: center; }
.content-block { width: 100%; max-width: 1200px; padding: 0 16px; box-sizing: border-box; }
.section-heading { margin-top: 32px; margin-bottom: 16px; }
.text-before { margin-bottom: -8px; }
.text-after { margin-top: 0; margin-bottom: 0; }
@media (max-width: 767px) { .content-block { padding: 0 24px; } }
</style>
