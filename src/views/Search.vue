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
    <!-- Search Header -->
    <div class="mb-6 sm:mb-8">
      <button
        class="mb-4 flex items-center text-gray-500 hover:text-white transition-colors text-sm min-h-[44px]"
        @click="goBack"
      >
        <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
        </svg>
        返回首页
      </button>
      <h1 class="text-xl sm:text-3xl font-bold text-white mb-1.5">
        搜索
        <span class="text-primary">"{{ keyword }}"</span>
      </h1>
      <p class="text-gray-500 text-sm">
        共找到 <span class="text-white font-medium">{{ movieStore.searchResults.length }}</span> 部电影
      </p>
      <div class="mt-4 h-px bg-gradient-to-r from-primary/60 via-primary/20 to-transparent"></div>
    </div>

    <!-- Results -->
    <div v-if="movieStore.searchResults.length > 0" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-5">
      <MovieCard
        v-for="movie in movieStore.searchResults"
        :key="movie.imdb"
        :movie="movie"
      />
    </div>

    <!-- No Results -->
    <div v-else class="flex flex-col items-center justify-center min-h-[40vh] py-16">
      <div class="w-20 h-20 rounded-full bg-dark-100 flex items-center justify-center mb-6">
        <svg class="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
      </div>
      <h2 class="text-lg sm:text-xl text-white font-medium mb-2">未找到相关电影</h2>
      <p class="text-gray-500 text-sm mb-6">试试其他关键词？</p>
      <button
        class="px-6 py-2.5 bg-primary hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium"
        @click="goBack"
      >
        返回首页
      </button>
    </div>
  </div>
</template>
