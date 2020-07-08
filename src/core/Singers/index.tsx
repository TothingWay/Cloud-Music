import React, { useCallback, useEffect, useRef } from 'react'
import Horizen from '@/components/Horizen'
import { useSelector, useDispatch } from 'react-redux'
import { categoryTypes, singerTypes, alphaTypes } from '@/api/config'
import Scroll from '@/components/Scroll'
import style from './index.module.scss'
import List from './list'
import { storeType } from '@/store/data'
import { getSingerListRequest } from '@/api/singer'
import * as actionTypes from '@/store/modules/Singers/actionCreators'
import { scrollFunc } from '@/components/Scroll/data.d'

function Singers() {
  const scrollRef = useRef<scrollFunc>(null)

  /* const [category, setCategory] = useState('1001')
  const [singerType, setSingerType] = useState('-1')
  const [alpha, setalpha] = useState('') */
  const category = useSelector((state: storeType) => state.singers.category!)
  const singerType = useSelector((state: storeType) => state.singers.singerType!)
  const alpha = useSelector((state: storeType) => state.singers.alpha!)

  const handleUpdateCategory = (val: string) => {
    if (category === val) return
    dispatch(actionTypes.changeCategory(val))
    dispatchSingerListData(val, alpha, singerType, offset)
    scrollRef.current!.refresh()
  }
  const handleUpdateSingerType = (val: string) => {
    if (singerType === val) return
    dispatch(actionTypes.changeSingerType(val))
    dispatchSingerListData(category, alpha, val, offset)
    scrollRef.current!.refresh()
  }
  const handleUpdateAlpha = (val: string) => {
    if (alpha === val) return
    dispatch(actionTypes.changeAlpha(val))
    dispatchSingerListData(category, val, singerType, offset)
    scrollRef.current!.refresh()
  }

  const singerList = useSelector((state: storeType) => state.singers.singerList)
  const offset = useSelector((state: storeType) => state.singers.offset!)

  const dispatch = useDispatch()

  const dispatchSingerListData = useCallback((category, alpha, singerType, offset) => {
    getSingerListRequest(category, alpha, singerType, offset)
      .then((data: any) => {
        dispatch(actionTypes.changeSingerList(data.artists))
        dispatch(actionTypes.changeEnterLoading(false))
        dispatch(actionTypes.changePullUpLoading(false))
        dispatch(actionTypes.changeOffset(0))
      })
      .catch(() => {
        console.log('歌手数据获取失败')
      })
  }, [dispatch])


  const dispatchRefreshSingerListData = useCallback(() => {
    getSingerListRequest(category, alpha, singerType, offset)
      .then((data: any) => {
        const list: any = [...singerList, ...data.artists]
        dispatch(actionTypes.changeSingerList(list))
        dispatch(actionTypes.changePullUpLoading(false))
        dispatch(actionTypes.changeOffset(list.length))
      })
      .catch(() => {
        console.log('歌手数据获取失败')
      })
  }, [alpha, category, dispatch, offset, singerList, singerType])

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
          list={categoryTypes}
          handleClick={handleUpdateCategory}
          currentVal={category}
          marginBottom={10}
        />
        <Horizen
          list={singerTypes}
          handleClick={handleUpdateSingerType}
          currentVal={singerType}
          marginBottom={10}
        />
        <Horizen
          list={alphaTypes}
          handleClick={handleUpdateAlpha}
          currentVal={alpha}
        />
      </div>
      <div style={{ height: 'calc(100% - 130px)' }}>
        <Scroll ref={scrollRef}>
          <div style={{ padding: '10px' }}>
            <List singerList={singerList} />
          </div>
        </Scroll>
      </div>
    </>
  )
}

export default React.memo(Singers)
