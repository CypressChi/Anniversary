<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue"
import {
  finalLetterMessage,
  finalLetterSignature,
  finalLetterTitle,
  finalPhotos
} from "./data/finalLetter"
import { finalBgmUrl } from "./data/mediaUrls"
import { memories, siteContent } from "./data/memories"

const pages = [
  { key: "cover", label: "封面" },
  { key: "route", label: "旅迹" },
  { key: "interlude-question", label: "转场" },
  { key: "interlude-more", label: "更多" },
  { key: "letter", label: "信件" }
]

const pageIndex = ref(0)
const selectedMemoryId = ref(memories[0]?.id ?? "")
const visitedMemoryIds = ref(new Set())
const photoIndexes = ref({})
const activeVideoMemory = ref(null)
const videoPlayerRef = ref(null)
const activeFinalPhotoIndex = ref(0)
const finalBgmRef = ref(null)
const isFinalBgmPlaying = ref(false)
const isFinalBgmEnabled = ref(true)
let finalPhotoTimer = null

const coverPhoto = computed(() => {
  return siteContent.cover?.background ?? firstAvailablePhoto.value ?? "/photos/anniversary.jpg"
})

const firstAvailablePhoto = computed(() => {
  return memories.flatMap((memory) => getPhotos(memory))[0] ?? ""
})

const selectedMemory = computed(() => {
  return memories.find((memory) => memory.id === selectedMemoryId.value) ?? memories[0] ?? null
})

const currentPage = computed(() => pages[pageIndex.value])

const visibleFinalPhotos = computed(() => {
  return finalPhotos.filter((photo) => photo?.src)
})

const allMemoriesVisited = computed(() => {
  return memories.length > 0 && memories.every((memory) => visitedMemoryIds.value.has(memory.id))
})

const currentGuideText = computed(() => {
  if (currentPage.value.key === "cover") {
    return "Hi！欢迎来到你们的一周年旅程。今天由我带你慢慢看完这一年。"
  }

  if (currentPage.value.key === "route") {
    if (allMemoriesVisited.value) {
      return "这条路线我们走完啦。接下来，去看看这些地点背后的故事吧。"
    }

    return selectedMemory.value?.guideText || "点一点这些地点吧，我陪你把这一年的路线慢慢走完。"
  }

  if (currentPage.value.key === "interlude-question") {
    return "你以为结束了吗？"
  }

  if (currentPage.value.key === "interlude-more") {
    return "其实，还有一些"
  }

  return "我带路到这里啦。接下来这段话，要认真看喔。"
})

const guideButtonLabel = computed(() => {
  if (pageIndex.value === pages.length - 1) {
    return "回到开始"
  }

  if (currentPage.value.key === "cover") {
    return "开始旅程"
  }

  if (currentPage.value.key === "route") {
    return allMemoriesVisited.value ? "去看我们的故事" : "看下一处回忆"
  }

  if (currentPage.value.key === "interlude-question") {
    return "继续看看"
  }

  if (currentPage.value.key === "interlude-more") {
    return "继续听他说"
  }

  return "继续往后看"
})

const mapPins = computed(() => {
  const placesWithCoordinates = memories.filter((memory) => Array.isArray(getMapCoordinates(memory)))

  if (!placesWithCoordinates.length) {
    return memories.map((memory, index) => ({
      memory,
      x: 18 + (index % 3) * 32,
      y: 18 + Math.floor(index / 3) * 24,
      shiftX: index % 3 === 2 ? "calc(-100% + 24px)" : "-24px",
      shiftY: Math.floor(index / 3) > 1 ? "calc(-100% + 24px)" : "-24px"
    }))
  }

  const latitudes = placesWithCoordinates.map((memory) => getMapCoordinates(memory)[0])
  const longitudes = placesWithCoordinates.map((memory) => getMapCoordinates(memory)[1])
  const minLat = Math.min(...latitudes)
  const maxLat = Math.max(...latitudes)
  const minLng = Math.min(...longitudes)
  const maxLng = Math.max(...longitudes)
  const latRange = maxLat - minLat || 1
  const lngRange = maxLng - minLng || 1

  return memories.map((memory, index) => {
    const coordinates = getMapCoordinates(memory)

    if (!Array.isArray(coordinates)) {
      return {
        memory,
        x: 18 + (index % 3) * 32,
        y: 18 + Math.floor(index / 3) * 24,
        shiftX: index % 3 === 2 ? "calc(-100% + 24px)" : "-24px",
        shiftY: Math.floor(index / 3) > 1 ? "calc(-100% + 24px)" : "-24px"
      }
    }

    const x = 10 + ((coordinates[1] - minLng) / lngRange) * 80
    const y = 12 + ((maxLat - coordinates[0]) / latRange) * 76

    return {
      memory,
      x,
      y,
      shiftX: x > 68 ? "calc(-100% + 24px)" : "-24px",
      shiftY: y > 70 ? "calc(-100% + 24px)" : "-24px"
    }
  })
})

