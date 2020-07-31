import React, { useCallback, useEffect, useRef } from 'react'
import Horizen from '@/components/Horizen'
import { useSelector, useDispatch } from 'react-redux'
import { categoryTypes, singerTypes, alphaTypes } from '@/api/config'
import Scroll from '@/components/Scroll'
import Loading from '@/components/Loading'
import style from './index.module.scss'
import List from './list'
import { storeType } from '@/store/data'
import { getSingerListRequest } from '@/api/singer'
import * as actionTypes from '@/store/modules/Singers/actionCreators'
import { scrollFunc } from '@/components/Scroll/data.d'
import { forceCheck } from 'react-lazyload'
import { renderRoutes, RouteConfigComponentProps } from 'react-router-config'

function Singers({ route }: RouteConfigComponentProps) {
  const scrollRef = useRef<scrollFunc>(null)
  // eslint-disable-next-line
  const category = useSelector((state: storeType) => state.singers.category!)
  const singerType = useSelector(
    // eslint-disable-next-line
    (state: storeType) => state.singers.singerType!,
  )
  // eslint-disable-next-line
  const alpha = useSelector((state: storeType) => state.singers.alpha!)

  const handleUpdateCategory = (val: string) => {
    if (category === val) return
    dispatch(actionTypes.changeCategory(val))
    dispatchSingerListData(val, alpha, singerType, offset)
    // eslint-disable-next-line
    scrollRef.current!.refresh()
  }
  const handleUpdateSingerType = (val: string) => {
    if (singerType === val) return
    dispatch(actionTypes.changeSingerType(val))
    dispatchSingerListData(category, alpha, val, offset)
    // eslint-disable-next-line
    scrollRef.current!.refresh()
  }
  const handleUpdateAlpha = (val: string) => {
    if (alpha === val) return
    dispatch(actionTypes.changeAlpha(val))
    dispatchSingerListData(category, val, singerType, offset)
    // eslint-disable-next-line
    scrollRef.current!.refresh()
  }

  const singerList = useSelector((state: storeType) => state.singers.singerList)
  const enterLoading = useSelector(
    (state: storeType) => state.singers.enterLoading,
  )
  // eslint-disable-next-line
  const offset = useSelector((state: storeType) => state.singers.offset!)

  const dispatch = useDispatch()

  const dispatchSingerListData = useCallback(
    (category, alpha, singerType, offset) => {
      getSingerListRequest(category, alpha, singerType, offset)
        .then((data: any) => {
          dispatch(actionTypes.changeSingerList([...data.artists]))
          dispatch(actionTypes.changeEnterLoading(false))
          dispatch(actionTypes.changeOffset(0))
          // eslint-disable-next-line
          forceCheck()
        })
        .catch(() => {
          console.log('歌手数据获取失败！')
        })
    },
    [dispatch],
  )

  const dispatchRefreshSingerListData = useCallback(
    (category, alpha, singerType, offset) => {
      getSingerListRequest(category, alpha, singerType, offset)
        .then((data: any) => {
          const list: any = [...singerList, ...data.artists]
          dispatch(actionTypes.changeSingerList(list))
          dispatch(actionTypes.changeOffset(list.length))
          // eslint-disable-next-line
          scrollRef.current!.refresh()
        })
        .catch((err) => {
          console.log(err)

          console.log('歌手数据获取失败！')
        })
    },
    [dispatch, singerList],
  )

  // 上拉加载
  const handlePullUp = () => {
    dispatchRefreshSingerListData(category, alpha, singerType, offset)
  }

  useEffect(() => {
    if (!singerList.length) {
      dispatchSingerListData(category, alpha, singerType, offset)
    }
    // eslint-disable-next-line
  }, [])

  return (
    <>
      <div className={style['horizen-wrapper']}>
        <Horizen
          list={alphaTypes}
          handleClick={handleUpdateAlpha}
          currentVal={alpha}
          marginBottom={10}
        />
        <Horizen
          list={categoryTypes}
          handleClick={handleUpdateCategory}
          currentVal={category}
          marginBottom={10}
        />
        <Horizen
          list={singerTypes}
          handleClick={handleUpdateSingerType}
          currentVal={singerType}
        />
      </div>
      <div style={{ height: 'calc(100% - 130px)' }}>
        <Scroll
          ref={scrollRef}
          onScroll={forceCheck}
          pullUpLoading={true}
          pullUp={handlePullUp}
        >
          <div style={{ padding: '10px' }}>
            <List singerList={singerList} />
          </div>
        </Scroll>
      </div>
      {enterLoading ? <Loading /> : null}
      {
        // eslint-disable-next-line
        renderRoutes(route!.routes)
      }
    </>
  )
}

export default React.memo(Singers)
