export interface Cast {
  alt: string
  avatars: string
  name: string
  id: string
  englishName?: string
}

export interface Director {
  alt: string
  avatars: string
  name: string
  id: string
}

export interface Subject {
  genres: string[]
  title: string
  casts: Cast[]
  original_title: string
  directors: Director[]
  year: string
  alt: string
  id: string
  ratings_count?: number
  average?: number
}

export interface Movie {
  imdb: string
  name: string
  score: string
  src: string
  englishName: string
  nickName?: string
  director?: string
  actors?: string
  subject?: Subject
  short?: string
  download?: string
  order: number
  id?: string
  // 增强信息
  runtime?: number // 片长（分钟）
  country?: string // 制片国家/地区
  language?: string // 语言
  releaseDate?: string // 上映日期
  aka?: string // 又名
  website?: string // 官方网站
  writers?: string[] // 编剧
  // 评分信息
  doubanRating?: string // 豆瓣评分
  doubanVotes?: number // 豆瓣评分人数
  imdbRating?: string // IMDB评分
  imdbVotes?: string // IMDB评分人数
  metascore?: string // Metascore评分
  // 其他信息
  rated?: string // 电影分级
  awards?: string // 获奖信息
  boxOffice?: string // 票房
  budget?: string // 预算
  production?: string // 制作公司
}

// 列表数据类型（用于 movies-list.json）
export interface MovieListItem {
  imdb: string
  order: number
  name: string
  score: string
  src: string
  englishName: string
  year: string
  genres: string[]
}

// 详情数据类型（用于 movies-detail.json）
export interface MovieDetail {
  imdb: string
  nickName?: string
  director?: string
  actors?: string
  subject?: Subject
  short?: string
  download?: string
}

export interface MovieState {
  movies: Movie[]
  currentPage: number
  loaded: boolean
  searchKeyword: string
  searchResults: Movie[]
}

export const PAGE_SIZE = 20
