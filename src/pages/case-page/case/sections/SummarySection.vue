<template>
  <section class="case-summary">
    <div class="summary-content">
      <!-- Part 1: Title and description -->
      <div class="summary-header">
        <h1 class="summary-title">{{ summaryData.title }}</h1>
        <p class="summary-description">{{ summaryData.description }}</p>
      </div>

      <!-- Part 2: All details in horizontal flow -->
      <div class="summary-details-wrapper">
        <!-- Organization -->
        <div class="detail-group">
          <h3 class="detail-label">{{ summaryData.organizationType }}</h3>
          <p class="detail-value">{{ summaryData.organizationName }}</p>
        </div>

        <!-- Timeline -->
        <div class="detail-group">
          <h3 class="detail-label">Timeline</h3>
          <p class="detail-value">{{ summaryData.timeline }}</p>
        </div>

        <!-- Project Type -->
        <div class="detail-group">
          <h3 class="detail-label">Project Type</h3>
          <p class="detail-value">{{ summaryData.projectType }}</p>
        </div>

        <!-- Role -->
        <div class="detail-group">
          <h3 class="detail-label">Role</h3>
          <p class="detail-value">{{ summaryData.role }}</p>
        </div>

        <!-- Contribution -->
        <div class="detail-group">
          <h3 class="detail-label">Contribution</h3>
          <div class="detail-value">
            <span v-for="(item, index) in summaryData.contribution" :key="item">
              {{ item }}<span v-if="index < summaryData.contribution.length - 1"> → </span>
            </span>
          </div>
        </div>
      </div>
    </div>
    <FullscreenImg
      v-if="caseConfig.summaryImage"
      :image-src="caseConfig.summaryImage"
      :alt="`${summaryData.title} preview`"
      :background-color="caseConfig.videoBackground || 'transparent'"
      :image-label="caseConfig.videoLabel || ''"
    />
    <FullscreenVideo
      v-if="caseConfig.summaryVideo"
      :video-src="caseConfig.summaryVideo"
      :background-color="caseConfig.videoBackground || caseConfig.primary"
      :autoplay-threshold="caseConfig.autoplayThreshold || 0.75"
      :video-label="caseConfig.videoLabel || ''"
    />
  </section>
</template>

<script setup>
import { computed } from 'vue';
import FullscreenImg from '../media/FullscreenImg.vue';
import FullscreenVideo from '../media/FullscreenVideo.vue';

const props = defineProps({
  caseId: {
    type: String,
    required: true,
  },
  caseConfig: {
    type: Object,
    default: () => ({}),
  },
});

const summaryConfigs = {
  '1': {
    title: 'Transforming Financial Services with AI-Powered Reconciliation',
    description: 'Building intelligent automation for enterprise financial operations from ground up. Designed and developed a comprehensive AI-driven reconciliation system that streamlines complex financial workflows, reduces manual processing time by 85%, and improves accuracy across multiple business units. Led the product vision from initial concept through successful enterprise deployment.',
    timeline: 'Feb 2022 - Present',
    projectType: '0-1 Product',
    role: 'Senior Product Designer & Product Manager',
    contribution: ['User Research', 'Interface Design', 'Interaction Design', 'Product Strategy'],
    organizationType: 'Team',
    organizationName: 'Apple Financial Services'
  },
  '2': {
    title: 'Reimagining Team Communication for the Modern Workplace',
    description: 'Complete redesign of enterprise communication platform serving 50,000+ users. Transformed the entire user experience by conducting extensive research, reimagining core interaction patterns, and establishing a cohesive design system that improved engagement by 40% and reduced support tickets by 60%. Created a scalable foundation for future product evolution.',
    timeline: 'Jan 2021 - Dec 2021',
    projectType: 'Redesign',
    role: 'Senior Product Designer',
    contribution: ['User Research', 'Interface Design', 'Interaction Design', 'Design System'],
    organizationType: 'Company',
    organizationName: 'Smarp'
  },
  '3': {
    title: 'Revitalizing E-Commerce Platform Through Strategic Modernization',
    description: 'End-to-end UX audit and complete platform redesign for 2M+ users. Conducted comprehensive analysis of user behavior, identified critical pain points across the entire customer journey, and delivered a modernized experience that increased conversion rates by 35% and customer satisfaction scores by 45%. Established design principles and component library for sustained growth.',
    timeline: 'Mar 2020 - Aug 2020',
    projectType: 'UX Audit & Full Redesign',
    role: 'Lead UX Designer',
    contribution: ['UX Audit', 'User Research', 'Interface Design', 'Design System'],
    organizationType: 'Company',
    organizationName: 'Mirai'
  }
};

const summaryData = computed(() => summaryConfigs[props.caseId]);
</script>

<style scoped>
.case-summary {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.summary-content {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 150px 0 135px;
  box-sizing: border-box;
  gap: 64px;
}

/* Part 1: Header */
.summary-header {
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.summary-title {
  margin: 0;
  font-family: var(--case-title-font, var(--font-family-base));
  font-weight: var(--font-weight-semibold);
  font-size: clamp(28px, 5vw, 48px);
  line-height: 1.2;
  color: inherit;
  text-align: left;
}

.summary-description {
  margin: 0;
  font-family: var(--font-family-base);
  font-weight: var(--font-weight-medium);
  font-size: 16px;
  line-height: 1.5;
  color: inherit;
  max-width: 1200px;
}

/* Part 2: All details wrapper */
.summary-details-wrapper {
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-wrap: wrap;
  gap: 32px 128px;
  align-items: flex-start;
}

.detail-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.detail-label {
  margin: 0;
  font-family: var(--font-family-base);
  font-weight: var(--font-weight-medium);
  font-size: 14px;
  line-height: 1.5;
  color: inherit;
  opacity: 0.5;
}

.detail-value {
  margin: 0;
  font-family: var(--font-family-base);
  font-weight: var(--font-weight-medium);
  font-size: 16px;
  line-height: 1.5;
  color: inherit;
}

.detail-value span span {
  opacity: 0.5;
}

@media (max-width: 900px) {
  .summary-content {
    padding: 100px 0 60px;
    gap: 48px;
  }

  .summary-details-wrapper {
    gap: 24px 32px;
  }
}

@media (max-width: 600px) {
  .summary-content {
    padding: 80px 0 48px;
    gap: 40px;
  }

  .summary-title {
    font-size: clamp(24px, 7vw, 32px);
  }
}
</style>
