import React, { useRef, useEffect, useCallback } from 'react'
import Scroll from '@/components/Scroll'
import Slide from '@/components/Slide'
import { useSelector, useDispatch } from 'react-redux'
import List from './list'
import { storeType } from '@/store/data.d'
import { getBannerListRequest, getRecommendListRequest } from '@/api/recommend'
import * as actionTypes from '@/store/modules/Recommend/actionCreators'
import { forceCheck } from 'react-lazyload'
import Loading from '@/components/Loading'
import { scrollFunc } from '@/components/Scroll/data.d'

function Recommend() {
  const recommendList = useSelector(
    (state: storeType) => state.recommend.recommendList
  )
  const bannerList = useSelector(
    (state: storeType) => state.recommend.bannerList
  )

  const enterLoading = useSelector(
    (state: storeType) => state.recommend.enterLoading
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
        dispatch(actionTypes.changeEnterLoading(false))
      })
      .catch(() => {
        console.log('推荐歌单数据传输错误')
      })
  }, [dispatch])

  const ref = useRef<scrollFunc>(null)

  const handlePullDown = (pos: any) => {
    setTimeout(() => {
      console.log('数据已刷新')
      const scrollRef = ref.current!
      scrollRef.finishPullDown()
      scrollRef.refresh()
    }, 1000)
  }

  useEffect(() => {
    if (!bannerList.length) {
      dispatchBannerData()
    }
    if (!recommendList.length) {
      dispatchRecommendListData()
    }
    // eslint-disable-next-line
  }, [])

  return (
    <div style={{height: '100%'}}>
      <Scroll
        ref={ref}
        pullDownLoading={true}
        pullDown={handlePullDown}
        onScroll={forceCheck}
      >
        <div style={{padding: '10px'}}>
          {bannerList.length ? <Slide slideBanner={bannerList} /> : null}
          <List recommendList={recommendList} />
        </div>
      </Scroll>
      {enterLoading ? <Loading /> : null}
    </div>
  )
}

export default React.memo(Recommend)
