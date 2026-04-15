<script setup lang="ts">
import { ref } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'
import type { Movie } from '@/types'

interface Props {
  movie: Movie
}

defineProps<Props>()

const imgRef = ref<HTMLImageElement | null>(null)
const isVisible = ref(false)

useIntersectionObserver(imgRef, ([{ isIntersecting }]) => {
  if (isIntersecting) {
    isVisible.value = true
  }
})

function getImageUrl(src: string) {
  return src.startsWith('http') ? src : `/static/img/${src}`
}

function getWebpUrl(src: string) {
  if (src.startsWith('http')) return ''
  return `/static/img/${src.replace('.png', '.webp')}`
}
</script>

<template>
  <router-link
    :to="{ name: 'Detail', params: { id: movie.imdb.replace('/', '') } }"
    class="card block"
  >
    <!-- Poster -->
    <div class="relative aspect-[2/3] bg-dark-300">
      <picture v-if="isVisible" ref="imgRef">
        <source v-if="getWebpUrl(movie.src)" :srcset="getWebpUrl(movie.src)" type="image/webp" />
        <img
          :src="getImageUrl(movie.src)"
          :alt="movie.name"
          class="w-full h-full object-cover"
          loading="lazy"
          decoding="async"
        />
      </picture>
      <div v-else ref="imgRef" class="w-full h-full animate-pulse bg-dark-300"></div>

      <!-- Rating Badge -->
      <div class="absolute top-2 right-2 bg-primary text-white px-2 py-1 rounded text-sm font-bold">
        {{ movie.score }}
      </div>

      <!-- Rank Badge -->
      <div class="absolute top-2 left-2 bg-dark-100 bg-opacity-80 text-white px-2 py-1 rounded text-sm">
        #{{ movie.order }}
      </div>
    </div>

    <!-- Info -->
    <div class="p-2.5 sm:p-4">
      <h3 class="text-white font-bold mb-1 sm:mb-2 truncate text-sm sm:text-base">{{ movie.name }}</h3>
      <p class="text-xs sm:text-sm text-gray-500 mb-1.5 sm:mb-2 truncate">{{ movie.englishName }}</p>
      <div class="flex items-center justify-between text-xs sm:text-sm">
        <span v-if="movie.subject?.year" class="text-gray-400">{{ movie.subject.year }}</span>
        <div v-if="movie.subject?.genres?.length" class="flex gap-1">
          <span
            v-for="genre in movie.subject.genres.slice(0, 2)"
            :key="genre"
            class="px-1.5 sm:px-2 py-0.5 bg-dark-300 rounded text-xs"
          >
            {{ genre }}
          </span>
        </div>
      </div>
    </div>
  </router-link>
</template>
