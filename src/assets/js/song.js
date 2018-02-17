import api from '../../api/index'
export default class Song {
  constructor ({ id, songName, albumName, singerName, picUrl, duration, url, alias }) {
    this.id = id
    this.songName = songName
    this.albumName = albumName
    this.picUrl = picUrl
    this.duration = duration
    this.singerName = singerName
    this.alias = alias
  }

  getLyric () {
    if (this.lyric) {
      return Promise.resolve(this.lyric)
    }
    return new Promise((resolve, reject) => {
      getLyric(this.id).then((res) => {
        if (res.code === 200) {
          this.lyric = res.lrc.lyric
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
    duration: data.dt,
    singerName: filterSinger(data.ar),
    alias: ''
  })
}

export function createNewSong (data) {
  return new Song({
    id: data.id,
    songName: data.name,
    albumName: data.song.album.name,
    picUrl: data.song.album.blurPicUrl,
    duration: data.song.duration,
    singerName: filterSinger(data.song.artists),
    alias: data.song.alias
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

function filterSinger (singer) {
  let ret = []
  if (!singer) {
    return ''
  }
  singer.forEach((s) => {
    ret.push(s.name)
  })
  return ret.join(' / ')
}
