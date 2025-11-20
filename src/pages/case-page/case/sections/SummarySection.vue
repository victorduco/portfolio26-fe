<template>
  <section class="case-summary">
    <div class="summary-content">
      <!-- Part 1: Title -->
      <div class="summary-header">
        <h2 class="summary-title">{{ summaryData.title }}</h2>
      </div>

      <!-- Part 2: All details in horizontal flow -->
      <div class="summary-details-wrapper">
        <!-- Organization -->
        <div class="detail-group">
          <h4 class="detail-label">{{ summaryData.organizationType }}</h4>
          <p class="detail-value">{{ summaryData.organizationName }}</p>
        </div>

        <!-- Timeline -->
        <div class="detail-group">
          <h4 class="detail-label">Timeline</h4>
          <p class="detail-value">{{ summaryData.timeline }}</p>
        </div>

        <!-- Project Type -->
        <div class="detail-group">
          <h4 class="detail-label">Project Type</h4>
          <p class="detail-value">{{ summaryData.projectType }}</p>
        </div>

        <!-- Role -->
        <div class="detail-group">
          <h4 class="detail-label">Role</h4>
          <p class="detail-value">{{ summaryData.role }}</p>
        </div>

        <!-- Contribution -->
        <div class="detail-group">
          <h4 class="detail-label">Contribution</h4>
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
  padding: 75px 0 75px;
  box-sizing: border-box;
  gap: 32px;
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
  font-family: var(--case-title-font, var(--font-family-base));
  margin: 0;
  color: inherit;
  text-align: left;
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
  font-family: var(--font-family-base);
  font-weight: var(--font-weight-medium);
  font-size: 16px;
  line-height: 1.5;
  margin: 0;
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

@media (max-width: 767px) {
  .summary-content {
    padding: 40px 24px;
    gap: 40px;
  }

  .summary-header {
    max-width: 100%;
  }

  .summary-details-wrapper {
    max-width: 100%;
    flex-direction: column;
    gap: 24px;
  }

  .detail-group {
    width: 100%;
  }

  /* Make contribution items stack vertically */
  .detail-value span {
    display: block;
  }

  .detail-value span span {
    display: none; /* Hide the arrow separator */
  }
}

@media (min-width: 768px) and (max-width: 900px) {
  .summary-content {
    padding: 50px 24px;
    gap: 48px;
  }

  .summary-details-wrapper {
    gap: 24px 32px;
  }
}
</style>
