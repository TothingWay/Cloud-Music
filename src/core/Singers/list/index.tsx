import React from 'react'
import { singersStateType } from '@/store/modules/Singers/data'
import style from './index.module.scss'
import LazyLoad from 'react-lazyload'
import { withRouter, RouteComponentProps } from 'react-router'

function List({ singerList, history }: singersStateType & RouteComponentProps) {
  const enterDetail = (id: number) => {
    history.push(`/singers/${id}`)
  }

  return (
    <div className={style['list']}>
      {singerList.map((item, index) => {
        return (
          <div
            className={style['list-item']}
            key={index}
            onClick={() => enterDetail(item.id)}
          >
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
export default React.memo(withRouter(List))
