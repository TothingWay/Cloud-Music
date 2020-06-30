import React from 'react'
import style from './index.module.scss'

function Loading() {
  return (
    <div className={style['loading']}>
      <div></div>
      <div></div>
    </div>
  )
}

export default React.memo(Loading)
