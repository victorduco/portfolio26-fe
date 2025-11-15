<template>
  <section class="case-next-project">
    <div class="next-project-content">
      <p class="next-project-label">Next Project</p>
      <h2 class="next-project-title">{{ title }}</h2>
      <router-link :to="getCaseRoute(caseId)" class="next-project-button">
        Open Story
      </router-link>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  caseId: {
    type: String,
    required: true,
    validator: (value) => ["1", "2", "3"].includes(value),
  },
  title: {
    type: String,
    required: true,
  },
});

const getCaseRoute = (caseId) => {
  const routes = {
    "1": "/story/one",
    "2": "/story/two",
    "3": "/story/three",
  };
  return routes[caseId] || "/";
};
</script>

<style scoped>
.case-next-project {
  width: 100%;
  min-height: 30vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px 0;
  box-sizing: border-box;
  background-color: #171717;
  color: #ffffff;
}

.next-project-content {
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.next-project-label {
  font-family: var(--font-family-base);
  font-size: 14px;
  font-weight: var(--font-weight-medium);
  line-height: 1.2;
  margin: 0;
  color: #ffffff;
  opacity: 0.5;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.next-project-title {
  font-family: var(--font-family-base);
  font-size: clamp(24px, 4vw, 32px);
  font-weight: var(--font-weight-semibold);
  line-height: 1.2;
  margin: 0;
  color: #ffffff;
  text-align: center;
}

.next-project-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-top: 16px;
  padding: 14px 32px;
  font-family: var(--font-family-base);
  font-size: 16px;
  font-weight: var(--font-weight-medium);
  color: #171717;
  background-color: #ffffff;
  border: none;
  border-radius: 24px;
  text-decoration: none;
  cursor: pointer;
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.next-project-button:hover {
  transform: scale(1.05);
  opacity: 0.9;
}

.next-project-button:active {
  transform: scale(0.98);
}

@media (max-width: 768px) {
  .case-next-project {
    min-height: 25vh;
    padding: 32px 0;
  }

  .next-project-content {
    gap: 12px;
  }

  .next-project-button {
    margin-top: 8px;
    padding: 12px 28px;
    font-size: 15px;
  }
}
</style>
