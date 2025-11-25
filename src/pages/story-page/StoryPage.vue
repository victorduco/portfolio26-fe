<template>
  <div :class="`story${storyId}-page`" :style="pageStyle">
    <div class="story-main-content">
      <NavigationChevron class="story-page-back" type="route" to="/" direction="back" aria-label="Back to home" :dark-mode="config.darkMode" />
      <PageNavigation :sections="navigationSections" :dark-mode="config.darkMode" />
      <section :id="`story${storyId}-summary`">
        <SummarySection :story-id="storyId" :story-config="config" />
      </section>
      <section v-for="(contentSection, key) in storyContent" :key="key" :id="`story${storyId}-${key}`" class="content-section">
        <div v-if="contentSection.heading" class="section-title">
          <h3 :class="contentSection.heading.subtitle ? 'story-heading-two-level' : 'story-heading-single'">
            <template v-if="contentSection.heading.subtitle">
              <span class="story-heading-subtitle">{{ contentSection.heading.subtitle }}</span>
              <span class="story-heading-main">{{ contentSection.heading.main }}</span>
            </template>
            <template v-else>{{ contentSection.heading.main }}</template>
          </h3>
        </div>
        <ContentSection v-for="(section, i) in contentSection.sections" :key="i" :heading="section.heading" :text-before="section.textBefore" :media="section.media" :text-after="section.textAfter" :background-color="config.videoBackground" />
      </section>
      <section v-if="config.results" :id="`story${storyId}-results`">
        <ResultsCardsSection v-if="storyId === '2'" :results="config.results" :intro-text="config.resultsIntro" :conclusion-text="config.resultsConclusion" :card-background="config.videoBackground" :media-label="config.resultsMediaLabel" />
        <ResultsGridSection v-else :results="config.results" :results-note="config.resultsNote" />
      </section>
      <section v-if="config.simpleResults" :id="`story${storyId}-results`">
        <SimpleResultsSection :title="config.simpleResults.title" :text="config.simpleResults.text" />
      </section>
      <AppFooter :dark-mode="false" />
    </div>
    <template v-if="config.nextStory">
      <NextStoryPlaque :story-number="storyNames[config.nextStory.storyId - 1]" />
      <NextStorySection :content-component="nextStoryComponent" />
    </template>
  </div>
</template>

<script setup>
import { computed, onMounted, nextTick, defineAsyncComponent } from "vue";
import NavigationChevron from "@/components/navigation-chevron/NavigationChevron.vue";
import PageNavigation from "@/components/page-navigation/PageNavigation.vue";
import ContentSection from "./story/sections/ContentSection.vue";
import SummarySection from "./story/sections/SummarySection.vue";
import ResultsGridSection from "./story/sections/ResultsGridSection.vue";
import ResultsCardsSection from "./story/sections/ResultsCardsSection.vue";
import SimpleResultsSection from "./story/sections/SimpleResultsSection.vue";
import AppFooter from "@/components/app-footer/AppFooter.vue";
import NextStoryPlaque from "./story/sections/NextStoryPlaque.vue";
import NextStorySection from "./story/sections/next-story/NextStorySection.vue";
import { useMeta } from "@/composables/useMeta.js";
import { storiesContent } from "@/content/stories";
import { storyConfigs, sectionLabels, storyNames } from "@/content/storyConfigs.js";

const props = defineProps({
  storyId: { type: String, required: true, validator: (v) => ["1", "2", "3"].includes(v) },
});

useMeta(`story${props.storyId}`);
onMounted(() => { window.scrollTo(0, 0); nextTick(() => window.scrollTo(0, 0)); });

const storyContent = computed(() => storiesContent[props.storyId] || {});

const config = computed(() => {
  const c = storyConfigs[props.storyId];
  return { ...c, textColor: "#000000", darkMode: false };
});

const pageStyle = computed(() => ({
  backgroundColor: config.value.background,
  color: config.value.textColor,
  transition: 'background-color 0.5s ease, color 0.5s ease',
  '--story-title-font': config.value.font || 'var(--font-family-base)',
  '--story-primary-color': config.value.primary,
  '--story-secondary-color': config.value.secondary || config.value.primary,
  '--story-subtitle-color': config.value.subtitleColor || '#007aff',
}));

const nextStoryComponent = computed(() => {
  const id = config.value.nextStory?.storyId;
  return defineAsyncComponent(() => import(`./story/sections/next-story/Story${id}NextStory.vue`));
});

const navigationSections = computed(() => {
  const nav = [{ id: `story${props.storyId}-summary`, label: "Summary" }];
  Object.keys(storyContent.value).forEach(key => {
    nav.push({ id: `story${props.storyId}-${key}`, label: sectionLabels[key] || key.charAt(0).toUpperCase() + key.slice(1) });
  });
  if (config.value.results || config.value.simpleResults) nav.push({ id: `story${props.storyId}-results`, label: "Results" });
  return nav;
});
</script>

<style scoped>
[class*="story"][class$="-page"] { width: 100%; position: relative; overflow-x: hidden; }
.story-main-content { position: relative; z-index: 10; background-color: inherit; }
section { position: relative; z-index: 1; background-color: inherit; }
.story-main-content > section { isolation: isolate; }
.story-page-back { position: fixed; top: 48px; left: 48px; z-index: 1001; }
.content-section { width: 100%; padding: 40px 0; overflow-x: hidden; display: flex; flex-direction: column; align-items: center; }
.section-title { width: 100%; max-width: 1200px; margin-top: 12px; margin-bottom: 0; padding: 0 16px; box-sizing: border-box; }

@media (max-width: 899px) { .story-page-back { top: 24px; left: 24px; } }
@media (max-width: 767px) {
  .section-title { padding: 0 24px; }
  section:has(+ .story-next-story) { padding-bottom: 120px; }
}
@media (min-width: 768px) and (max-width: 899px) {
  .content-section { padding: 40px 24px; }
  .section-title { padding: 0 24px; }
}
</style>
