<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'

interface Props {
  currentPage: number
  totalPages: number
}

const props = defineProps<Props>()
const router = useRouter()

const pages = computed(() => {
  const pages: (number | string)[] = []
  const { currentPage, totalPages } = props

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i)
    }
  } else {
    pages.push(1)

    if (currentPage > 3) {
      pages.push('...')
    }

    const start = Math.max(2, currentPage - 1)
    const end = Math.min(totalPages - 1, currentPage + 1)

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    if (currentPage < totalPages - 2) {
      pages.push('...')
    }

    pages.push(totalPages)
  }

  return pages
})

function goToPage(page: number) {
  if (page === props.currentPage) return
  router.push({ name: page === 1 ? 'Home' : 'Page', params: { page } })
}
</script>

<template>
  <nav v-if="totalPages > 1" class="flex items-center justify-center flex-wrap gap-1.5 sm:gap-2 mt-8">
    <!-- Previous -->
    <button
      :disabled="currentPage === 1"
      class="min-w-[40px] sm:min-w-[44px] h-10 sm:h-11 px-2 sm:px-4 bg-dark-100 rounded-lg hover:bg-dark-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
      @click="goToPage(currentPage - 1)"
    >
      <svg class="w-5 h-5 sm:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
      </svg>
      <span class="hidden sm:inline text-sm">上一页</span>
    </button>

    <!-- Pages -->
    <button
      v-for="page in pages"
      :key="page"
      :disabled="page === '...'"
      :class="[
        'min-w-[40px] sm:min-w-[44px] h-10 sm:h-11 px-2 sm:px-3 rounded-lg transition-colors text-sm flex items-center justify-center',
        page === currentPage
          ? 'bg-primary text-white font-bold'
          : page === '...'
          ? 'cursor-default text-gray-500'
          : 'bg-dark-100 hover:bg-dark-300',
      ]"
      @click="typeof page === 'number' && goToPage(page)"
    >
      {{ page }}
    </button>

    <!-- Next -->
    <button
      :disabled="currentPage === totalPages"
      class="min-w-[40px] sm:min-w-[44px] h-10 sm:h-11 px-2 sm:px-4 bg-dark-100 rounded-lg hover:bg-dark-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
      @click="goToPage(currentPage + 1)"
    >
      <svg class="w-5 h-5 sm:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
      </svg>
      <span class="hidden sm:inline text-sm">下一页</span>
    </button>
  </nav>
</template>
