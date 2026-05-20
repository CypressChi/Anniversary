<script setup>
import { computed, nextTick, ref, watch } from "vue"

const props = defineProps({
  place: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(["close", "remember"])
const videoElement = ref(null)

const infoItems = computed(() => [
  props.place.dateLabel,
  props.place.locationLabel,
  props.place.videoLabel
].filter(Boolean))

function pauseVideo() {
  if (!videoElement.value) {
    return
  }

  videoElement.value.pause()
}

function resetVideo() {
  if (!videoElement.value) {
    return
  }

  pauseVideo()
  videoElement.value.currentTime = 0
  videoElement.value.load()
}

function playVideoFromStart() {
  if (!videoElement.value) {
    return
  }

  videoElement.value.muted = false
  videoElement.value.volume = 1
  videoElement.value.currentTime = 0

  const playPromise = videoElement.value.play?.()

  if (playPromise?.catch) {
    playPromise.catch(() => {})
  }
}

function rememberPlace() {
  emit("remember", props.place.id)
}

function completePlace() {
  rememberPlace()
  emit("close")
}

watch(
  () => props.place.videoSrc,
  async () => {
    pauseVideo()
    await nextTick()
    resetVideo()
  }
)

defineExpose({ pauseVideo, playVideoFromStart })
</script>

<template>
  <article class="memory-stage">
    <div class="memory-stage__media">
      <video
        :key="place.videoSrc"
        ref="videoElement"
        :src="place.videoSrc"
        :poster="place.videoPoster"
        controls
        playsinline
        preload="metadata"
        @ended="completePlace"
      >
        你的浏览器暂时无法播放这段影片。
      </video>
    </div>

    <div class="memory-stage__copy">
      <p class="memory-stage__eyebrow">地图上的记忆</p>
      <h3>{{ place.name }}</h3>

      <div class="memory-stage__meta" aria-label="地点信息">
        <span v-for="item in infoItems" :key="item">{{ item }}</span>
      </div>

      <div class="subtitle-card">
        <p>{{ place.titleText }}</p>
      </div>

      <p v-if="place.bodyText" class="memory-stage__note">
        {{ place.bodyText }}
      </p>

      <div class="memory-stage__footer">
        <button type="button" class="memory-stage__action" @click="emit('close')">
          回到地图
        </button>
      </div>
    </div>
  </article>
</template>
