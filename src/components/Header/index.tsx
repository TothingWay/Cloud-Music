import React, {forwardRef} from 'react'
import SvgIcon from '@/components/SvgIcon'
import style from './index.module.scss'

interface HeaderProps {
  handleClick: () => void
  title?: string
  isMarquee?: boolean
}

const Header = forwardRef<HTMLDivElement, HeaderProps>((props, ref) => {
  const { handleClick, title, isMarquee = false } = props
  return (
    <div className={style['container']} ref={ref}>
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

export default Header
