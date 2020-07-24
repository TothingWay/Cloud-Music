import React, { memo, useState, useCallback, useEffect } from 'react'
import { RouteComponentProps, withRouter } from 'react-router'
import { useSelector, useDispatch } from 'react-redux'
import style from './index.module.scss'
import '@/styles/global.scss'
import { CSSTransition } from 'react-transition-group'
import Header from '@/components/Header'
import Scroll from '@/components/Scroll'
import AlbumDetail from './albumDetail'
import { storeType } from '@/store/data'
import { getAlbumDetailRequest } from '@/api/album'
import * as actionTypes from '@/store/modules/Album/actionCreators'
import Loading from '@/components/Loading'

const HEADER_HEIGHT = 45

export default memo(
  withRouter(function Album(props: RouteComponentProps<any>) {
    const { history, match } = props
    const [showStatus, setShowStatus] = useState(true)
    const [isMarquee, setIsMarquee] = useState(false)
    const [title, setTitle] = useState('歌单')

    const dispatch = useDispatch()

    const currentAlbum = useSelector(
      (state: storeType) => state.album.currentAlbum
    )

    const enterLoading = useSelector(
      (state: storeType) => state.album.enterLoading
    )
      
    const dispatchAlbumData = useCallback(() => {
      getAlbumDetailRequest(match.params.id)
        .then((data: any) => {
          dispatch(actionTypes.changeCurrentAlbum(data.playlist))
          dispatch(actionTypes.changeEnterLoading(false))
        })
        .catch(() => {
          console.log('获取歌单数据失败！')
        })
    }, [dispatch, match.params.id])

    useEffect(() => {
      dispatchAlbumData()
    }, [dispatchAlbumData])

    const handleBack = useCallback(() => {
      setShowStatus(false)
    }, [])

    const onScroll = useCallback(
      (pos) => {
        let minScrollY = -HEADER_HEIGHT
        // 滑过顶部的高度开始变化
        if (pos.y < minScrollY) {
          setTitle(currentAlbum.name)
          setIsMarquee(true)
        } else {
          setTitle('歌单')
          setIsMarquee(false)
        }
      },
      [currentAlbum.name]
    )

    const onExited = useCallback(
      () => {
        dispatch(actionTypes.changeCurrentAlbum({} as any))
        history.goBack()
      },
      [dispatch, history]
    )

    return (
      <CSSTransition
        in={showStatus}
        timeout={300}
        classNames="fly"
        appear={true}
        unmountOnExit
        onExited={onExited}
      >
        <div className={style['album']}>
          <Header
            title={title}
            handleClick={handleBack}
            isMarquee={isMarquee}
          />
          <Scroll bounceTop={false} onScroll={onScroll}>
            <AlbumDetail currentAlbum={currentAlbum} />
          </Scroll>
          {enterLoading ? <Loading /> : null}
        </div>
      </CSSTransition>
    )
  })
)
