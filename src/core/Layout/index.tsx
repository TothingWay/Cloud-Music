import React from 'react'
import { renderRoutes, RouteConfigComponentProps } from 'react-router-config'
import SvgIcon from '@/components/SvgIcon'
import style from './index.module.scss'

function Layout({ route }: RouteConfigComponentProps) {
  return (
    <div>
      <div className={`${style['header']}`}>Cloud Music</div>
      <SvgIcon iconClass="user" />
      {renderRoutes(route!.routes)}
    </div>
  )
}

export default React.memo(Layout)
