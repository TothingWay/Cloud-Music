import React from 'react'
import SvgIcon from '@/components/SvgIcon'
import style from './netease.module.scss'

function Netease() {
  return (
    <div className={style['loading']}>
      <div>
        <SvgIcon iconClass="netease-logo" className={style["tabbar-icon"]}/>
      </div>
    </div>
  )
}

export default Netease
