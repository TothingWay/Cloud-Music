import React, { memo, useState, useCallback } from 'react'
import { RouteComponentProps, withRouter } from 'react-router'
import style from './index.module.scss'
import '@/styles/global.scss'
import { CSSTransition } from 'react-transition-group'
import Header from '@/components/Header'

export default memo(
  withRouter(function Album({ history }: RouteComponentProps) {
    const [showStatus, setShowStatus] = useState(true)

    const handleBack = useCallback(() => {
      setShowStatus(false);
    }, []);

    return (
      <CSSTransition
        in={showStatus}
        timeout={300}
        classNames="fly"
        appear={true}
        unmountOnExit
        onExited={history.goBack}
      >
        <div className={style['album']}>
          <Header title={"歌单"} handleClick={handleBack}></Header>
        </div>
      </CSSTransition>
    )
  })
)
