export interface bannerType {
  imageUrl: string
  url: string
}
export interface recommendType {
  id: string
  name: string
  picUrl: string
  trackCount: number
  playCount: number
}

export interface recommendStateType {
  bannerList: bannerType[]
  recommendList: recommendType[]
  enterLoading: boolean
}