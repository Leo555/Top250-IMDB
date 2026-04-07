<script setup lang="ts">
import { onMounted } from 'vue'
import { useMovieStore } from '@/stores/movie'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import BackTop from '@/components/BackTop.vue'

const movieStore = useMovieStore()

onMounted(() => {
  movieStore.initMovies()
})
</script>

<template>
  <div id="app" class="min-h-screen flex flex-col">
    <Header />
    <main class="flex-1 container py-8">
      <router-view v-slot="{ Component }">
        <keep-alive :max="10">
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </main>
    <Footer />
    <BackTop />
  </div>
</template>
