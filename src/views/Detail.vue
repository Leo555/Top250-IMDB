<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTitle } from '@vueuse/core'
import { useIntersectionObserver } from '@vueuse/core'
import { useMovieStore } from '@/stores/movie'

const route = useRoute()
const router = useRouter()
const movieStore = useMovieStore()

const imgRef = ref<HTMLImageElement | null>(null)
const isVisible = ref(false)

useIntersectionObserver(imgRef, ([{ isIntersecting }]) => {
  if (isIntersecting) {
    isVisible.value = true
  }
})

const movieId = computed(() => `/${route.params.id}`)
const movie = computed(() => movieStore.movieByImdb[movieId.value])

useTitle(computed(() => movie.value ? `${movie.value.name} - IMDB Top250` : '加载中...'))

function getImageUrl(src: string, isAvatar: boolean = false) {
  if (src.startsWith('http')) return src
  if (isAvatar) {
    return `/static/img/avatars/${src}`
  }
  return `/static/img/${src}`
}

function getWebpUrl(src: string) {
  if (src.startsWith('http')) return ''
  return `/static/img/${src.replace('.png', '.webp')}`
}

function getInitial(name: string) {
  if (!name) return '?'
  // 英文名取首字母
  if (/^[A-Za-z]/.test(name)) return name.charAt(0).toUpperCase()
  // 中文名取第一个字
  return name.charAt(0)
}

function goBack() {
  router.back()
}

// 格式化片长
function formatRuntime(minutes?: number) {
  if (!minutes) return ''
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return hours > 0 ? `${hours}小时${mins}分钟` : `${mins}分钟`
}

