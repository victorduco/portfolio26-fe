<template>
  <section class="s2ns">
    <div class="s2ns-wrap">
      <div class="s2ns-inner">
        <div class="s2ns-company">Smarp</div>
        <h2 class="s2ns-title">Redesigning the Employee Comms mobile experience</h2>
        <p class="s2ns-desc">
          <span>Redesigning the Employee Comms mobile experience used by global teams <img :src="imgs.google" alt="Google" class="s2ns-logo s2ns-logo-google" /><img :src="imgs.cocaCola" alt="Coca-Cola" class="s2ns-logo" /><img :src="imgs.loreal" alt="L'Oreal" class="s2ns-logo s2ns-logo-loreal" /> and improving content variety, information discoverability, and overall usability with recognized excellence <img :src="imgs.g2" alt="G2 Awards" class="s2ns-badge" /> by G2.</span>
        </p>
        <a href="/story/two" class="s2ns-btn" @click.prevent="$router.push('/story/two')">
          Open Story
          <img src="@/assets/icons/rocket.svg" alt="" class="s2ns-icon" />
        </a>
      </div>
    </div>
    <div class="s2ns-img">
      <img class="s2ns-photo" :src="imgs.final" alt="Final frame" />
    </div>
  </section>
</template>

<script setup>
import { getImagePath } from "@/utils/mediaResolver.js";
const imgs = {
  final: getImagePath("story2-comparison.png"),
  google: getImagePath("story2-logo-google.svg"),
  cocaCola: getImagePath("story2-logo-coca-cola.svg"),
  loreal: getImagePath("story2-logo-loreal.svg"),
  g2: getImagePath("story2-badge-g2.png")
};
</script>

<style scoped>
.s2ns { --font: 'Hanken Grotesk', sans-serif; --c-brand: #B14127; --c-btn: #6B1F13; --c-btn-bg: #f1d5d5; position: relative; width: 100%; min-height: 100vh; background: #F7E7E7; overflow: hidden; display: flex; align-items: center; justify-content: center; }
.s2ns-wrap { position: absolute; left: 0; top: 0; width: 50%; height: 100%; display: flex; align-items: center; justify-content: center; pointer-events: none; z-index: 2; }
.s2ns-inner { position: relative; display: flex; flex-direction: column; align-items: flex-start; gap: clamp(16px, 2vh, 24px); max-width: min(48vw, 800px); width: 100%; pointer-events: auto; padding: clamp(24px, 3vw, 40px) clamp(28px, 3.5vw, 48px); }
.s2ns-company { font: 590 clamp(16px, 1.2vw, 21px)/25px var(--font); color: var(--c-brand); margin-bottom: -18px; }
.s2ns-title { margin: 0; font: 500 clamp(32px, 3vw, 56px)/1.2 var(--font); letter-spacing: -0.01em; color: #000; }
.s2ns-desc { margin: clamp(7px, 2vh, 23px) 0 clamp(17px, 3vh, 33px); font: 400 clamp(18px, 1.6vw, 26px)/2 var(--font); color: rgba(0,0,0,0.7); }
.s2ns-logo { height: 32px; width: auto; display: inline-block; vertical-align: middle; margin: 0 8px; transform: translateY(-2px); }
.s2ns-logo-google { height: 36px; transform: translateY(1px); }
.s2ns-logo-loreal { height: 26px; transform: translateY(-2px); }
.s2ns-badge { height: 70px; width: auto; display: inline-block; vertical-align: middle; }
.s2ns-btn { background: var(--c-btn-bg); border: none; font: 600 22px var(--font); display: flex; align-items: center; justify-content: center; color: var(--c-btn); cursor: pointer; padding: 0 24px 0 29px; gap: 10px; width: 95%; height: 82px; border-radius: 16px; transition: background 0.3s; text-decoration: none; }
.s2ns-btn:hover { background: #e6c4c4; }
.s2ns-icon { height: 23px; width: auto; }
.s2ns-img { position: absolute; top: 0; right: 0; width: 50%; height: 100vh; z-index: 1; overflow: hidden; padding: 16px; display: flex; align-items: center; justify-content: center; }
.s2ns-photo { width: 100%; height: 100%; object-fit: cover; object-position: center; border-radius: 12px; }

@media (max-width: 767px) {
  .s2ns { flex-direction: column; }
  .s2ns-wrap { width: 100%; position: relative; }
  .s2ns-inner { width: calc(100vw - 48px); max-width: calc(100vw - 48px); padding: 0 24px; align-items: center; text-align: center; gap: clamp(16px, 3vh, 24px); }
  .s2ns-company, .s2ns-title, .s2ns-desc { text-align: center; width: 100%; }
  .s2ns-btn { width: 100%; }
  .s2ns-img { display: none; }
}

@media (min-width: 768px) and (max-width: 899px) {
  .s2ns { flex-direction: column; }
  .s2ns-wrap { width: 100%; padding: clamp(32px, 8vh, 64px) clamp(24px, 6vw, 48px); }
  .s2ns-inner { padding: 0; max-width: 100%; align-items: center; text-align: center; gap: clamp(20px, 3vh, 32px); }
  .s2ns-title { text-align: center; font-size: clamp(28px, 6vw, 40px); }
  .s2ns-desc { text-align: center; font-size: clamp(14px, 3.5vw, 16px); }
  .s2ns-btn { font-size: 20px; }
  .s2ns-icon { height: 23px; transform: translateY(-1px); }
  .s2ns-img { position: relative; width: 100%; min-height: 50vh; }
  .s2ns-photo { object-fit: contain; }
}
</style>