const mapRoutePoints = computed(() => {
  return mapPins.value.map((pin) => `${pin.x},${pin.y}`).join(" ")
})

function getPhotos(memory) {
  if (!memory) {
    return []
  }

  if (Array.isArray(memory.photos)) {
    return memory.photos.filter(Boolean)
  }

  return memory.photos ? [memory.photos] : []
}

function getMapCoordinates(memory) {
  return memory?.markerCoordinates ?? memory?.coordinates
}

function getActivePhoto(memory) {
  const photos = getPhotos(memory)

  if (!photos.length) {
    return ""
  }

  const activeIndex = photoIndexes.value[memory.id] ?? 0
  return photos[activeIndex % photos.length]
}

function isMemoryVisited(memoryId) {
  return visitedMemoryIds.value.has(memoryId)
}

function markMemoryVisited(memoryId) {
  if (!memoryId) {
    return
  }

  const nextVisitedMemoryIds = new Set(visitedMemoryIds.value)
  nextVisitedMemoryIds.add(memoryId)
  visitedMemoryIds.value = nextVisitedMemoryIds
}

function selectMemory(memoryId) {
  selectedMemoryId.value = memoryId
  markMemoryVisited(memoryId)
}

function goToNextMemory() {
  if (!memories.length) {
    return
  }

  const currentIndex = Math.max(
    0,
    memories.findIndex((memory) => memory.id === selectedMemoryId.value)
  )
  const nextMemory = memories[(currentIndex + 1) % memories.length]
  selectMemory(nextMemory.id)
}

function openMemoryVideo(memory) {
  if (!memory) {
    return
  }

  selectMemory(memory.id)
  activeVideoMemory.value = memory

  nextTick(() => {
    if (!videoPlayerRef.value) {
      return
    }

    videoPlayerRef.value.currentTime = 0
    const playPromise = videoPlayerRef.value.play?.()

    if (playPromise?.catch) {
      playPromise.catch(() => {})
    }
  })
}

function closeMemoryVideo() {
  if (videoPlayerRef.value) {
    videoPlayerRef.value.pause()
    videoPlayerRef.value.currentTime = 0
  }

  activeVideoMemory.value = null
}

function playFinalBgm() {
  const audio = finalBgmRef.value

  if (!audio || !isFinalBgmEnabled.value) {
    return
  }

  audio.volume = 0.42
  const playPromise = audio.play?.()

  if (playPromise?.then) {
    playPromise
      .then(() => {
        isFinalBgmPlaying.value = true
      })
      .catch(() => {
        isFinalBgmPlaying.value = false
      })
    return
  }

  isFinalBgmPlaying.value = !audio.paused
}

function pauseFinalBgm() {
  const audio = finalBgmRef.value

  if (!audio) {
    return
  }

  audio.pause()
  isFinalBgmPlaying.value = false
}

function toggleFinalBgm() {
  const audio = finalBgmRef.value

  if (!audio) {
    return
  }

  if (audio.paused) {
    isFinalBgmEnabled.value = true
    playFinalBgm()
    return
  }

  isFinalBgmEnabled.value = false
  pauseFinalBgm()
}

function startFinalPhotoLoop() {
  if (visibleFinalPhotos.value.length <= 1 || finalPhotoTimer) {
    return
  }

  finalPhotoTimer = window.setInterval(() => {
    activeFinalPhotoIndex.value =
      (activeFinalPhotoIndex.value + 1) % visibleFinalPhotos.value.length
  }, 5200)
}

function stopFinalPhotoLoop() {
  if (!finalPhotoTimer) {
    return
  }

  window.clearInterval(finalPhotoTimer)
  finalPhotoTimer = null
}

function showNextPhoto(memory) {
  const photos = getPhotos(memory)

  if (!memory || photos.length <= 1) {
    return
  }

  photoIndexes.value = {
    ...photoIndexes.value,
    [memory.id]: ((photoIndexes.value[memory.id] ?? 0) + 1) % photos.length
  }
}

