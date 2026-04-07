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
  <div class="flex flex-col items-center justify-center min-h-[80vh]">
    <div class="text-center">
      <h1 class="text-9xl font-bold text-primary mb-4">404</h1>
      <h2 class="text-3xl font-bold text-white mb-4">页面未找到</h2>
      <p class="text-gray-400 mb-8">抱歉，您访问的页面不存在</p>
      <button class="btn-primary" @click="goHome">
        返回首页
      </button>
    </div>
  </div>
</template>
