import React, { memo } from 'react'
import { withRouter, RouteComponentProps } from 'react-router'
import style from './index.module.scss'
import '@/styles/global.scss'

function Search(props: RouteComponentProps<any>) {
  return <div className={style['container']}>搜索界面开发中</div>
}

export default memo(withRouter(Search))
