import React, { memo } from 'react'
import style from './more.module.scss'

export default memo(function more() {
  return (
    <div className={style['loading']}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <span>拼命加载中...</span>
    </div>
  )
})
