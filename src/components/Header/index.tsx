import React, { forwardRef, memo } from 'react'
import SvgIcon from '@/components/SvgIcon'
import style from './index.module.scss'

interface HeaderProps {
  handleClick: () => void
  title?: string
  bg?: string
  bgY?: number
  isMarquee?: boolean
}

const Header = forwardRef<HTMLDivElement, HeaderProps>((props, ref) => {
  const { handleClick, title, bg, bgY = 0, isMarquee = false } = props
  return (
    <div className={style['container']} ref={ref}>
      <div
        className={style['background']}
        style={{
          backgroundImage: `url(${bg})`,
          backgroundPosition: `0 ${bgY}px`,
        }}
      />
      <SvgIcon
        iconClass="back"
        className={style['back']}
        onClick={handleClick}
      />
      {isMarquee ? (
        <div className={style['marquee']}>
          <h1>{title}</h1>
        </div>
      ) : (
        <h1>{title}</h1>
      )}
    </div>
  )
})

export default memo(Header)
