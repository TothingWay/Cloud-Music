import React, { useState, useEffect } from 'react'
import style from './index.module.scss'
import { NavLink } from 'react-router-dom'
import SvgIcon from '@/components/SvgIcon'

export default function Tabbar() {
  const device = window.devicePixelRatio && window.devicePixelRatio === 3 && window.screen.width === 375 && testUA('iPhone')
  function testUA (str: string) {
    return navigator.userAgent.indexOf(str) > -1
  }
  const [isIphoneX, setIsIphoneX] = useState<boolean>()
  useEffect(()=>{
    if (device) {
      setIsIphoneX(true)
    } else {
      setIsIphoneX(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <div className={`${style['tabbar']} ${isIphoneX ? style['isIphoneX'] : ''}`}>
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
