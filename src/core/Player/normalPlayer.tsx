import React from 'react'
import style from './index.module.scss'
import { getName } from '@/utils'
import SvgIcon from '@/components/SvgIcon'

interface NormalPlayerProps {
  song: any
}

function NormalPlayer(props: NormalPlayerProps) {
  const { song } = props
  console.log(song)

  return (
    <div className={style['normal-player-container']}>
      <div className={style['background']}>
        <img
          src={song.al && song.al.picUrl + '?param=300x300'}
          width="100%"
          height="100%"
          alt="歌曲图片"
        />
      </div>
      <div className={`${style['background']} ${style['layer']}`}></div>
      <div className={style['top']}>
        <SvgIcon iconClass="back" className={style['back']} />

        <h1 className={style['title']}>{song.name}</h1>
        <h1 className={style['subtitle']}>{getName(song.ar)}</h1>
      </div>
      <div className={style['middle']}>
        <div className={style['CD-wrapper']}>
          <div className={style['cd']}>
            <img
              className={`${style['image']} ${style['play']}`}
              src={song.al.picUrl + '?param=400x400'}
              alt=""
            />
          </div>
        </div>
      </div>
      <div className={style['bottom']}>
        <div className={style['operators']}>
          <div className="icon i-left">
            <i className="iconfont">&#xe625;</i>
          </div>
          <div className="icon i-left">
            <i className="iconfont">&#xe6e1;</i>
          </div>
          <div className="icon i-center">
            <i className="iconfont">&#xe723;</i>
          </div>
          <div className="icon i-right">
            <i className="iconfont">&#xe718;</i>
          </div>
          <div className="icon i-right">
            <i className="iconfont">&#xe640;</i>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NormalPlayer
