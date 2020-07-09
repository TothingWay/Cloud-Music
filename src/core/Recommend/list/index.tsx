import React from 'react'
import { calculateCount } from '@/utils'
import SvgIcon from '@/components/SvgIcon'
import style from './index.module.scss'
import { recommendType } from '@/store/modules/Recommend/data.d'
import LazyLoad from 'react-lazyload'

type ListProps = {
  recommendList: Array<recommendType>
}

function List({ recommendList }: ListProps) {
  return (
    <div className={style['list-wrapper']}>
      <h1 className={style['title']}>推荐歌单</h1>
      <div className={style['list']}>
        {recommendList.map((item) => {
          return (
            <div className={style['list-item']} key={item.id}>
              <div className={style['img-wrapper']}>
                <div className={style['decorate']}></div>
                <LazyLoad
                  placeholder={
                    <img
                      width="100%"
                      height="100%"
                      src={require('@/assets/singer.png')}
                      alt="singer"
                    />
                  }
                >
                  <img
                    src={item.picUrl + '?param=300x300'}
                    width="100%"
                    height="100%"
                    alt="singer"
                  />
                </LazyLoad>
                <div className={style['play-count']}>
                  <SvgIcon iconClass="play" className={style['icon-play']} />
                  <span className={style['count']}>
                    {calculateCount(item.playCount)}
                  </span>
                </div>
              </div>
              <div className={style['desc']}>{item.name}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default React.memo(List)
