export interface tracksListType {
  first: string
  second: string
}

export interface rankListType {
  id: number
  coverImgId: number
  tracks: tracksListType[]
  name: string
  coverImgUrl: string
  updateFrequency: string
}

export interface rankStateType {
  rankList: rankListType[]
  loading?: boolean
}
