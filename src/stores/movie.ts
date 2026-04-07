import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Movie } from '@/types'
import { PAGE_SIZE } from '@/types'
import moviesListData from '@/data/movies-list.json'
import moviesDetailData from '@/data/movies-detail.json'

export const useMovieStore = defineStore('movie', () => {
  // State
  const movies = ref<Movie[]>([])
  const currentPage = ref(1)
  const loaded = ref(false)
  const searchKeyword = ref('')
  const searchResults = ref<Movie[]>([])

  // Getters
  const totalPages = computed(() => Math.ceil(movies.value.length / PAGE_SIZE))

  const currentMovies = computed(() => {
    const start = (currentPage.value - 1) * PAGE_SIZE
    const end = start + PAGE_SIZE
    return movies.value.slice(start, end)
  })

  const movieByImdb = computed(() => {
    const map: Record<string, Movie> = {}
    movies.value.forEach((movie) => {
      map[movie.imdb] = movie
    })
    return map
  })

  const movieByOrder = computed(() => {
    const map: Record<number, Movie> = {}
    movies.value.forEach((movie) => {
      map[movie.order] = movie
    })
    return map
  })

  // Actions
  function initMovies() {
    // 合并列表数据和详情数据
    const list = Array.isArray(moviesListData) ? moviesListData : (moviesListData as any).default || []
    const details = moviesDetailData as Record<string, any>
    
    movies.value = list.map((item: any) => {
      const detail = details[item.imdb] || {}
      return {
        ...item,
        ...detail
      } as Movie
    }).sort((a: Movie, b: Movie) => a.order - b.order)
    
    loaded.value = true
  }

  function setCurrentPage(page: number) {
    currentPage.value = Math.max(1, Math.min(page, totalPages.value))
  }

  function searchMovies(keyword: string) {
    searchKeyword.value = keyword
    if (!keyword.trim()) {
      searchResults.value = []
      return
    }

    const lowerKeyword = keyword.toLowerCase()
    searchResults.value = movies.value.filter((movie) => {
      return (
        movie.name.toLowerCase().includes(lowerKeyword) ||
        movie.englishName.toLowerCase().includes(lowerKeyword) ||
        movie.nickName?.toLowerCase().includes(lowerKeyword) ||
        movie.director?.toLowerCase().includes(lowerKeyword) ||
        movie.actors?.toLowerCase().includes(lowerKeyword)
      )
    })
  }

  function clearSearch() {
    searchKeyword.value = ''
    searchResults.value = []
  }

  return {
    // State
    movies,
    currentPage,
    loaded,
    searchKeyword,
    searchResults,
    // Getters
    totalPages,
    currentMovies,
    movieByImdb,
    movieByOrder,
    // Actions
    initMovies,
    setCurrentPage,
    searchMovies,
    clearSearch,
  }
})
