<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useTitle } from '@vueuse/core'
import { useMovieStore } from '@/stores/movie'
import MovieCard from '@/components/MovieCard.vue'
import Pagination from '@/components/Pagination.vue'

const route = useRoute()
const movieStore = useMovieStore()

useTitle('IMDB Top250 - 全球最佳电影排行榜')

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
    <!-- Page Header -->
    <div class="mb-6 sm:mb-8">
      <div class="flex items-end justify-between">
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold text-white mb-1">
            <span class="text-primary">IMDB</span> Top 250
          </h1>
          <p class="text-sm text-gray-500">全球评分最高的 250 部经典电影</p>
        </div>
        <div class="text-sm text-gray-500 hidden sm:block">
          第 {{ currentPage }} / {{ movieStore.totalPages }} 页
        </div>
      </div>
      <div class="mt-4 h-px bg-gradient-to-r from-primary/60 via-primary/20 to-transparent"></div>
    </div>

    <!-- Movie Grid -->
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-5">
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

  <!-- Loading Skeleton -->
  <div v-else>
    <div class="mb-6 sm:mb-8">
      <div class="h-8 w-48 bg-dark-100 rounded animate-pulse mb-2"></div>
      <div class="h-4 w-64 bg-dark-100 rounded animate-pulse"></div>
      <div class="mt-4 h-px bg-dark-100"></div>
    </div>
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-5">
      <div v-for="i in 10" :key="i" class="bg-dark-100 rounded-lg overflow-hidden">
        <div class="aspect-[2/3] bg-dark-300 animate-pulse"></div>
        <div class="p-3">
          <div class="h-4 bg-dark-300 rounded animate-pulse mb-2 w-3/4"></div>
          <div class="h-3 bg-dark-300 rounded animate-pulse w-1/2"></div>
        </div>
      </div>
    </div>
  </div>
</template>
