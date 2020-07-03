import React, { useRef, useEffect, useCallback } from 'react'
import Scroll from '@/components/Scroll'
import Slide from '@/components/Slide'
import { useSelector, useDispatch } from 'react-redux'
import List from './list'
import { storeType } from '@/store/data.d'
import { getBannerListRequest, getRecommendListRequest } from '@/api/recommend'
import * as actionTypes from '@/store/modules/Recommend/actionCreators'
// import { renderRoutes } from "react-router-config";

// import { NavLink } from 'react-router-dom';//利用NavLink组件进行路由跳转

interface scrollFunc {
  finishPullDown: Function
  getBScroll: Function
  refresh: Function
}

function Recommend() {
  const recommendList = useSelector(
    (state: storeType) => state.recommend.recommendList
  )
  const bannerList = useSelector(
    (state: storeType) => state.recommend.bannerList
  )

  const dispatch = useDispatch()
  const dispatchBannerData = useCallback(() => {
    getBannerListRequest()
      .then((data: any) => {
        dispatch(actionTypes.changeBannerList(data.banners))
      })
      .catch(() => {
        console.log('轮播图数据传输错误')
      })
  }, [dispatch])
  const dispatchRecommendListData = useCallback(() => {
    getRecommendListRequest()
      .then((data: any) => {
        dispatch(actionTypes.changeRecommendList(data.result))
      })
      .catch(() => {
        console.log('推荐歌单数据传输错误')
      })
  }, [dispatch])

  const ref = useRef(null)

  const handlePullDown = (pos: any) => {
    setTimeout(() => {
      console.log('数据已刷新')
      const scrollRef = ref.current! as scrollFunc
      scrollRef.finishPullDown()
      scrollRef.refresh()
    }, 1000)
  }

  useEffect(() => {
    dispatchBannerData()
    dispatchRecommendListData()
  }, [dispatchBannerData, dispatchRecommendListData])

  return (
    <div style={{ height: 'calc(100vh - 44px)' }}>
      <Scroll ref={ref} pullDownLoading={true} pullDown={handlePullDown}>
        {bannerList.length ? <Slide slideBanner={bannerList} /> : null}
        <List recommendList={recommendList} />
      </Scroll>
    </div>
  )
}

export default React.memo(Recommend)
