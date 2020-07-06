import React from 'react'
import style from './index.module.scss'
import { NavLink } from 'react-router-dom'
import SvgIcon from '@/components/SvgIcon'

export default function Tabbar() {
  return (
    <div className={style['tabbar']}>
      <NavLink to="/recommend" activeClassName={style['selected']}>
        <div className={style['tabbar-item']}>
          <SvgIcon iconClass="netease-logo" className={style['tabbar-icon']} />
          <span>推荐</span>
        </div>
      </NavLink>
      <NavLink to="/singers" activeClassName={style['selected']}>
        <div className={style['tabbar-item']}>
          <SvgIcon iconClass="singer" className={style['tabbar-icon']} />
          <span>歌手</span>
        </div>
      </NavLink>
      <NavLink to="/rank" activeClassName={style['selected']}>
        <div className={style['tabbar-item']}>
          <SvgIcon iconClass="rank" className={style['tabbar-icon']} />
          <span>排行榜</span>
        </div>
      </NavLink>
    </div>
  )
}
