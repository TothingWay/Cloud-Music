import React, { useRef, useEffect, memo } from 'react'
import Scroll from '@/components/Scroll'
import style from './index.module.scss'

interface listTypes {
  name: string
  key: string
}

type HorizenProps = {
  list: Array<listTypes>
  currentVal: string
  handleClick: (id: string) => void
  marginBottom?: number
}

function Horizen(props: HorizenProps) {
  const { list, currentVal, marginBottom } = props
  const { handleClick } = props

  const Category = useRef(null)

  // 加入初始化内容宽度的逻辑
  useEffect(() => {
    // eslint-disable-next-line
    const categoryDOM = Category.current! as HTMLDivElement
    const tagElems = categoryDOM.querySelectorAll('div')
    let totalWidth = 0
    Array.from(tagElems).forEach((ele) => {
      totalWidth += ele.offsetWidth
    })
    categoryDOM.style.width = `${totalWidth + (tagElems.length - 1) * 5}px`
  }, [])

  return (
    <Scroll direction={'horizental'}>
      <div
        ref={Category}
        className={`${style['list']}`}
        style={{ marginBottom: marginBottom + 'px' }}
      >
        {list.map((item) => {
          return (
            <div
              key={item.key}
              className={`${style['list-item']} ${
                currentVal === item.key ? style['selected'] : ''
              }`}
              onClick={() => handleClick(item.key)}
            >
              {item.name}
            </div>
          )
        })}
      </div>
    </Scroll>
  )
}
export default memo(Horizen)
