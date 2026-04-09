<script setup lang="ts">
import { useWindowScroll } from '@vueuse/core'

const { y } = useWindowScroll()

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <transition name="fade">
    <button
      v-if="y > 300"
      class="fixed bottom-20 right-4 sm:bottom-8 sm:right-8 w-11 h-11 sm:w-12 sm:h-12 bg-primary hover:bg-red-700 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 z-50"
      aria-label="返回顶部"
      @click="scrollToTop"
    >
      <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/>
      </svg>
    </button>
  </transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
