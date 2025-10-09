<template>
  <div :class="`case${caseId}-page`">
    <NavigationChevron
      class="case-page-back"
      type="route"
      to="/"
      direction="back"
      aria-label="Back to home"
    />
    <PageNavigation
      :sections="navigationSections"
      :enable-intro-animation="false"
    />
    <section :id="`case${caseId}-summary`">
      <component :is="SummaryComponent" />
    </section>
    <section :id="`case${caseId}-task`">
      <component :is="TaskComponent" />
    </section>
    <section :id="`case${caseId}-process`">
      <component :is="ProcessComponent" />
    </section>
    <section :id="`case${caseId}-results`">
      <component :is="ResultsComponent" />
    </section>
    <AppFooter />
  </div>
</template>

<script setup>
import { computed, defineAsyncComponent } from "vue";
import NavigationChevron from "@/components/common/NavigationChevron.vue";
import PageNavigation from "@/components/page-navigation/PageNavigation.vue";
import AppFooter from "@/components/app-footer/AppFooter.vue";
import { useMeta } from "@/composables/useMeta.js";

const props = defineProps({
  caseId: {
    type: String,
    required: true,
    validator: (value) => ["1", "2", "3"].includes(value),
  },
});

useMeta(`case${props.caseId}`);

const SummaryComponent = defineAsyncComponent(() =>
  import(`../case${props.caseId}-page/case${props.caseId}/Summary.vue`)
);
const TaskComponent = defineAsyncComponent(() =>
  import(`../case${props.caseId}-page/case${props.caseId}/Task.vue`)
);
const ProcessComponent = defineAsyncComponent(() =>
  import(`../case${props.caseId}-page/case${props.caseId}/Process.vue`)
);
const ResultsComponent = defineAsyncComponent(() =>
  import(`../case${props.caseId}-page/case${props.caseId}/Results.vue`)
);

const navigationSections = computed(() => [
  { id: `case${props.caseId}-summary`, label: "Summary" },
  { id: `case${props.caseId}-task`, label: "Task" },
  { id: `case${props.caseId}-process`, label: "Process" },
  { id: `case${props.caseId}-results`, label: "Results" },
]);
</script>

<style scoped>
.case1-page,
.case2-page,
.case3-page {
  width: 100vw;
  background: #171717;
  position: relative;
}

.case-page-back {
  position: fixed;
  top: 48px;
  left: 48px;
  z-index: 1001;
}

@media (max-width: 768px) {
  .case-page-back {
    top: 24px;
    left: 24px;
  }
}
</style>
