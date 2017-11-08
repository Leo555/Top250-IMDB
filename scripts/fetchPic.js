let movies = require('./movies.json')
const {download, persist} = require('./utils')

movies.forEach(m => {
  if (!m.subject) {
    console.log(m.name)
  } else {
    let {directors, casts} = m.subject
    directors.forEach(d => {
      if (!d.avatars) {
        console.log('avatar download error', m.name)
      } else {
        let url = d.avatars['small'] || d.avatars.large || d.avatars.medium
        if (typeof url === 'string') {
          let name = `${d.name}.png`
          d.avatars = name
          download(url, './avatars', name)
        }
      }
    })
    casts.forEach(d => {
      if (!d.avatars) {
        console.log('casts download error', m.name)
      } else {
        let url = d.avatars['small'] || d.avatars.large || d.avatars.medium
        if (typeof url === 'string') {
          let name = `${d.name}.png`
          d.avatars = name
          download(url, './avatars', name)
        }
      }
    })
    delete m.subject.rating
    delete m.subject.collect_count
    delete m.subject.subtype
    delete m.subject.images
  }
})
setTimeout(() => {
  console.log(movies[1].subject.directors)
  persist(movies)
}, 10 * 1000)
