import React from 'react'
import { Redirect } from 'react-router'
import Layout from '../core/Layout'
import Recommend from '../core/Recommend'
import Singers from '../core/Singers'
import Rank from '../core/Rank'

export default [
  {
    path: "/",
    component: Layout,
    routes: [
      {
        path: "/",
        exact: true,
        render: () => (
          <Redirect to={"/recommend"}/>
        )
      },
      {
        path: "/recommend",
        component: Recommend
      },
      {
        path: "/singers",
        component: Singers
      },
      {
        path: "/rank",
        component: Rank
      }
    ]
  }
]