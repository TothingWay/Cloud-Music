import storage from 'good-storage'

const searchKey = '__search__'
const searchMaxLength = 15

const collectKey = '__collect__'
const collectMaxLength = 200

function insertArr (arr, val, compare, maxLength) {
  const index = arr.findIndex(compare)
  if (index === 0) {
    return
  }
  if (index > 0) {
    arr.splice(index, 1)
  }
  arr.unshift(val)
  if (maxLength && arr.length > maxLength) {
    arr.pop()
  }
}

function deleteArr (arr, compare) {
  const index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
}

export function saveSearch (keywords) {
  let searches = storage.get(searchKey, [])
  insertArr(searches, keywords, (item) => {
    return item === keywords
  }, searchMaxLength)
  storage.set(searchKey, searches)
  return searches
}

export function loadSearch () {
  return storage.get(searchKey, [])
}

export function deleteSearch (keywords) {
  let searches = storage.get(searchKey, [])
  deleteArr(searches, (item) => {
    return item === keywords
  })
  storage.set(searchKey, searches)
  return searches
}

export function saveCollect (song) {
  let songs = storage.get(collectKey, [])
  insertArr(songs, song, (item) => {
    return song.id === item.id
  }, collectMaxLength)
  storage.set(collectKey, songs)
  return songs
}

export function deleteCollect (song) {
  let songs = storage.get(collectKey, [])
  deleteArr(songs, (item) => {
    return song.id === item.id
  })
  storage.set(collectKey, songs)
  return songs
}

export function loadCollect () {
  return storage.get(collectKey, [])
}