function goToPage(nextIndex) {
  closeMemoryVideo()
  pageIndex.value = (nextIndex + pages.length) % pages.length
  scrollCurrentPageToTop()
}

function goNext() {
  goToPage(pageIndex.value === pages.length - 1 ? 0 : pageIndex.value + 1)
}

function handleGuideButtonClick() {
  if (currentPage.value.key === "route" && !allMemoriesVisited.value) {
    goToNextMemory()
    return
  }

  goNext()
}

function goPrevious() {
  goToPage(pageIndex.value === 0 ? pages.length - 1 : pageIndex.value - 1)
}

function handleKeydown(event) {
  if (activeVideoMemory.value) {
    if (event.key === "Escape") {
      closeMemoryVideo()
    }

    return
  }

  if (event.key === "ArrowRight") {
    goNext()
  }

  if (event.key === "ArrowLeft") {
    goPrevious()
  }
}

function handleScreenTurn(event) {
  if (activeVideoMemory.value) {
    return
  }

  const clickedElement = event.target

  if (clickedElement?.closest?.("button, a, video, .memory-video-stage, .stitch-guide")) {
    return
  }

  if (event.clientX < window.innerWidth / 2) {
    if (pageIndex.value === 0) {
      return
    }

    goPrevious()
    return
  }

  if (pageIndex.value === pages.length - 1) {
    return
  }

  goNext()
}

watch(pageIndex, () => {
  window.requestAnimationFrame(() => {
    scrollCurrentPageToTop()
  })

  if (currentPage.value.key === "letter") {
    nextTick(playFinalBgm)
    return
  }

  pauseFinalBgm()
})

function scrollCurrentPageToTop() {
  window.requestAnimationFrame(() => {
    const activePage = document.querySelectorAll(".album-page")[pageIndex.value]
    activePage?.scrollTo?.({ top: 0, behavior: "smooth" })
  })
}

onMounted(() => {
  window.addEventListener("keydown", handleKeydown)
  startFinalPhotoLoop()
})

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleKeydown)
  stopFinalPhotoLoop()
  pauseFinalBgm()
  closeMemoryVideo()
})
</script>

