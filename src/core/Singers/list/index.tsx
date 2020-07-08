import React from 'react'
import { singerStateType } from '@/store/modules/Singers/data'
import style from './index.module.scss'

function List({singerList}: singerStateType) {
  return (
    <div className={style['list']}>
        {singerList.map(item => {
          return (
            <div className={style['list-item']} key={item.id}>
              <div className={style["img-wrapper"]}>
                <img
                  src={`${item.picUrl}?param=300x300`}
                  width="100%"
                  height="100%"
                  alt="music"
                />
              </div>
              <span className={style["name"]}>{item.name}</span>
            </div>
          )
        })}
      </div>
  )
}
export default React.memo(List)