const axios = require('axios')
const cheerio = require('cheerio')
const jsonfile = require('jsonfile')

const baseUrl = 'https://api.douban.com/v2/movie/search?count=1&q='
let movies = require('./movies.json')

async function fetchMovie (movie) {
  if (!movie) throw new Error('no movie')
  console.log(movie.name)
  if (!movie.subject) {
    const movieName = movie.name
    const r = await axios(`${baseUrl}${encodeURIComponent(movieName)}`)
    movie.subject = r.data.subjects[0]
    console.log(movie.name, movie.subject.alt)
  }
  const {data} = await axios(`${movie.subject.alt}`)
  let $ = cheerio.load(data)
  let short = $('.related-info .all').text().trim()
  if (!short) short = $('.related-info > .indent').text().trim()
  if (short) movie.short = short
}

async function go () {
  // 豆瓣限制每分钟只能取40条数据
  let count = 0
  let cmovies = movies
  console.log(cmovies.length)
  let inter = setInterval(async () => {
    let movie = cmovies[count++]
    fetchMovie(movie).catch(e => console.log(e))
    if (!movie) {
      clearInterval(inter)
      setTimeout(() => {
        jsonfile.writeFile('./movies.json', movies, {spaces: 2}, err => {
          if (err) console.error(err)
          console.log('movies persisted')
        })
      }, 10 * 1000)
    }
  }, 2000)
}
go()
// fetchMovie(movies[13])
