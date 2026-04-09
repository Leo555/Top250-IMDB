<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useTitle } from '@vueuse/core'
import { useMovieStore } from '@/stores/movie'
import MovieCard from '@/components/MovieCard.vue'
import Pagination from '@/components/Pagination.vue'

const route = useRoute()
const movieStore = useMovieStore()

useTitle('IMDB Top250 - 豆瓣电影Top250排行')

const currentPage = computed(() => {
  const page = Number(route.params.page) || 1
  return Math.max(1, Math.min(page, movieStore.totalPages))
})

watch(
  currentPage,
  (newPage) => {
    movieStore.setCurrentPage(newPage)
  },
  { immediate: true }
)
</script>

<template>
  <div v-if="movieStore.loaded">
    <!-- Movie Grid -->
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-6">
      <MovieCard
        v-for="movie in movieStore.currentMovies"
        :key="movie.imdb"
        :movie="movie"
      />
    </div>

    <!-- Pagination -->
    <Pagination
      :current-page="currentPage"
      :total-pages="movieStore.totalPages"
    />
  </div>

  <!-- Loading -->
  <div v-else class="flex items-center justify-center min-h-[60vh]">
    <div class="text-center">
      <div class="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p class="text-gray-400">加载中...</p>
    </div>
  </div>
</template>