// 格式化评分人数
function formatVotes(votes?: number | string) {
  if (!votes) return ''
  const num = typeof votes === 'string' ? parseInt(votes.replace(/,/g, '')) : votes
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`
  }
  return num.toString()
}

// 解析演员列表（从 actors 字符串中提取更多演员）
function parseActors(actorsStr?: string) {
  if (!actorsStr) return []
  
  // 匹配格式：名字 空格 英文名
  // 例如："蒂姆·罗宾斯 Tim Robbins 摩根·弗里曼 Morgan Freeman"
  const actors: Array<{name: string, englishName: string}> = []
  const regex = /(\S+?)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/g
  let match
  
  while ((match = regex.exec(actorsStr)) !== null) {
    actors.push({
      name: match[1],
      englishName: match[2]
    })
  }
  
  return actors
}

// 合并主演信息（优先使用 subject.casts，补充 actors 字符串中的演员）
const allActors = computed(() => {
  if (!movie.value) return []
  
  const casts = movie.value.subject?.casts || []
  const additionalActors = parseActors(movie.value.actors)
  
  // 如果 subject.casts 已有数据，直接返回
  if (casts.length > 0) {
    // 补充额外的演员（没有头像的）
    const castNames = new Set(casts.map(c => c.name))
    const extra = additionalActors.filter(a => !castNames.has(a.name))
    
    return [
      ...casts,
      ...extra.slice(0, 5).map(actor => ({
        name: actor.name,
        englishName: actor.englishName,
        id: `extra-${actor.name}`,
        alt: '',
        avatars: ''
      }))
    ]
  }
  
  // 否则使用解析出的演员列表
  return additionalActors.slice(0, 8).map(actor => ({
    name: actor.name,
    englishName: actor.englishName,
    id: `actor-${actor.name}`,
    alt: '',
    avatars: ''
  }))
})
</script>

<template>
  <div v-if="movie" class="max-w-5xl mx-auto">
    <!-- Back Button -->
    <button
      class="mb-4 sm:mb-6 flex items-center text-gray-400 hover:text-white transition-colors min-h-[44px]"
      @click="goBack"
    >
      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
      </svg>
      返回列表
    </button>

    <!-- Movie Detail -->
    <div class="bg-dark-100 rounded-lg overflow-hidden">
      <div class="md:flex">
        <!-- Poster -->
        <div class="md:w-1/3">
          <div class="relative aspect-[2/3] max-h-[50vh] md:max-h-none bg-dark-300">
            <picture v-if="isVisible" ref="imgRef">
              <source v-if="getWebpUrl(movie.src)" :srcset="getWebpUrl(movie.src)" type="image/webp" />
              <img
                :src="getImageUrl(movie.src)"
                :alt="movie.name"
                class="w-full h-full object-cover"
                decoding="async"
              />
            </picture>
            <div v-else ref="imgRef" class="w-full h-full animate-pulse bg-dark-300"></div>

            <!-- Rank Badge -->
            <div class="absolute top-3 left-3 sm:top-4 sm:left-4 bg-primary text-white px-2.5 py-1 sm:px-3 rounded-lg text-base sm:text-lg font-bold">
              #{{ movie.order }}
            </div>
          </div>
        </div>

        <!-- Info -->
        <div class="md:w-2/3 p-4 sm:p-6">
          <h1 class="text-xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">{{ movie.name }}</h1>
          <p class="text-sm sm:text-lg text-gray-400 mb-3 sm:mb-4">{{ movie.englishName }}</p>

          <!-- Ratings Section -->
          <div class="mb-4 sm:mb-6 p-3 sm:p-4 bg-dark-300/50 rounded-xl border border-gray-800/50">
            <h3 class="text-xs sm:text-sm font-bold text-gray-500 mb-3 uppercase tracking-wider flex items-center gap-2">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
              </svg>
              评分
            </h3>
            <div class="grid grid-cols-3 gap-2 sm:gap-4">
              <!-- IMDB Rating -->
              <div v-if="movie.imdbRating || movie.score" class="text-center p-2 sm:p-3 bg-dark-300 rounded-lg">
                <div class="text-2xl sm:text-3xl font-bold text-yellow-500 mb-0.5">
                  {{ movie.imdbRating || movie.score }}
                </div>
                <div class="text-xs text-yellow-500/70 font-medium">IMDB</div>
                <div v-if="movie.imdbVotes" class="text-xs text-gray-600 mt-1">
                  {{ formatVotes(movie.imdbVotes) }} 票
                </div>
              </div>

              <!-- Douban Rating -->
              <div v-if="movie.doubanRating || movie.subject?.average" class="text-center p-2 sm:p-3 bg-dark-300 rounded-lg">
                <div class="text-2xl sm:text-3xl font-bold text-green-500 mb-0.5">
                  {{ movie.doubanRating || movie.subject?.average?.toFixed(1) }}
                </div>
                <div class="text-xs text-green-500/70 font-medium">豆瓣</div>
                <div v-if="movie.doubanVotes || movie.subject?.ratings_count" class="text-xs text-gray-600 mt-1">
                  {{ formatVotes(movie.doubanVotes || movie.subject?.ratings_count) }} 票
                </div>
              </div>

              <!-- Metascore -->
              <div v-if="movie.metascore" class="text-center p-2 sm:p-3 bg-dark-300 rounded-lg">
                <div class="text-2xl sm:text-3xl font-bold text-blue-500 mb-0.5">
                  {{ movie.metascore }}
                </div>
                <div class="text-xs text-blue-500/70 font-medium">Metascore</div>
              </div>
            </div>
          </div>

          <!-- Basic Info Grid -->
          <div class="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div v-if="movie.subject?.year || movie.releaseDate" class="p-3 bg-dark-300/50 rounded-lg border border-gray-800/30">
              <div class="text-xs text-gray-500 mb-1">年份</div>
              <div class="text-white font-medium">{{ movie.releaseDate?.split('-')[0] || movie.subject?.year }}</div>
            </div>

            <div v-if="movie.runtime" class="p-3 bg-dark-300/50 rounded-lg border border-gray-800/30">
              <div class="text-xs text-gray-500 mb-1">片长</div>
              <div class="text-white font-medium">{{ formatRuntime(movie.runtime) }}</div>
            </div>

            <div v-if="movie.rated" class="p-3 bg-dark-300/50 rounded-lg border border-gray-800/30">
              <div class="text-xs text-gray-500 mb-1">分级</div>
              <div class="text-white font-medium">{{ movie.rated }}</div>
            </div>

            <div v-if="movie.country" class="p-3 bg-dark-300/50 rounded-lg border border-gray-800/30">
              <div class="text-xs text-gray-500 mb-1">国家/地区</div>
              <div class="text-white text-sm">{{ movie.country }}</div>
            </div>

            <div v-if="movie.language" class="p-3 bg-dark-300/50 rounded-lg border border-gray-800/30">
              <div class="text-xs text-gray-500 mb-1">语言</div>
              <div class="text-white text-sm">{{ movie.language }}</div>
            </div>

            <div v-if="movie.subject?.genres?.length" class="p-3 bg-dark-300/50 rounded-lg border border-gray-800/30">
              <div class="text-xs text-gray-500 mb-1">类型</div>
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="genre in movie.subject.genres"
                  :key="genre"
                  class="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full"
                >{{ genre }}</span>
              </div>
            </div>
          </div>

          <!-- Detailed Info -->
          <div class="space-y-3 text-sm text-gray-300 break-words overflow-hidden">
            <p v-if="movie.nickName">
              <span class="text-gray-500">别名：</span>
              <span>{{ movie.nickName }}</span>
            </p>

            <p v-if="movie.aka && movie.aka !== movie.nickName">
              <span class="text-gray-500">又名：</span>
              <span>{{ movie.aka }}</span>
            </p>

            <p v-if="movie.director">
              <span class="text-gray-500">导演：</span>
              <span>{{ movie.director }}</span>
            </p>

            <p v-if="movie.writers?.length">
              <span class="text-gray-500">编剧：</span>
              <span>{{ movie.writers.join(' / ') }}</span>
            </p>

            <p v-if="movie.actors">
              <span class="text-gray-500">主演：</span>
              <span>{{ movie.actors }}</span>
            </p>

            <p v-if="movie.releaseDate">
              <span class="text-gray-500">上映日期：</span>
              <span>{{ movie.releaseDate }}</span>
            </p>

            <p v-if="movie.awards">
              <span class="text-gray-500">获奖：</span>
              <span>{{ movie.awards }}</span>
            </p>

            <p v-if="movie.budget">
              <span class="text-gray-500">预算：</span>
              <span>{{ movie.budget }}</span>
            </p>

            <p v-if="movie.boxOffice">
              <span class="text-gray-500">票房：</span>
              <span>{{ movie.boxOffice }}</span>
            </p>

            <!-- Synopsis -->
            <div v-if="movie.short" class="pt-5 mt-5 border-t border-gray-800/50">
              <h3 class="text-white font-bold mb-3 flex items-center gap-2">
                <svg class="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zM6 20V4h7v5h5v11H6z"/>
                </svg>
                剧情简介
              </h3>
              <p class="leading-relaxed text-gray-400">{{ movie.short }}</p>
            </div>

            <!-- External Links -->
            <div class="pt-5 mt-5 border-t border-gray-800/50 flex flex-wrap gap-3">
              <a
                :href="`https://www.imdb.com/title${movie.imdb}`"
                target="_blank"
                class="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/10 text-yellow-500 rounded-lg hover:bg-yellow-500/20 transition-colors"
              >
                <span class="font-bold text-sm">IMDb</span>
              </a>
              <a
                v-if="movie.subject?.alt"
                :href="movie.subject.alt"
                target="_blank"
                class="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-500 rounded-lg hover:bg-green-500/20 transition-colors"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <span class="font-medium text-sm">豆瓣</span>
              </a>
              <a
                v-if="movie.website"
                :href="movie.website"
                target="_blank"
                class="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/>
                </svg>
                <span class="font-medium text-sm">官方网站</span>
              </a>
            </div>

            <!-- Download -->
            <div v-if="movie.download" class="pt-4">
              <a
                :href="movie.download"
                target="_blank"
                class="btn-primary inline-block"
              >
                下载资源
              </a>
            </div>
          </div>

          <!-- Cast Section -->
          <div v-if="allActors.length > 0" class="mt-8 pt-6 border-t border-gray-700">
            <h3 class="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">主演</h3>
            <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 sm:gap-4">
              <div
                v-for="actor in allActors"
                :key="actor.id"
                class="text-center"
              >
                <img
                  v-if="actor.avatars"
                  :src="getImageUrl(actor.avatars, true)"
                  :alt="actor.name"
                  class="w-16 h-20 sm:w-20 sm:h-24 rounded-lg mx-auto mb-1.5 sm:mb-2 object-cover bg-dark-300"
                  loading="lazy"
                />
                <div
                  v-else
                  class="w-16 h-20 sm:w-20 sm:h-24 rounded-lg mx-auto mb-1.5 sm:mb-2 bg-dark-300 flex items-center justify-center"
                >
                  <span class="text-xl sm:text-2xl font-bold text-gray-500">{{ getInitial(actor.name) }}</span>
                </div>
                <p class="text-xs sm:text-sm text-gray-300 font-medium">{{ actor.name }}</p>
                <p v-if="actor.englishName" class="text-xs text-gray-500 mt-0.5">{{ actor.englishName }}</p>
              </div>
            </div>
          </div>

          <!-- Directors Section -->
          <div v-if="movie.subject?.directors?.length" class="mt-8 pt-6 border-t border-gray-700">
            <h3 class="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">导演</h3>
            <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 sm:gap-4">
              <div
                v-for="director in movie.subject.directors"
                :key="director.id"
                class="text-center"
              >
                <img
                  v-if="director.avatars"
                  :src="getImageUrl(director.avatars, true)"
                  :alt="director.name"
                  class="w-16 h-20 sm:w-20 sm:h-24 rounded-lg mx-auto mb-1.5 sm:mb-2 object-cover bg-dark-300"
                  loading="lazy"
                />
                <div
                  v-else
                  class="w-16 h-20 sm:w-20 sm:h-24 rounded-lg mx-auto mb-1.5 sm:mb-2 bg-dark-300 flex items-center justify-center"
                >
                  <span class="text-xl sm:text-2xl font-bold text-gray-500">{{ getInitial(director.name) }}</span>
                </div>
                <p class="text-xs sm:text-sm text-gray-300">{{ director.name }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Not Found -->
  <div v-else class="flex flex-col items-center justify-center min-h-[60vh]">
    <h2 class="text-2xl text-white mb-4">电影未找到</h2>
    <button class="btn-primary" @click="goBack">
      返回列表
    </button>
  </div>
</template>
