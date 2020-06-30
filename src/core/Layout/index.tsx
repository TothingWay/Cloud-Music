import React from 'react'
import { renderRoutes, RouteConfigComponentProps } from 'react-router-config'
// import SvgIcon from '@/components/SvgIcon'
import style from './index.module.scss'
// import NeteaseStroke from '@/components/Loading/neteaseStroke'

function Layout({ route }: RouteConfigComponentProps) {
  return (
    <div>
      <div className={`${style['header']}`}>Cloud Music</div>
      {/* <SvgIcon iconClass="user" /> */}
      {/* <NeteaseStroke strokeDashoffset={0}></NeteaseStroke> */}
      {renderRoutes(route!.routes)}
    </div>
  )
}

export default React.memo(Layout)
