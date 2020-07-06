import React, { useState, useEffect } from 'react'

// import { renderRoutes } from "react-router-config";

// import { NavLink } from 'react-router-dom';//利用NavLink组件进行路由跳转

function Singers() {
  // const { route } = props;
  const device =
    window.devicePixelRatio &&
    window.devicePixelRatio === 3 &&
    window.screen.width === 375 &&
    testUA('iPhone')
  function testUA(str: string) {
    return navigator.userAgent.indexOf(str) > -1
  }
  const [isIphoneX, setIsIphoneX] = useState<boolean>()
  useEffect(() => {
    if (device) {
      setIsIphoneX(true)
    } else {
      setIsIphoneX(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      style={{
        height: isIphoneX ? 'calc(100vh - 138px)' : 'calc(100vh - 104px)',
      }}
    >
      singer
    </div>
  )
}

export default React.memo(Singers)
