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
  <nav v-if="totalPages > 1" class="flex items-center justify-center space-x-2 mt-8">
    <!-- Previous -->
    <button
      :disabled="currentPage === 1"
      class="px-4 py-2 bg-dark-100 rounded hover:bg-dark-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      @click="goToPage(currentPage - 1)"
    >
      上一页
    </button>

    <!-- Pages -->
    <button
      v-for="page in pages"
      :key="page"
      :disabled="page === '...'"
      :class="[
        'px-4 py-2 rounded transition-colors',
        page === currentPage
          ? 'bg-primary text-white'
          : page === '...'
          ? 'cursor-default'
          : 'bg-dark-100 hover:bg-dark-300',
      ]"
      @click="typeof page === 'number' && goToPage(page)"
    >
      {{ page }}
    </button>

    <!-- Next -->
    <button
      :disabled="currentPage === totalPages"
      class="px-4 py-2 bg-dark-100 rounded hover:bg-dark-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      @click="goToPage(currentPage + 1)"
    >
      下一页
    </button>
  </nav>
</template>
