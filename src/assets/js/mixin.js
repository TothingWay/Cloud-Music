import { mapGetters } from 'vuex'
export const scrollMixin = {
  computed: {
    ...mapGetters([
      'playlist'
    ])
  },
  mounted () {
    this.handlePlaylist(this.playlist)
  },
  activated () {
    this.handlePlaylist(this.playlist)
  },
  watch: {
    playlist (newValue) {
      this.handlePlaylist(newValue)
    }
  },
  methods: {
    handlePlaylist () {
      throw new Error('Please use handlePlayList method in components.')
    }
  }
}
