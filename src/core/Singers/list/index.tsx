import React from 'react'
import { singerStateType } from '@/store/modules/Singers/data'
import style from './index.module.scss'
import LazyLoad from 'react-lazyload'

function List({ singerList }: singerStateType) {
  return (
    <div className={style['list']}>
      {singerList.map((item) => {
        return (
          <div className={style['list-item']} key={item.id}>
            <div className={style['img-wrapper']}>
              <LazyLoad
                placeholder={
                  <img
                    width="100%"
                    height="100%"
                    src={require('@/assets/playlist-placeholder.png')}
                    alt="Loading"
                  />
                }
              >
                <img
                  src={`${item.picUrl}?param=300x300`}
                  width="100%"
                  height="100%"
                  alt="music"
                />
              </LazyLoad>
            </div>
            <span className={style['name']}>{item.name}</span>
          </div>
        )
      })}
    </div>
  )
}
export default React.memo(List)
