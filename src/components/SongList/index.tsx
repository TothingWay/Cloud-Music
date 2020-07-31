import React from 'react'
import style from './index.module.scss'
import { getName } from '@/utils'
import SvgIcon from '@/components/SvgIcon'

interface songListProps {
  songs: Array<any>
}

const SongsList = React.forwardRef<HTMLDivElement, songListProps>(
  (props, refs) => {
    const { songs = [] } = props

    const totalCount = songs.length

    const selectItem = (e: React.MouseEvent, index: number) => {
      console.log(index)
    }

    const songList = (list: Array<any>) => {
      const res = []
      for (let i = 0; i < list.length; i++) {
        const item = list[i]
        res.push(
          <li
            key={item.id}
            onClick={(e: React.MouseEvent<HTMLLIElement>) => selectItem(e, i)}
          >
            <span className={style['index']}>{i + 1}</span>
            <div className={style['info']}>
              <span>{item.name}</span>
              <span>
                {item.ar ? getName(item.ar) : getName(item.artists)} -{' '}
                {item.al ? item.al.name : item.album.name}
              </span>
            </div>
          </li>,
        )
      }
      return res
    }

    return (
      <div className={style['song-list']} ref={refs}>
        <div className={style['first-line']}>
          <div className={style['play-all']} onClick={(e) => selectItem(e, 0)}>
            <SvgIcon
              iconClass="play-cycle"
              className={style['icon-play-cycle']}
            />
            <span>
              播放全部{' '}
              <span className={style['sum']}>(共 {totalCount} 首)</span>
            </span>
          </div>
        </div>
        <div className={style['song-item']}>{songList(songs)}</div>
      </div>
    )
  },
)

export default React.memo(SongsList)
