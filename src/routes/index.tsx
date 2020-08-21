import React, { lazy, Suspense } from 'react'
import { Redirect } from 'react-router'
import Layout from '../core/Layout'

const SuspenseComponent = (
  Component: React.LazyExoticComponent<React.MemoExoticComponent<any>>,
) => (props: any) => {
  return (
    <Suspense fallback={null}>
      <Component {...props}></Component>
    </Suspense>
  )
}

const Recommend = lazy(() => import('../core/Recommend/'))
const Singers = lazy(() => import('../core/Singers/'))
const Rank = lazy(() => import('../core/Rank/'))
const Album = lazy(() => import('../core/Album/'))
const Singer = lazy(() => import('./../core/Singer/'))
const Search = lazy(() => import('./../core/Search/'))

export default [
  {
    path: '/',
    component: Layout,
    routes: [
      {
        path: '/',
        exact: true,
        render: () => <Redirect to={'/recommend'} />,
      },
      {
        path: '/recommend',
        component: SuspenseComponent(Recommend),
        key: 'Recommend',
        routes: [
          {
            path: '/recommend/:id',
            component: SuspenseComponent(Album),
          },
        ],
      },
      {
        path: '/singers',
        component: SuspenseComponent(Singers),
        key: 'Singers',
        routes: [
          {
            path: '/singers/:id',
            component: SuspenseComponent(Singer),
          },
        ],
      },
      {
        path: '/rank',
        component: SuspenseComponent(Rank),
        key: 'Rank',
        routes: [
          {
            path: '/rank/:id',
            component: SuspenseComponent(Album),
          },
        ],
      },
      {
        path: '/album/:id',
        exact: true,
        key: 'album',
        component: SuspenseComponent(Album),
      },
      {
        path: '/search',
        exact: true,
        key: 'search',
        component: SuspenseComponent(Search),
      },
    ],
  },
]
