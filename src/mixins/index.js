/**
 * Created by LIZHEN2@wps.cn on 2017/11/25.
 */

export default {
  computed: {
    subject () {
      return this.movie.subject || {genres: []}
    }
  },
  methods: {
    _to (movie = this.movie) {
      return {name: 'View', params: {id: movie.id, title: movie.name}}
    }
  }
}
