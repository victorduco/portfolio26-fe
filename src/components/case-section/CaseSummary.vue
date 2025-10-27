<template>
  <section class="case-summary">
    <div class="summary-content">
      <!-- Part 1: Title and description -->
      <div class="summary-header">
        <h1 class="summary-title">{{ summaryData.title }}</h1>
        <p class="summary-description">{{ summaryData.description }}</p>
      </div>

      <!-- Part 2: Project details horizontal -->
      <div class="summary-details">
        <div class="detail-item">
          <h3 class="detail-label">Timeline</h3>
          <p class="detail-value">{{ summaryData.timeline }}</p>
        </div>
        <div class="detail-item">
          <h3 class="detail-label">Project Type</h3>
          <p class="detail-value">{{ summaryData.projectType }}</p>
        </div>
        <div class="detail-item">
          <h3 class="detail-label">Role</h3>
          <p class="detail-value">{{ summaryData.role }}</p>
        </div>
      </div>

      <!-- Part 3: Contribution and Team/Company -->
      <div class="summary-footer">
        <div class="contribution">
          <h3 class="footer-label">My Contribution</h3>
          <ul class="contribution-list">
            <li v-for="item in summaryData.contribution" :key="item">{{ item }}</li>
          </ul>
        </div>
        <div class="organization">
          <h3 class="footer-label">{{ summaryData.organizationType }}</h3>
          <p class="organization-name">{{ summaryData.organizationName }}</p>
        </div>
      </div>
    </div>
    <FullscreenImage
      v-if="caseConfig.summaryImage"
      :image-src="caseConfig.summaryImage"
      :alt="`${summaryData.title} preview`"
    />
  </section>
</template>

<script setup>
import { computed } from 'vue';
import FullscreenImage from './FullscreenImage.vue';

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
    description: 'Building intelligent automation for enterprise financial operations from ground up.',
    timeline: 'Feb 2022 - Present',
    projectType: '0-1 Product',
    role: 'Senior Product Designer & Product Manager',
    contribution: ['User Research', 'Interface Design', 'Interaction Design', 'Product Strategy'],
    organizationType: 'Team',
    organizationName: 'Apple Financial Services'
  },
  '2': {
    title: 'Reimagining Team Communication for the Modern Workplace',
    description: 'Complete redesign of enterprise communication platform serving 50,000+ users.',
    timeline: 'Jan 2021 - Dec 2021',
    projectType: 'Redesign',
    role: 'Senior Product Designer',
    contribution: ['User Research', 'Interface Design', 'Interaction Design', 'Design System'],
    organizationType: 'Company',
    organizationName: 'Smarp'
  },
  '3': {
    title: 'Revitalizing E-Commerce Platform Through Strategic Modernization',
    description: 'End-to-end UX audit and complete platform redesign for 2M+ users.',
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
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 120px 48px 80px;
  box-sizing: border-box;
  gap: 64px;
}

/* Part 1: Header */
.summary-header {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.summary-title {
  margin: 0;
  font-family: var(--font-family-base);
  font-weight: var(--font-weight-semibold);
  font-size: clamp(28px, 5vw, 48px);
  line-height: 1.2;
  color: inherit;
  text-align: left;
}

.summary-description {
  margin: 0;
  font-family: var(--font-family-base);
  font-weight: var(--font-weight-regular);
  font-size: clamp(14px, 1.5vw, 16px);
  line-height: 1.5;
  color: inherit;
  opacity: 0.65;
  max-width: 600px;
}

/* Part 2: Details */
.summary-details {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 48px;
}

.detail-item {
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

/* Part 3: Footer */
.summary-footer {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 64px;
}

.footer-label {
  margin: 0 0 16px 0;
  font-family: var(--font-family-base);
  font-weight: var(--font-weight-medium);
  font-size: 14px;
  line-height: 1.5;
  color: inherit;
  opacity: 0.5;
}

.contribution-list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.contribution-list li {
  font-family: var(--font-family-base);
  font-weight: var(--font-weight-medium);
  font-size: 16px;
  line-height: 1.5;
  color: inherit;
}

.organization-name {
  margin: 0;
  font-family: var(--font-family-base);
  font-weight: var(--font-weight-medium);
  font-size: 16px;
  line-height: 1.5;
  color: inherit;
}

@media (max-width: 900px) {
  .summary-content {
    padding: 100px 32px 60px;
    gap: 48px;
  }

  .summary-details {
    grid-template-columns: 1fr;
    gap: 32px;
  }

  .summary-footer {
    grid-template-columns: 1fr;
    gap: 48px;
  }
}

@media (max-width: 600px) {
  .summary-content {
    padding: 80px 24px 48px;
    gap: 40px;
  }

  .summary-title {
    font-size: clamp(24px, 7vw, 32px);
  }
}
</style>
