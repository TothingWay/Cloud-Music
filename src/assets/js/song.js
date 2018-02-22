import api from '../../api/index'
export default class Song {
  constructor ({ id, songName, albumName, singerName, picUrl, duration, alias, musicUrl }) {
    this.id = id
    this.songName = songName
    this.albumName = albumName
    this.picUrl = picUrl
    this.duration = duration
    this.singerName = singerName
    this.musicUrl = musicUrl || ''
    this.alias = alias
  }

  getLyric () {
    if (this.lyric) {
      return Promise.resolve(this.lyric)
    }
    return new Promise((resolve, reject) => {
      getLyric(this.id).then((res) => {
        if (res.code === 200) {
          if (res.lrc && res.lrc.lyric) {
            this.lyric = res.lrc.lyric
          } else {
            this.lyric = ''
          }
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
    singerName: filterSinger(data.ar)
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
export function createSearchSong (data) {
  return new Song({
    id: data.id,
    songName: data.name,
    albumName: data.album.name,
    picUrl: `//music.163.com/api/img/blur/${data.album.picId}`,
    duration: data.duration,
    singerName: filterSinger(data.artists),
    alias: data.alias
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
