import React, { memo } from 'react'
import style from './index.module.scss'
import SvgIcon from '@/components/SvgIcon'
import { AlbumDetailProps, AlbumTracks } from '@/store/modules/Album/data'
import { calculateCount, getName } from '@/utils'

function AlbumDetail(props: AlbumDetailProps) {
  const { currentAlbum } = props

  return (
    <>
      <div className={style['top-desc']}>
        <div
          className={style['background']}
          style={{ backgroundImage: `url(${currentAlbum.coverImgUrl})` }}
        >
          <div className={style['filter']}></div>
        </div>
        <div className={style['img-wrapper']}>
          <div className={style['decorate']}></div>
          {currentAlbum.coverImgUrl && (
            <img src={currentAlbum.coverImgUrl} alt="img" />
          )}
          <div className={style['play-count']}>
            <SvgIcon iconClass="play" className={style['icon-play']} />
            <span className={style['count']}>
              {Math.floor(
                (currentAlbum.subscribedCount
                  ? currentAlbum.subscribedCount
                  : 0) / 1000,
              ) / 10}
              万
            </span>
          </div>
        </div>
        <div className={style['desc-wrapper']}>
          <div className={style['title']}>{currentAlbum.name}</div>
          <div className={style['person']}>
            <div className={style['avatar']}>
              {currentAlbum.creator ? (
                <img src={currentAlbum.creator.avatarUrl} alt="" />
              ) : null}
            </div>
            <div className={style['name']}>
              {currentAlbum.creator && currentAlbum.creator.nickname}
            </div>
          </div>
        </div>
      </div>

      <div className={style['song-list']}>
        <div className={style['first-line']}>
          <div className={style['play-all']}>
            <SvgIcon
              iconClass="play-cycle"
              className={style['icon-play-cycle']}
            />
            <span>
              播放全部{' '}
              <span className={style['sum']}>
                (共 {currentAlbum.tracks && currentAlbum.tracks.length} 首)
              </span>
            </span>
          </div>
          <div className={style['add-list']}>
            <SvgIcon iconClass="plus" className={style['icon-plus']} />
            <span>
              收藏 (
              {calculateCount(
                currentAlbum.subscribedCount ? currentAlbum.subscribedCount : 0,
              )}
              )
            </span>
          </div>
        </div>
        <ul className={style['song-item']}>
          {currentAlbum.tracks &&
            currentAlbum.tracks.map((item: AlbumTracks, index: number) => {
              return (
                <li key={index}>
                  <span className={style['index']}>{index + 1}</span>
                  <div className={style['info']}>
                    <span>{item.name}</span>
                    <span>
                      {getName(item.ar)} - {item.al.name}
                    </span>
                  </div>
                </li>
              )
            })}
        </ul>
      </div>
    </>
  )
}

export default memo(AlbumDetail)
