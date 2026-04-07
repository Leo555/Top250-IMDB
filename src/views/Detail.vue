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

function getImageUrl(src: string) {
  return src.startsWith('http') ? src : `/static/img/${src}`
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
</script>

<template>
  <div v-if="movie" class="max-w-5xl mx-auto">
    <!-- Back Button -->
    <button
      class="mb-6 flex items-center text-gray-400 hover:text-white transition-colors"
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
          <div class="relative aspect-[2/3] bg-dark-300">
            <img
              v-if="isVisible"
              ref="imgRef"
              :src="getImageUrl(movie.src)"
              :alt="movie.name"
              class="w-full h-full object-cover"
            />
            <div v-else ref="imgRef" class="w-full h-full animate-pulse bg-dark-300"></div>

            <!-- Rank Badge -->
            <div class="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-lg text-lg font-bold">
              #{{ movie.order }}
            </div>
          </div>
        </div>

        <!-- Info -->
        <div class="md:w-2/3 p-6">
          <h1 class="text-3xl font-bold text-white mb-2">{{ movie.name }}</h1>
          <p class="text-lg text-gray-400 mb-4">{{ movie.englishName }}</p>

          <!-- Ratings Section -->
          <div class="mb-6 p-4 bg-dark-300 rounded-lg">
            <h3 class="text-sm font-bold text-gray-500 mb-3 uppercase tracking-wider">评分</h3>
            <div class="grid grid-cols-3 gap-4">
              <!-- IMDB Rating -->
              <div v-if="movie.imdbRating || movie.score" class="text-center">
                <div class="text-3xl font-bold text-yellow-500 mb-1">
                  {{ movie.imdbRating || movie.score }}
                </div>
                <div class="text-xs text-gray-500">IMDB</div>
                <div v-if="movie.imdbVotes" class="text-xs text-gray-600 mt-1">
                  {{ formatVotes(movie.imdbVotes) }} 票
                </div>
              </div>

              <!-- Douban Rating -->
              <div v-if="movie.doubanRating || movie.subject?.average" class="text-center">
                <div class="text-3xl font-bold text-green-500 mb-1">
                  {{ movie.doubanRating || movie.subject?.average?.toFixed(1) }}
                </div>
                <div class="text-xs text-gray-500">豆瓣</div>
                <div v-if="movie.doubanVotes || movie.subject?.ratings_count" class="text-xs text-gray-600 mt-1">
                  {{ formatVotes(movie.doubanVotes || movie.subject?.ratings_count) }} 票
                </div>
              </div>

              <!-- Metascore -->
              <div v-if="movie.metascore" class="text-center">
                <div class="text-3xl font-bold text-blue-500 mb-1">
                  {{ movie.metascore }}
                </div>
                <div class="text-xs text-gray-500">Metascore</div>
              </div>
            </div>
          </div>

          <!-- Basic Info Grid -->
          <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <div v-if="movie.subject?.year || movie.releaseDate" class="p-3 bg-dark-300 rounded">
              <div class="text-xs text-gray-500 mb-1">年份</div>
              <div class="text-white">{{ movie.releaseDate?.split('-')[0] || movie.subject?.year }}</div>
            </div>

            <div v-if="movie.runtime" class="p-3 bg-dark-300 rounded">
              <div class="text-xs text-gray-500 mb-1">片长</div>
              <div class="text-white">{{ formatRuntime(movie.runtime) }}</div>
            </div>

            <div v-if="movie.rated" class="p-3 bg-dark-300 rounded">
              <div class="text-xs text-gray-500 mb-1">分级</div>
              <div class="text-white">{{ movie.rated }}</div>
            </div>

            <div v-if="movie.country" class="p-3 bg-dark-300 rounded">
              <div class="text-xs text-gray-500 mb-1">国家/地区</div>
              <div class="text-white text-sm">{{ movie.country }}</div>
            </div>

            <div v-if="movie.language" class="p-3 bg-dark-300 rounded">
              <div class="text-xs text-gray-500 mb-1">语言</div>
              <div class="text-white text-sm">{{ movie.language }}</div>
            </div>

            <div v-if="movie.subject?.genres?.length" class="p-3 bg-dark-300 rounded">
              <div class="text-xs text-gray-500 mb-1">类型</div>
              <div class="text-white text-sm">{{ movie.subject.genres.join(' / ') }}</div>
            </div>
          </div>

          <!-- Detailed Info -->
          <div class="space-y-4 text-gray-300">
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
            <div v-if="movie.short" class="pt-4 border-t border-gray-700">
              <h3 class="text-gray-500 font-bold mb-2">剧情简介</h3>
              <p class="leading-relaxed text-gray-300">{{ movie.short }}</p>
            </div>

            <!-- External Links -->
            <div class="pt-4 border-t border-gray-700 flex flex-wrap gap-4">
              <a
                :href="`https://www.imdb.com/title${movie.imdb}`"
                target="_blank"
                class="text-primary hover:underline flex items-center"
              >
                <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.31 9.588v.005c-.077-.048-.227-.07-.42-.07v4.967c.27 0 .44-.05.5-.134.062-.084.093-.313.093-.69v-3.46c0-.27-.008-.443-.023-.52-.016-.076-.05-.13-.1-.148zM22.416 0H1.62C.732.014.011.729 0 1.617v20.766c.011.888.732 1.603 1.62 1.617h20.796c.9-.004 1.627-.737 1.584-1.638V1.617C24.043.721 23.316-.013 22.416 0zM4.225 17.5H2.09V6.5h2.135v11zm6.46 0H8.618v-7.16l-1.59 7.16H4.99l-1.65-7.16V17.5H1.3V6.5h3.18c.18.77.37 1.56.55 2.34.18.78.37 1.57.56 2.37l.33 1.43 1.59-6.14h3.155v11zm6.46-3.76c0 .83-.04 1.44-.12 1.83-.08.39-.25.7-.51.94-.26.24-.6.42-1.02.54-.42.12-.97.18-1.66.18H11.2V6.5h2.77c.86 0 1.52.06 1.98.18.46.12.82.3 1.07.55.25.25.41.55.48.9.07.35.11.94.11 1.77v3.84zm6.49-.16c0 .77-.05 1.34-.14 1.72-.09.38-.28.68-.57.9-.29.22-.7.33-1.22.33-.5 0-.9-.1-1.18-.3-.28-.2-.45-.48-.51-.84-.06-.36-.09-.97-.09-1.81v-1.39h2.13v.27c0 .6.01 1 .04 1.2.03.2.1.3.21.3.12 0 .2-.06.22-.19.02-.13.04-.47.04-1.03v-3.5c0-.42-.02-.68-.06-.78-.04-.1-.13-.15-.27-.15-.14 0-.24.06-.28.17-.04.11-.06.38-.06.79v.7h-2.13v-.9c0-.7.05-1.21.15-1.54.1-.33.31-.6.64-.81.33-.21.78-.31 1.37-.31.62 0 1.1.1 1.43.31.33.21.54.48.64.81.1.33.15.87.15 1.62v4.04z"/>
                </svg>
                IMDB 主页
              </a>
              <a
                v-if="movie.subject?.alt"
                :href="movie.subject.alt"
                target="_blank"
                class="text-primary hover:underline flex items-center"
              >
                <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M13.5 2c-5.621 0-10.211 4.443-10.475 10h-3.025l5 6.625 5-6.625h-2.975c.257-3.351 3.021-6 6.475-6 3.584 0 6.5 2.916 6.5 6.5s-2.916 6.5-6.5 6.5c-1.863 0-3.542-.793-4.728-2.053l-2.427 3.216c1.877 1.754 4.389 2.837 7.155 2.837 5.79 0 10.5-4.71 10.5-10.5s-4.71-10.5-10.5-10.5z"/>
                </svg>
                豆瓣主页
              </a>
              <a
                v-if="movie.website"
                :href="movie.website"
                target="_blank"
                class="text-primary hover:underline flex items-center"
              >
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/>
                </svg>
                官方网站
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
          <div v-if="movie.subject?.casts?.length" class="mt-8 pt-6 border-t border-gray-700">
            <h3 class="text-xl font-bold text-white mb-4">主演</h3>
            <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
              <div
                v-for="cast in movie.subject.casts"
                :key="cast.id"
                class="text-center"
              >
                <img
                  :src="getImageUrl(cast.avatars)"
                  :alt="cast.name"
                  class="w-20 h-20 rounded-full mx-auto mb-2 object-cover bg-dark-300"
                  loading="lazy"
                />
                <p class="text-sm text-gray-300">{{ cast.name }}</p>
              </div>
            </div>
          </div>

          <!-- Directors Section -->
          <div v-if="movie.subject?.directors?.length" class="mt-8 pt-6 border-t border-gray-700">
            <h3 class="text-xl font-bold text-white mb-4">导演</h3>
            <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
              <div
                v-for="director in movie.subject.directors"
                :key="director.id"
                class="text-center"
              >
                <img
                  :src="getImageUrl(director.avatars)"
                  :alt="director.name"
                  class="w-20 h-20 rounded-full mx-auto mb-2 object-cover bg-dark-300"
                  loading="lazy"
                />
                <p class="text-sm text-gray-300">{{ director.name }}</p>
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
