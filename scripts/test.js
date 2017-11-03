let movies = require('./movies.json')
console.log(movies.length)
movies = movies.filter(m => !m.subject || !m.short)
console.log(movies.length)
