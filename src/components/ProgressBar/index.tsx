/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useEffect, useRef, useState } from 'react'
import style from './index.module.scss'
import { PlayerProps } from '@/core/Player/data'
import { prefixStyle } from '@/utils'

function ProgressBar(props: PlayerProps) {
  const { percent = 0, percentChange } = props
  const transform: any = prefixStyle('transform')

  const progressBar = useRef<HTMLDivElement>(null)
  const progress = useRef<HTMLDivElement>(null)
  const progressBtn = useRef<HTMLDivElement>(null)
  const [touch, setTouch] = useState({
    initiated: false,
    left: 0,
    startX: 0,
  })

  const progressBtnWidth = 16

  useEffect(() => {
    if (percent >= 0 && percent <= 1 && !touch.initiated) {
      const barWidth = progressBar.current!.clientWidth - progressBtnWidth
      const offsetWidth = percent * barWidth
      progress.current!.style.width = `${offsetWidth}px`
      progressBtn.current!.style[
        transform
      ] = `translate3d(${offsetWidth}px, 0, 0)`
    }
    // eslint-disable-next-line
  }, [percent])

  // 处理进度条的偏移
  const _offset = (offsetWidth: number) => {
    progress.current!.style.width = `${offsetWidth}px`
    progressBtn.current!.style[
      transform
    ] = `translate3d(${offsetWidth}px, 0, 0)`
  }

  const progressTouchStart = (e: React.TouchEvent) => {
    const startTouch = {
      initiated: false,
      startX: 0,
      left: 0,
    }
    startTouch.initiated = true //initial 为 true 表示滑动动作开始了
    startTouch.startX = e.touches[0].pageX // 滑动开始时横向坐标
    startTouch.left = progress.current!.clientWidth // 当前 progress 长度
    setTouch(startTouch)
  }

  const progressTouchMove = (e: React.TouchEvent) => {
    if (!touch.initiated) return
    // 滑动距离
    const deltaX = e.touches[0].pageX - touch.startX
    const barWidth = progressBar.current!.clientWidth - progressBtnWidth
    const offsetWidth = Math.min(Math.max(0, touch.left + deltaX), barWidth)
    _offset(offsetWidth)
  }

  const progressTouchEnd = (e: React.TouchEvent) => {
    const endTouch = JSON.parse(JSON.stringify(touch))
    endTouch.initiated = false
    setTouch(endTouch)
    _changePercent()
  }

  const progressClick = (e: React.MouseEvent) => {
    const rect = progressBar.current!.getBoundingClientRect()
    const offsetWidth = e.pageX - rect.left
    _offset(offsetWidth)
    _changePercent()
  }

  const _changePercent = () => {
    const barWidth = progressBar.current!.clientWidth - progressBtnWidth
    const curPercent = progress.current!.clientWidth / barWidth // 新的进度计算
    percentChange!(curPercent) // 把新的进度传给回调函数并执行
  }

  return (
    <div className={style['progress-bar']}>
      <div
        className={style['bar-inner']}
        ref={progressBar}
        onClick={progressClick}
      >
        <div className={style['progress']} ref={progress} />
        <div
          className={style['progress-btn-wrapper']}
          onTouchStart={progressTouchStart}
          onTouchMove={progressTouchMove}
          onTouchEnd={progressTouchEnd}
          ref={progressBtn}
        >
          <div className={style['progress-btn']} />
        </div>
      </div>
    </div>
  )
}

export default ProgressBar
