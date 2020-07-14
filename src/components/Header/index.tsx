import React, { forwardRef, memo } from 'react'
import SvgIcon from '@/components/SvgIcon'
import style from './index.module.scss'

interface HeaderProps {
  handleClick: () => void
  title?: string
}

const Header = forwardRef<HTMLDivElement, HeaderProps>((props, ref) => {
  const { handleClick, title } = props
  return (
    <div className={style['container']} ref={ref}>
      <SvgIcon iconClass="back" className={style['back']} onClick={handleClick} />
      {title && <h1>{title}</h1>}
    </div>
  )
})

export default memo(Header)
