<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const searchKeyword = ref('')

function handleSearch() {
  if (searchKeyword.value.trim()) {
    router.push({ name: 'Search', params: { keyword: searchKeyword.value.trim() } })
  }
}

function handleKeyPress(e: KeyboardEvent) {
  if (e.key === 'Enter') {
    handleSearch()
  }
}
</script>

<template>
  <header class="bg-dark-300 shadow-md sticky top-0 z-50">
    <div class="container">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <router-link to="/" class="flex items-center space-x-2">
          <svg class="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"/>
          </svg>
          <span class="text-xl font-bold text-white">IMDB Top250</span>
        </router-link>

        <!-- Search -->
        <div class="flex items-center space-x-4">
          <div class="relative">
            <input
              v-model="searchKeyword"
              type="text"
              placeholder="搜索电影..."
              class="w-64 px-4 py-2 bg-dark-100 border border-gray-700 rounded-lg focus:outline-none focus:border-primary text-white placeholder-gray-500"
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
      </div>
    </div>
  </header>
</template>
