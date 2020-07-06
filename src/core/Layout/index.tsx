import React from 'react'
import { renderRoutes, RouteConfigComponentProps } from 'react-router-config'
import style from './index.module.scss'
import Tabbar from '@/components/Tabbar'

function Layout({ route }: RouteConfigComponentProps) {
  return (
    <div>
      <div className={`${style['header']}`}>Cloud Music</div>
      {renderRoutes(route!.routes)}
      <Tabbar/>
    </div>
  )
}

export default React.memo(Layout)
