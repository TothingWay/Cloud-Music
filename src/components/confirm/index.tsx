import React, { forwardRef, useImperativeHandle, useState } from 'react'
import { CSSTransition } from 'react-transition-group'
import style from './index.module.scss'
import '@/styles/global.scss'

interface ConfirmProps {
  handleConfirm: () => void
  text: string
  cancelBtnText?: string
  confirmBtnText?: string
}

const Confirm = forwardRef<any, ConfirmProps>((props, ref) => {
  const [show, setShow] = useState(false)
  const { text, cancelBtnText, confirmBtnText } = props

  const { handleConfirm } = props

  useImperativeHandle(ref, () => ({
    show() {
      setShow(true)
    },
  }))
  return (
    <CSSTransition
      classNames="confirm-fade"
      timeout={300}
      appear={true}
      in={show}
    >
      <div
        style={{ display: show ? 'block' : 'none' }}
        className={style['confirm-wrapper']}
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <div className={`${style['confirm-content']} confirm-content`}>
            <p className={style['text']}>{text}</p>
            <div className={style['operate']}>
              <div
                className={`${style['operate-btn']} ${style['left']}`}
                onClick={() => setShow(false)}
              >
                {cancelBtnText}
              </div>
              <div
                className={style['operate-btn']}
                onClick={() => {
                  setShow(false)
                  handleConfirm()
                }}
              >
                {confirmBtnText}
              </div>
            </div>
          </div>
        </div>
      </div>
    </CSSTransition>
  )
})

export default React.memo(Confirm)