<template>
  <main
    class="stitch-album"
    :class="`is-${currentPage.key}`"
    :style="{ '--page-index': pageIndex }"
    @click="handleScreenTurn"
  >
    <div class="album-glow album-glow--blue" aria-hidden="true"></div>
    <div class="album-glow album-glow--coral" aria-hidden="true"></div>

    <aside class="landscape-gate" aria-label="横屏观看提示">
      <div class="landscape-gate__phone" aria-hidden="true">
        <span></span>
      </div>
      <p>请横屏观看</p>
    </aside>

    <div class="album-viewport">
      <div class="album-track">
        <section class="album-page cover-page" aria-label="封面页">
          <div class="cover-photo-wrap">
            <img class="cover-photo" :src="coverPhoto" alt="一周年纪念照片" />
          </div>

          <div class="cover-content">
            <p class="page-kicker">{{ siteContent.cover?.kicker ?? "Happy Anniversary" }}</p>
            <h1>{{ siteContent.cover?.title ?? "史迪奇主题的一周年纪念册" }}</h1>
            <p class="cover-lead">
              {{ siteContent.cover?.lead ?? "这一年里，地点、照片和很多很小的瞬间，都被悄悄收进这本纪念册。" }}
            </p>
            <div class="cover-stamp" aria-hidden="true">
              <span>1st</span>
              <small>Anniversary</small>
            </div>
          </div>
        </section>

        <section class="album-page route-page" aria-label="旅迹页">
          <header class="page-heading">
            <p class="page-kicker">Memory Route</p>
            <h2>回忆路线图</h2>
            <p>不是地图，是你们这一年一起走过的温柔坐标。</p>
          </header>

          <div class="route-layout">
            <aside class="memory-map-card" aria-label="回忆地图">
              <div class="memory-map-card__top">
                <span>Memory Map</span>
                <strong>{{ selectedMemory?.title }}</strong>
              </div>

              <div class="memory-map-board">
                <svg class="memory-map-route" viewBox="0 0 100 100" aria-hidden="true">
                  <polyline :points="mapRoutePoints" />
                </svg>

                <button
                  v-for="pin in mapPins"
                  :key="pin.memory.id"
                  type="button"
                  class="map-pin"
                  :class="{
                    'is-active': selectedMemory?.id === pin.memory.id,
                    'is-visited': isMemoryVisited(pin.memory.id)
                  }"
                  :style="{
                    '--pin-x': `${pin.x}%`,
                    '--pin-y': `${pin.y}%`,
                    '--pin-shift-x': pin.shiftX,
                    '--pin-shift-y': pin.shiftY
                  }"
                  @click="openMemoryVideo(pin.memory)"
                >
                  <span aria-hidden="true"></span>
                  <strong>{{ pin.memory.title }}</strong>
                  <em>{{ pin.memory.date }} · {{ pin.memory.location }}</em>
                </button>
              </div>

            </aside>

          </div>
        </section>

        <section class="album-page interlude-page interlude-question-page" aria-label="转场页">
          <div class="interlude-decoration" aria-hidden="true">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </section>

        <section class="album-page interlude-page interlude-more-page" aria-label="更多回忆转场页">
          <div class="interlude-decoration interlude-decoration--soft" aria-hidden="true">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </section>

        <section class="album-page letter-page" aria-label="信件页">
          <audio
            ref="finalBgmRef"
            :src="finalBgmUrl"
            loop
            preload="auto"
          ></audio>

          <button
            type="button"
            class="letter-bgm-button"
            :class="{ 'is-playing': isFinalBgmPlaying }"
            :aria-label="isFinalBgmPlaying ? '关闭背景音乐' : '开启背景音乐'"
            :title="isFinalBgmPlaying ? '关闭背景音乐' : '开启背景音乐'"
            @click.stop="toggleFinalBgm"
          >
            <span aria-hidden="true">♪</span>
          </button>

          <div class="letter-backdrop" aria-hidden="true">
            <img
              v-for="(photo, index) in visibleFinalPhotos"
              :key="photo.src"
              class="letter-backdrop__photo"
              :class="{ 'is-visible': index === activeFinalPhotoIndex }"
              :src="photo.src"
              :alt="photo.alt"
            />
          </div>
          <div class="letter-backdrop__veil" aria-hidden="true"></div>

          <div class="letter-stage">
            <article class="letter-card">
              <p class="page-kicker">For You</p>
              <h2>{{ finalLetterTitle }}</h2>
              <p class="letter-message">{{ finalLetterMessage }}</p>
              <p class="letter-signature">{{ finalLetterSignature }}</p>
            </article>

            <aside class="letter-guide stitch-guide" aria-label="史迪奇导游">
              <img class="stitch-guide__mascot" src="/mascot/stitch-guide.gif" alt="史迪奇导游" />
              <div class="stitch-guide__bubble">
                <p>{{ currentGuideText }}</p>
              </div>
            </aside>
          </div>
        </section>
      </div>
    </div>

    <section
      v-if="activeVideoMemory"
      class="memory-video-overlay"
      aria-label="视频回忆"
      @click.self="closeMemoryVideo"
    >
      <article class="memory-video-stage">
        <button type="button" class="memory-video-close" aria-label="关闭视频" @click="closeMemoryVideo">
          ×
        </button>

        <div class="memory-video-media">
          <video
            v-if="activeVideoMemory.videoSrc"
            ref="videoPlayerRef"
            :key="activeVideoMemory.videoSrc"
            :src="activeVideoMemory.videoSrc"
            :poster="getActivePhoto(activeVideoMemory)"
            controls
            playsinline
            preload="metadata"
          >
            你的浏览器暂时无法播放这段影片。
          </video>
          <div v-else class="memory-video-placeholder">
            这一站的视频还在准备中
          </div>
        </div>

        <div class="memory-video-copy">
          <p class="memory-date">{{ activeVideoMemory.date }}</p>
          <h3>{{ activeVideoMemory.title }}</h3>
          <p class="memory-location">{{ activeVideoMemory.location }}</p>
          <p>{{ activeVideoMemory.longText || activeVideoMemory.message }}</p>
        </div>
      </article>
    </section>

    <aside
      v-if="currentPage.key !== 'letter'"
      class="stitch-guide"
      :class="{ 'map-guide map-guide-route': currentPage.key === 'route' }"
      aria-label="史迪奇导游"
    >
      <img class="stitch-guide__mascot" src="/mascot/stitch-guide.gif" alt="史迪奇导游" />
      <div class="stitch-guide__bubble">
        <p>{{ currentGuideText }}</p>
        <button type="button" @click="handleGuideButtonClick">{{ guideButtonLabel }}</button>
      </div>
    </aside>
  </main>
</template>
