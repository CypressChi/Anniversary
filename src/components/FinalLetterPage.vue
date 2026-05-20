<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue"
import {
  finalLetterMessage,
  finalLetterSignature,
  finalLetterTitle,
  finalPhotos
} from "../data/finalLetter"

const activePhotoIndex = ref(0)
let photoTimer = null

const visiblePhotos = computed(() => {
  return finalPhotos.filter((photo) => photo?.src)
})

function startPhotoLoop() {
  if (visiblePhotos.value.length <= 1) {
    return
  }

  photoTimer = window.setInterval(() => {
    activePhotoIndex.value = (activePhotoIndex.value + 1) % visiblePhotos.value.length
  }, 5200)
}

function stopPhotoLoop() {
  if (!photoTimer) {
    return
  }

  window.clearInterval(photoTimer)
  photoTimer = null
}

onMounted(startPhotoLoop)
onBeforeUnmount(stopPhotoLoop)
</script>

<template>
  <section class="final-letter-page" aria-label="写给你的一封小信">
    <div class="final-letter-backdrop" aria-hidden="true">
      <img
        v-for="(photo, index) in visiblePhotos"
        :key="photo.src"
        class="final-letter-photo"
        :class="{ 'is-visible': index === activePhotoIndex }"
        :src="photo.src"
        :alt="photo.alt"
      />
    </div>

    <div class="final-letter-fallback" aria-hidden="true"></div>
    <div class="final-letter-veil" aria-hidden="true"></div>

    <article class="final-letter-card">
      <p class="final-letter-kicker">TO YOU</p>
      <h2 class="final-letter-title">{{ finalLetterTitle }}</h2>
      <p class="final-letter-message">{{ finalLetterMessage }}</p>
      <p class="final-letter-signature">{{ finalLetterSignature }}</p>
    </article>

    <div class="final-letter-rotate-hint" aria-hidden="true">
      请横屏观看这份小小的纪念册
    </div>
  </section>
</template>
