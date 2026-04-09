<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const searchKeyword = ref('')
const showSearch = ref(false)

function handleSearch() {
  if (searchKeyword.value.trim()) {
    router.push({ name: 'Search', params: { keyword: searchKeyword.value.trim() } })
    showSearch.value = false
  }
}

function handleKeyPress(e: KeyboardEvent) {
  if (e.key === 'Enter') {
    handleSearch()
  }
}

function toggleSearch() {
  showSearch.value = !showSearch.value
  if (!showSearch.value) {
    searchKeyword.value = ''
  }
}
</script>

<template>
  <header class="bg-dark-300 shadow-md sticky top-0 z-50">
    <div class="container">
      <div class="flex items-center justify-between h-14 sm:h-16">
        <!-- Logo -->
        <router-link to="/" class="flex items-center space-x-2 shrink-0">
          <svg class="w-7 h-7 sm:w-8 sm:h-8 text-primary" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"/>
          </svg>
          <span class="hidden sm:inline text-xl font-bold text-white">IMDB Top250</span>
          <span class="sm:hidden text-base font-bold text-white">Top250</span>
        </router-link>

        <!-- Desktop Search -->
        <div class="hidden sm:flex items-center">
          <div class="relative">
            <input
              v-model="searchKeyword"
              type="text"
              placeholder="搜索电影..."
              class="w-48 md:w-64 px-4 py-2 bg-dark-100 border border-gray-700 rounded-lg focus:outline-none focus:border-primary text-white placeholder-gray-500 text-sm"
              @keypress="handleKeyPress"
            />
            <button
              class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary"
              @click="handleSearch"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Mobile Search Toggle -->
        <button
          class="sm:hidden p-2 text-gray-400 hover:text-white"
          @click="toggleSearch"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path v-if="!showSearch" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- Mobile Search Bar -->
      <transition name="slide">
        <div v-if="showSearch" class="sm:hidden pb-3">
          <div class="relative">
            <input
              v-model="searchKeyword"
              type="text"
              placeholder="搜索电影名称、导演、演员..."
              class="w-full px-4 py-2.5 bg-dark-100 border border-gray-700 rounded-lg focus:outline-none focus:border-primary text-white placeholder-gray-500"
              autofocus
              @keypress="handleKeyPress"
            />
            <button
              class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary p-1"
              @click="handleSearch"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </button>
          </div>
        </div>
      </transition>
    </div>
  </header>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.2s ease;
}
.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
