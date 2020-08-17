import React from 'react'
import { Redirect } from 'react-router'
import Layout from '../core/Layout'
import Recommend from '../core/Recommend'
import Singers from '../core/Singers'
import Rank from '../core/Rank'
import Album from '../core/Album'
import Singer from '../core/Singer'
import Search from '../core/Search'

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
        component: Recommend,
        key: 'Recommend',
        routes: [
          {
            path: '/recommend/:id',
            component: Album,
          },
        ],
      },
      {
        path: '/singers',
        component: Singers,
        key: 'Singers',
        routes: [
          {
            path: '/singers/:id',
            component: Singer,
          },
        ],
      },
      {
        path: '/rank',
        component: Rank,
        key: 'Rank',
        routes: [
          {
            path: '/rank/:id',
            component: Album,
          },
        ],
      },
      {
        path: '/search',
        key: 'search',
        component: Search,
      },
    ],
  },
]
