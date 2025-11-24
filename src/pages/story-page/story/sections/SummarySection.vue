<template>
  <section class="story-summary">
    <div class="summary-content">
      <div class="summary-header"><h2 class="summary-title">{{ data.title }}</h2></div>
      <div class="summary-details">
        <div v-for="d in details" :key="d.label" class="detail-group">
          <h4 class="detail-label">{{ d.label }}</h4>
          <p v-if="!d.isArray" class="detail-value">{{ d.value }}</p>
          <div v-else class="detail-value">
            <span v-for="(item, i) in d.value" :key="item">{{ item }}<span v-if="i < d.value.length - 1"> → </span></span>
          </div>
        </div>
      </div>
    </div>
    <MediaContainer v-if="media" v-bind="media.container">
      <component :is="media.component" v-bind="media.props" />
    </MediaContainer>
  </section>
</template>

<script setup>
import { computed } from 'vue';
import { summaryConfigs } from '@/content/storyConfigs.js';
import { getImagePath, getVideoPath } from '@/utils/mediaResolver.js';
import MediaContainer from '../media/MediaContainer.vue';
import FullscreenImg from '../media/FullscreenImg.vue';
import FullscreenVideo from '../media/FullscreenVideo.vue';

const props = defineProps({ storyId: { type: String, required: true }, storyConfig: { type: Object, default: () => ({}) } });

const data = computed(() => summaryConfigs[props.storyId]);
const details = computed(() => [
  { label: data.value.organizationType, value: data.value.organizationName },
  { label: 'Timeline', value: data.value.timeline },
  { label: 'Project Type', value: data.value.projectType },
  { label: 'Role', value: data.value.role },
  { label: 'Contribution', value: data.value.contribution, isArray: true }
]);

const media = computed(() => {
  const cfg = props.storyConfig;
  if (cfg.summaryImage) return {
    container: { type: 'fullheight', backgroundColor: cfg.videoBackground || 'transparent', label: cfg.mediaLabel || '', wrapperClass: 'fullscreen-image-wrapper' },
    component: FullscreenImg, props: { imageSrc: getImagePath(cfg.summaryImage), alt: `${data.value.title} preview` }
  };
  if (cfg.summaryVideo) return {
    container: { type: 'fullheight', backgroundColor: cfg.videoBackground || cfg.primary, label: cfg.mediaLabel || '', wrapperClass: 'fullscreen-video-wrapper', containerClass: 'fullscreen-video' },
    component: FullscreenVideo, props: { videoSrc: getVideoPath(cfg.summaryVideo), autoplayThreshold: cfg.autoplayThreshold || 0.75 }
  };
  return null;
});
</script>

<style scoped>
.story-summary { display: flex; flex-direction: column; }
.summary-content { display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 75px 0; gap: 32px; }
.summary-header, .summary-details { width: 100%; max-width: 1200px; padding: 0 16px; box-sizing: border-box; }
.summary-header { display: flex; flex-direction: column; gap: 16px; }
.summary-title { font-family: var(--story-title-font, var(--font-family-base)); margin: 0; color: inherit; text-align: left; }
.summary-details { display: flex; flex-wrap: wrap; gap: 32px 128px; align-items: flex-start; }
.detail-group { display: flex; flex-direction: column; gap: 8px; }
.detail-label, .detail-value { margin: 0; font-family: var(--font-family-base); font-weight: var(--font-weight-medium); font-size: 16px; line-height: 1.5; color: inherit; }
.detail-label { opacity: 0.5; }
.detail-value span span { opacity: 0.5; }

@media (max-width: 767px) {
  .summary-content { padding: 40px 0; gap: 40px; }
  .summary-header, .summary-details { max-width: 100%; padding: 0 24px; }
  .summary-details { flex-direction: column; gap: 24px; }
  .detail-value span { display: block; }
  .detail-value span span { display: none; }
}
@media (min-width: 768px) and (max-width: 900px) {
  .summary-content { padding: 50px 0; gap: 48px; }
  .summary-details { gap: 24px 32px; }
}
</style>
