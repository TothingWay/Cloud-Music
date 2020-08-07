import React, { forwardRef, useState, useImperativeHandle } from 'react'
import { CSSTransition } from 'react-transition-group'
import style from './index.module.scss'
import '@/styles/global.scss'

const Toast = forwardRef((props: { text: string }, ref) => {
  const [show, setShow] = useState(false)
  const [timer, setTimer] = useState<any>()
  const { text } = props

  useImperativeHandle(ref, () => ({
    show() {
      // 做了防抖处理
      if (timer) clearTimeout(timer)
      setShow(true)
      setTimer(
        setTimeout(() => {
          setShow(false)
        }, 3000),
      )
    },
  }))
  return (
    <CSSTransition in={show} timeout={300} classNames="scale" unmountOnExit>
      <div className={style['toast-wrapper']}>
        <div className={style['text']}>{text}</div>
      </div>
    </CSSTransition>
  )
})

export default Toast
