import React, { useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { storeType } from '@/store/data.d'
import style from './index.module.scss'
import { tracksListType, rankListType } from '@/store/modules/Rank/data'
import Scroll from '@/components/Scroll'
import * as actionTypes from '@/store/modules/Rank/actionCreators'
import { getRankListRequest } from '@/api/rank'
import Loading from '@/components/Loading'
import { filterIndex } from '@/utils'

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

  const renderRankList = (list: rankListType[]) => {
    return (
      <ul className={style['list']}>
        {list.map((item) => {
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
    )
  }

  useEffect(() => {
    if (!rankList.length) {
      dispatchRankListData()
    }
    // eslint-disable-next-line
  }, [])

  let globalStartIndex = filterIndex(rankList)
  let officialList = rankList.slice(0, globalStartIndex)
  let globalList = rankList.slice(globalStartIndex)
  let displayStyle = loading ? { display: 'none' } : { display: '' }

  return (
    <div style={{ height: '100%' }}>
      <Scroll>
        <div style={{ padding: '7px' }}>
          <h1 style={displayStyle} className={style['offical']}>
            官方榜
          </h1>
          {renderRankList(officialList)}
          <h1 style={displayStyle} className={style['global']}>
            全球榜
          </h1>
          {renderRankList(globalList)}
        </div>
      </Scroll>
      {loading ? <Loading /> : null}
    </div>
  )
}

export default React.memo(Rank)
