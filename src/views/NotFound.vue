<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useTitle } from '@vueuse/core'

const router = useRouter()

useTitle('404 - 页面未找到')

function goHome() {
  router.push({ name: 'Home' })
}
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-[80vh] px-4">
    <div class="text-center max-w-md">
      <!-- Animated 404 -->
      <div class="relative mb-8">
        <h1 class="text-[10rem] sm:text-[12rem] font-black leading-none text-dark-100 select-none">
          404
        </h1>
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="text-center">
            <svg class="w-16 h-16 sm:w-20 sm:h-20 text-primary mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"/>
            </svg>
          </div>
        </div>
      </div>

      <h2 class="text-xl sm:text-2xl font-bold text-white mb-3">迷路了？</h2>
      <p class="text-gray-500 mb-8 leading-relaxed">
        您访问的页面不存在或已被移除<br>
        不如回去看看经典好片吧
      </p>

      <button
        class="px-8 py-3 bg-primary hover:bg-red-700 text-white rounded-lg transition-all duration-200 font-medium hover:shadow-lg hover:shadow-primary/20"
        @click="goHome"
      >
        回到首页
      </button>
    </div>
  </div>
</template>
