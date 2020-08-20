import React, {
  memo,
  useState,
  useRef,
  useCallback,
  useMemo,
  useEffect,
} from 'react'
import { withRouter, RouteComponentProps } from 'react-router'
import style from './index.module.scss'
import '@/styles/global.scss'
import SvgIcon from '@/components/SvgIcon'
import { debounce, getName } from '@/utils'
import { useSelector, useDispatch } from 'react-redux'
import {
  getHotKeyWordsRequest,
  getSuggestListRequest,
  getResultSongsListRequest,
} from '@/api/search'
import { getSongDetailRequest } from '@/api/player'
import * as actionTypes from '@/store/modules/Search/actionCreators'
import * as actionPlayerTypes from '@/store/modules/Player/actionCreators'
import { storeType } from '@/store/data'
import Scroll from '@/components/Scroll'
import LazyLoad, { forceCheck } from 'react-lazyload'
import Loading from '@/components/Loading'

function Search(props: RouteComponentProps<any>) {
  const [isFocus, setIsFocus] = useState(false)
  const [query, setQuery] = useState('')
  const queryRef = useRef<HTMLInputElement>(null)

  const dispatch = useDispatch()

  const hotList = useSelector((state: storeType) => state.search.hotList)
  const songsList = useSelector((state: storeType) => state.search.songsList)
  const suggestList = useSelector(
    (state: storeType) => state.search.suggestList,
  )
  const enterLoading = useSelector(
    (state: storeType) => state.search.enterLoading,
  )

  const getHotKeyWordsDispatch = useCallback(() => {
    getHotKeyWordsRequest().then((data: any) => {
      dispatch(actionTypes.changeHotKeyWords(data.result.hots))
    })
  }, [dispatch])

  const getSuggestListDispatch = useCallback(
    (query) => {
      getSuggestListRequest(query).then((data: any) => {
        if (!data) return
        const res = data.result || []
        dispatch(actionTypes.changeSuggestList(res))
      })
      getResultSongsListRequest(query).then((data: any) => {
        if (!data) return
        const res = data.result.songs || []
        dispatch(actionTypes.changeResultSongs(res))
        dispatch(actionTypes.changeEnterLoading(false))
      })
    },
    [dispatch],
  )

  const getSongDetailDispatch = useCallback(
    (id) => {
      getSongDetailRequest(id).then((data: any) => {
        const song = data.songs[0]
        dispatch(actionPlayerTypes.insertSong(song))
      })
    },
    [dispatch],
  )

  const changeEnterLoadingDispatch = useCallback(
    (state) => {
      dispatch(actionTypes.changeEnterLoading(state))
    },
    [dispatch],
  )

  const handleFocus = useCallback(() => {
    queryRef.current?.focus()
    setIsFocus(true)
  }, [])

  const handleQuery = useCallback(
    (q: string) => {
      setQuery(q)
      if (!q) return
      changeEnterLoadingDispatch(true)
      getSuggestListDispatch(q)
    },
    [changeEnterLoadingDispatch, getSuggestListDispatch],
  )

  const handleQueryDebounce: (q: string) => void = useMemo(() => {
    return debounce(handleQuery, 500)
  }, [handleQuery])

  const handleChange = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    setQuery(e.currentTarget.value)
  }, [])

  const clearQuery = useCallback((e: any) => {
    e.preventDefault()
    setQuery('')
    queryRef.current?.focus()
  }, [])

  const handleBlur = useCallback(
    (e: any) => {
      if (query) {
        return
      } else {
        setIsFocus(false)
      }
    },
    [query],
  )

  useEffect(() => {
    if (query) {
      setIsFocus(true)
    }
  }, [query])

  useEffect(() => {
    // 注意防抖
    handleQueryDebounce(query)
  }, [handleQueryDebounce, query])

  useEffect(() => {
    if (!hotList.length) getHotKeyWordsDispatch()
    // eslint-disable-next-line
  }, []);

  const renderHotKey = () => {
    const list = hotList ? hotList : []
    return (
      <ul className={style['hot-key-list']}>
        {list.map((item: any) => {
          return (
            <li
              className={style['item']}
              key={item.first}
              onClick={() => setQuery(item.first)}
            >
              <span>{item.first}</span>
            </li>
          )
        })}
      </ul>
    )
  }

  const renderSingers = () => {
    const singers = suggestList.artists
    if (!singers || !singers.length) return
    return (
      <div className={style['list']}>
        <h1 className={style['title']}>相关歌手</h1>
        {singers.map((item: any, index: number) => {
          return (
            <div
              className={style['list-item']}
              key={item.accountId + '' + index}
              onClick={() => props.history.push(`/singers/${item.id}`)}
            >
              <div className={style['img-wrapper']}>
                <LazyLoad
                  placeholder={
                    <img
                      width="100%"
                      height="100%"
                      src={require('@/assets/singer.png')}
                      alt="singer"
                    />
                  }
                >
                  <img
                    src={item.picUrl}
                    width="100%"
                    height="100%"
                    alt="music"
                  />
                </LazyLoad>
              </div>
              <span className={style['name']}>歌手: {item.name}</span>
            </div>
          )
        })}
      </div>
    )
  }

  const renderAlbum = () => {
    const albums = suggestList.playlists
    if (!albums || !albums.length) return
    return (
      <div className={style['list']}>
        <h1 className={style['title']}>相关歌单</h1>
        {albums.map((item: any, index: number) => {
          return (
            <div
              className={style['list-item']}
              key={item.accountId + '' + index}
              onClick={() => props.history.push(`/album/${item.id}`)}
            >
              <div className={style['img-wrapper']}>
                <LazyLoad
                  placeholder={
                    <img
                      width="100%"
                      height="100%"
                      src={require('@/assets/playlist-placeholder.png')}
                      alt="music"
                    />
                  }
                >
                  <img
                    src={item.coverImgUrl}
                    width="100%"
                    height="100%"
                    alt="music"
                  />
                </LazyLoad>
              </div>
              <span className={style['name']}>歌单: {item.name}</span>
            </div>
          )
        })}
      </div>
    )
  }

  const selectItem = (id: number) => {
    getSongDetailDispatch(id)
  }

  const renderSongs = () => {
    return (
      <div className={style['song-item']} style={{ paddingLeft: '20px' }}>
        {songsList.map((item: any) => {
          return (
            <li key={item.id} onClick={() => selectItem(item.id)}>
              <div className={style['info']}>
                <span>{item.name}</span>
                <span>
                  {getName(item.artists)} - {item.album.name}
                </span>
              </div>
            </li>
          )
        })}
      </div>
    )
  }

  return (
    <div className={style['container']}>
      <div className={style['search-wrapper']}>
        {!isFocus && (
          <div
            className={`${style['placeholder']} ${
              isFocus ? style['focus'] : ''
            }`}
            onClick={handleFocus}
          >
            <SvgIcon iconClass="search" className={`${style['search-icon']}`} />
            <span>搜索</span>
          </div>
        )}
        {isFocus && (
          <SvgIcon
            iconClass="search"
            className={`${style['search-focus-icon']}`}
          />
        )}
        <input
          ref={queryRef}
          type="text"
          className={style['search-input']}
          onFocus={() => setIsFocus(true)}
          onBlur={handleBlur}
          value={query}
          onChange={handleChange}
        />
        {query && (
          <SvgIcon
            iconClass="close"
            className={style['close-icon']}
            onClick={clearQuery}
          />
        )}
      </div>

      <div
        style={query ? { display: 'none' } : { display: 'block' }}
        className={style['shortcut-wrapper']}
      >
        <Scroll>
          <div>
            <div className={style['hot-key']}>
              <h1 className={style['title']}>热门搜索</h1>
              {renderHotKey()}
            </div>
          </div>
        </Scroll>
      </div>

      <div
        style={!query ? { display: 'none' } : { display: 'block' }}
        className={style['shortcut-wrapper']}
      >
        <Scroll onScroll={forceCheck}>
          <div>
            {renderSingers()}
            {renderAlbum()}
            {renderSongs()}
          </div>
        </Scroll>
      </div>
      {enterLoading ? <Loading /> : null}
    </div>
  )
}

export default memo(withRouter(Search))
