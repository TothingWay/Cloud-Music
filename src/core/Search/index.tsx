import React, {
  memo,
  useState,
  useRef,
  useCallback,
  useMemo,
  useEffect,
} from 'react'
import { withRouter, RouteComponentProps } from 'react-router'
import style from './index.module.scss'
import '@/styles/global.scss'
import SvgIcon from '@/components/SvgIcon'
import { debounce } from '@/utils'

function Search(props: RouteComponentProps<any>) {
  const [isFocus, setIsFocus] = useState(false)
  const [query, setQuery] = useState('')
  const queryRef = useRef<HTMLInputElement>(null)

  const handleFocus = useCallback(() => {
    queryRef.current?.focus()
    setIsFocus(true)
  }, [])

  const handleQuery = (q: string) => {
    setQuery(q)
  }

  const handleQueryDebounce: (q: string) => void = useMemo(() => {
    return debounce(handleQuery, 500)
  }, [])

  const handleChange = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    setQuery(e.currentTarget.value)
  }, [])

  const clearQuery = useCallback((e: any) => {
    e.preventDefault()
    setQuery('')
    queryRef.current?.focus()
  }, [])

  useEffect(() => {
    // 注意防抖
    handleQueryDebounce(query)
  }, [handleQueryDebounce, query])

  return (
    <div className={style['container']}>
      <div className={style['search-wrapper']}>
        {!isFocus && (
          <div
            className={`${style['placeholder']} ${
              isFocus ? style['focus'] : ''
            }`}
            onClick={handleFocus}
          >
            <SvgIcon iconClass="search" className={`${style['search-icon']}`} />
            <span>搜索</span>
          </div>
        )}
        {isFocus && (
          <SvgIcon
            iconClass="search"
            className={`${style['search-focus-icon']}`}
          />
        )}
        <input
          ref={queryRef}
          type="text"
          className={style['search-input']}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          value={query}
          onChange={handleChange}
        />
        {query && (
          <SvgIcon
            iconClass="close"
            className={style['close-icon']}
            onClick={clearQuery}
          />
        )}
      </div>
    </div>
  )
}

export default memo(withRouter(Search))
