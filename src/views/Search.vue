<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTitle } from '@vueuse/core'
import { useMovieStore } from '@/stores/movie'
import MovieCard from '@/components/MovieCard.vue'

const route = useRoute()
const router = useRouter()
const movieStore = useMovieStore()

const keyword = computed(() => route.params.keyword as string || '')

useTitle(computed(() => `"${keyword.value}" 搜索结果 - IMDB Top250`))

watch(
  keyword,
  (newKeyword) => {
    movieStore.searchMovies(newKeyword)
  },
  { immediate: true }
)

function goBack() {
  router.push({ name: 'Home' })
}
</script>

<template>
  <div class="max-w-7xl mx-auto">
    <!-- Search Info -->
    <div class="mb-6 sm:mb-8">
      <h1 class="text-xl sm:text-3xl font-bold text-white mb-2">
        搜索 "{{ keyword }}"
      </h1>
      <p class="text-gray-400 text-sm sm:text-base">
        找到 {{ movieStore.searchResults.length }} 部电影
      </p>
    </div>

    <!-- Results -->
    <div v-if="movieStore.searchResults.length > 0" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-6">
      <MovieCard
        v-for="movie in movieStore.searchResults"
        :key="movie.imdb"
        :movie="movie"
      />
    </div>

    <!-- No Results -->
    <div v-else class="flex flex-col items-center justify-center min-h-[40vh]">
      <svg class="w-24 h-24 text-gray-700 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
      <h2 class="text-xl text-gray-400 mb-4">未找到相关电影</h2>
      <button class="btn-primary" @click="goBack">
        返回首页
      </button>
    </div>
  </div>
</template>
