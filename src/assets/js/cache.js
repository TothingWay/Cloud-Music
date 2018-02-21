import storage from 'good-storage'

const searchKey = '__search__'
const searchMaxLength = 15

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
