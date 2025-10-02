<template>
  <div class="main-page">
    <BgToSvg :source-selector="sourceSelector" :render-delay="100" />
    <PageNavigation :sections="navigationSections" />
    <section id="intro">
      <Intro />
    </section>
    <section id="cases">
      <Case1 />
      <Case2 />
      <Case3 />
    </section>
    <section id="values">
      <Values />
    </section>
    <section id="contacts">
      <Contacts />
    </section>
  </div>
</template>

<script setup>
import { ref } from "vue";
import Intro from "./intro/Intro.vue";
import BgToSvg from "../../components/bg-to-svg/BgToSvg.vue";
import Case1 from "./cases/Case1.vue";
import Case2 from "./cases/Case2.vue";
import Case3 from "./cases/Case3.vue";
import Values from "./values/Values.vue";
import Contacts from "./contacts/Contacts.vue";
import PageNavigation from "./page-navigation/PageNavigation.vue";

const sourceSelector = ref("intro-text-export-node");

const navigationSections = [
  { id: "intro", label: "Intro" },
  { id: "cases", label: "Cases" },
  { id: "values", label: "Values" },
  { id: "contacts", label: "Contacts" },
];
</script>

<style scoped>
.main-page {
  width: 100vw;
  background: #171717;
}
</style>
