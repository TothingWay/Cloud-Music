import React, { useState, useEffect } from 'react'
import { renderRoutes, RouteConfigComponentProps } from 'react-router-config'
import style from './index.module.scss'
import Tabbar from '@/components/Tabbar'
import { isIphoneXDevice } from '@/utils/index'

function Layout({ route }: RouteConfigComponentProps) {
  const [isIphoneX, setIsIphoneX] = useState<boolean>(false)
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
      <div className={`${style['header']}`}>Cloud Music</div>
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
    </div>
  )
}

export default React.memo(Layout)
