<template>
  <section class="case2-next-project">
    <div class="case2-content">
      <div class="case2-content-inner">
        <div class="case2-company">Smarp</div>

        <h2 class="case2-title">
          Redesigning the Employee Comms mobile experience
        </h2>

        <div class="case2-paragraph">
          <span class="case2-paragraph-text">
            Redesigning the Employee Comms mobile experience used by global teams <img :src="googleLogo" alt="Google" class="client-logo client-logo-google" /><img :src="cocaColaLogo" alt="Coca-Cola" class="client-logo" /><img :src="lorealLogo" alt="L'Oreal" class="client-logo client-logo-loreal" /> and improving content variety, information discoverability, and overall usability with recognized excellence <img :src="g2Badge" alt="G2 Awards" class="awards-badge" /> by G2.
          </span>
        </div>

        <a
          href="/story/two"
          class="case2-open-story"
          @click.prevent="handleStoryLinkClick"
        >
          Open Story
          <img src="@/assets/icons/rocket.svg" alt="" class="case2-icon" />
        </a>
      </div>
    </div>

    <div class="case2-image-container">
      <img
        class="case2-final-image"
        :src="finalImageSrc"
        alt="Final frame"
      />
    </div>
  </section>
</template>

<script setup>
import { useRouter } from "vue-router";
import { getImagePath } from "@/utils/mediaResolver.js";

const router = useRouter();

const finalImageSrc = getImagePath("case2-comparison.png");

const googleLogo = getImagePath("case2-logo-google.svg");
const cocaColaLogo = getImagePath("case2-logo-coca-cola.svg");
const lorealLogo = getImagePath("case2-logo-loreal.svg");
const g2Badge = getImagePath("case2-badge-g2.png");

const handleStoryLinkClick = (event) => {
  event.preventDefault();
  router.push("/story/two");
};
</script>

<style scoped>
.case2-next-project {
  position: relative;
  width: 100%;
  min-height: 100vh;
  background-color: #000000;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.case2-content {
  position: absolute;
  left: 0;
  top: 0;
  width: 50%;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  z-index: 2;
}

.case2-content-inner {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: clamp(16px, 2vh, 24px);
  max-width: min(48vw, 800px);
  width: 100%;
  pointer-events: auto;
  padding: clamp(24px, 3vw, 40px) clamp(28px, 3.5vw, 48px);
}

.case2-company {
  font-family: 'Hanken Grotesk', sans-serif;
  font-style: normal;
  font-weight: 590;
  font-size: clamp(16px, 1.2vw, 21px);
  line-height: 25px;
  color: #C89999;
  margin: 0;
  margin-bottom: -18px;
}

.case2-title {
  margin: 0;
  font-family: 'Hanken Grotesk', sans-serif;
  font-weight: 500;
  font-size: clamp(32px, 3vw, 56px);
  line-height: 1.2;
  letter-spacing: -0.01em;
  color: #ffffff;
  text-align: left;
}

.case2-paragraph {
  margin: 0;
  margin-top: clamp(7px, 2vh, 23px);
  margin-bottom: clamp(17px, 3vh, 33px);
  font-weight: 400;
  font-size: clamp(18px, 1.6vw, 26px);
  line-height: 2;
  color: rgba(255, 255, 255, 0.7);
  text-align: left;
}

.case2-paragraph-text {
  display: inline;
}

.client-logo {
  height: 32px;
  width: auto;
  display: inline-block;
  vertical-align: middle;
  margin: 0 8px;
  transform: translateY(-2px);
}

.client-logo-google {
  height: 36px;
  transform: translateY(1px);
}

.client-logo-loreal {
  height: 26px;
  transform: translateY(-2px);
}

.awards-badge {
  height: 70px;
  width: auto;
  display: inline-block;
  vertical-align: middle;
  margin-left: 0;
}

.case2-open-story {
  background: #1a1a1a;
  border: none;
  font-family: 'Hanken Grotesk', sans-serif;
  font-weight: 600;
  font-size: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ff8a7a;
  cursor: pointer;
  padding: 0 24px 0 29px;
  gap: 10px;
  width: 95%;
  height: 82px;
  border-radius: 16px;
  transition: background 0.3s ease;
  text-decoration: none;
}

.case2-open-story:hover {
  background: rgba(26, 26, 26, 0.8);
}

.case2-icon {
  height: 23px;
  width: auto;
  display: block;
  transform: translateY(0px);
}

.case2-image-container {
  position: absolute;
  top: 0;
  right: 0;
  width: 50%;
  height: 100vh;
  z-index: 1;
  overflow: hidden;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.case2-final-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  border-radius: 12px;
}

@media (max-width: 767px) {
  .case2-next-project {
    min-height: 100vh;
    flex-direction: column;
  }

  .case2-content {
    width: 100%;
    padding: 0;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .case2-content-inner {
    width: calc(100vw - 48px);
    max-width: calc(100vw - 48px);
    padding: 0 24px;
    align-items: center;
    text-align: center;
    gap: clamp(16px, 3vh, 24px);
  }

  .case2-company {
    text-align: center;
  }

  .case2-title {
    text-align: center;
    width: 100%;
  }

  .case2-paragraph {
    text-align: center;
    width: 100%;
  }

  .case2-open-story {
    width: 100%;
  }

  .case2-image-container {
    display: none;
  }
}

@media (min-width: 768px) and (max-width: 899px) {
  .case2-next-project {
    flex-direction: column;
  }

  .case2-content {
    width: 100%;
    padding: clamp(32px, 8vh, 64px) clamp(24px, 6vw, 48px);
    max-width: 100%;
  }

  .case2-content-inner {
    padding: 0;
    max-width: 100%;
    align-items: center;
    text-align: center;
    gap: clamp(20px, 3vh, 32px);
  }

  .case2-title {
    text-align: center;
    font-size: clamp(28px, 6vw, 40px);
  }

  .case2-paragraph {
    text-align: center;
    font-size: clamp(14px, 3.5vw, 16px);
  }

  .case2-open-story {
    font-size: 20px;
  }

  .case2-icon {
    height: 23px;
    width: auto;
    transform: translateY(-1px);
  }

  .case2-image-container {
    position: relative;
    width: 100%;
    min-height: 50vh;
  }

  .case2-final-image {
    object-fit: contain;
  }
}
</style>
