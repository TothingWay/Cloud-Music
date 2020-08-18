import React, { useState, useEffect } from 'react'
import { renderRoutes, RouteConfigComponentProps } from 'react-router-config'
import style from './index.module.scss'
import Tabbar from '@/components/Tabbar'
import Player from '@/core/Player'
import { isIphoneXDevice } from '@/utils/index'
import MiniPlayer from '@/core/Player/miniPlayer'
import { storeType } from '@/store/data'
import { useSelector } from 'react-redux'

function Layout({ route }: RouteConfigComponentProps) {
  const [isIphoneX, setIsIphoneX] = useState<boolean>(false)

  const fullScreen = useSelector((state: storeType) => state.player.fullScreen)
  const currentSong = useSelector(
    (state: storeType) => state.player.currentSong,
  )
  const percent = useSelector((state: storeType) => state.player.percent)

  useEffect(() => {
    if (isIphoneXDevice()) {
      setIsIphoneX(true)
    } else {
      setIsIphoneX(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div>
      <div className={`${style['header']}`}>
        <span>Cloud Music</span>
        {currentSong.id ? (
          <MiniPlayer
            song={currentSong}
            fullScreen={fullScreen}
            radius={30}
            percent={percent}
          />
        ) : null}
      </div>
      <div
        style={{
          height: isIphoneX ? 'calc(100vh - 138px)' : 'calc(100vh - 104px)',
        }}
      >
        {
          // eslint-disable-next-line
          renderRoutes(route!.routes)
        }
      </div>
      <Tabbar isIphoneX={isIphoneX} />
      <Player />
    </div>
  )
}

export default React.memo(Layout)
