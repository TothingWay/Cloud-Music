import React, { useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { storeType } from '@/store/data.d'
import style from './index.module.scss'
import { tracksListType } from '@/store/modules/Rank/data'
import Scroll from '@/components/Scroll'
import * as actionTypes from '@/store/modules/Rank/actionCreators'
import { getRankListRequest } from '@/api/rank'
import Loading from '@/components/Loading'

function Rank() {
  const rankList = useSelector((state: storeType) => state.rank.rankList)

  const loading = useSelector((state: storeType) => state.rank.loading)

  const dispatch = useDispatch()

  const dispatchRankListData = useCallback(() => {
    getRankListRequest()
      .then((data: any) => {
        dispatch(actionTypes.changeRankList(data.list))
        dispatch(actionTypes.changeLoading(false))
      })
      .catch(() => {
        console.log('轮播图数据传输错误')
      })
  }, [dispatch])

  const renderSongList = (list: tracksListType[]) => {
    return list.length ? (
      <ul className={style['song-list']}>
        {list.map((item, index) => {
          return (
            <li key={index}>
              {index + 1}. {item.first} - {item.second}
            </li>
          )
        })}
      </ul>
    ) : null
  }

  useEffect(() => {
    if (!rankList.length) {
      dispatchRankListData()
    }
    // eslint-disable-next-line
  }, [])

  return (
    <div style={{ height: '100%' }}>
      <Scroll>
        <div style={{ padding: '7px' }}>
          <ul className={style['list']}>
            {rankList.map((item) => {
              return (
                <li className={style['list-item']} key={item.id}>
                  <div className={style['img-wrapper']}>
                    <img src={item.coverImgUrl} alt="img" />
                    <div className={style['decorate']}></div>
                    <span className={style['update-frequecy']}>
                      {item.updateFrequency}
                    </span>
                  </div>
                  {renderSongList(item.tracks)}
                </li>
              )
            })}
          </ul>
        </div>
      </Scroll>
      {loading ? <Loading /> : null}
    </div>
  )
}

export default React.memo(Rank)
