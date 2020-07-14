import React from 'react'
import { isExternal } from '@/utils/validate'
import './index.scss'

interface SvgIcon {
  iconClass: string
  className?: string
  onClick?: ((e: React.MouseEvent<HTMLOrSVGElement>) => void)
}

function SvgIcon({ iconClass, className, onClick }: SvgIcon) {
  const styleExternalIcon = {
    mask: `url(${iconClass}) no-repeat 50% 50%`,
    '-webkit-mask': `url(${iconClass}) no-repeat 50% 50%`,
  }
  const svgClass = className ? 'svg-icon ' + className : 'svg-icon'
  const iconName = `#icon-${iconClass}`

  if (isExternal(iconClass)) {
    return (
      <div style={styleExternalIcon} className="svg-external-icon svg-icon" />
    )
  } else {
    return (
      <svg className={svgClass} aria-hidden="true" onClick={onClick}>
        <use xlinkHref={iconName} />
      </svg>
    )
  }
}

export default React.memo(SvgIcon)
