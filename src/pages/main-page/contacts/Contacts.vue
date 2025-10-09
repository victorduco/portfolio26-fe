<template>
  <section class="contacts">
    <div class="contacts__content">
      <!-- Contacts content will go here -->
    </div>
    <AppFooter />
  </section>
</template>

<script setup>
import AppFooter from "@/components/app-footer/AppFooter.vue";
</script>

<style scoped>
.contacts {
  width: 100vw;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: #171717;
}

.contacts__content {
  flex: 1 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px 32px;
}
</style>
