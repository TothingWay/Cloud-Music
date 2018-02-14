import api from '../../api/index'
export default class Song {
  constructor ({ id, songName, albumName, picUrl, duration, url }) {
    this.id = id
    this.songName = songName
    this.albumName = albumName
    this.picUrl = picUrl
    this.duration = duration
  }

  getLyric () {
    if (this.lyric) {
      return Promise.resolve(this.lyric)
    }
    return new Promise((resolve, reject) => {
      getLyric(this.id).then((res) => {
        if (res.code === 200) {
          this.lyric = res.lrc.lyric
          console.log(this.lyric)
          resolve(this.lyric)
        }
      })
    })
  }
}

export function createSong (data) {
  return new Song({
    id: data.id,
    songName: data.name,
    albumName: data.al.name,
    picUrl: data.al.picUrl,
    duration: data.dt
  })
}

function getLyric (id) {
  return api.getMusiclyric(id)
    .then((res) => {
      if (res.data.code === 200) {
        return Promise.resolve(res.data)
      }
    })
    .catch((err) => {
      console.log(err)
    })
}
