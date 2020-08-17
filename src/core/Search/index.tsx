import React, { useState, useEffect, memo } from 'react'
import { CSSTransition } from 'react-transition-group'
import { withRouter, RouteComponentProps } from 'react-router'
import style from './index.module.scss'
import '@/styles/global.scss'

function Search(props: RouteComponentProps<any>) {
  const [show, setShow] = useState(false)
  useEffect(() => {
    setShow(true)
  }, [])
  return (
    <CSSTransition
      in={show}
      timeout={300}
      appear={true}
      classNames="fly"
      unmountOnExit
      onExited={() => props.history.goBack()}
    >
      <div className={style['container']} onClick={() => setShow(false)}>
        搜索界面开发中
      </div>
    </CSSTransition>
  )
}

export default memo(withRouter(Search))
