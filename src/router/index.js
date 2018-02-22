import Vue from 'vue'
import Router from 'vue-router'
import Recommend from '@/components/recommend/Remd'
import Rank from '@/components/rank/Rank'
import Singer from '@/components/singer/Singer'
import SingerDetail from '@/components/singerDetail/singerDetail'
import RemdListDetail from '@/components/remdListDetail/RemdListDetail'
import RankDetail from '@/components/rankDetail/RankDetail'
import User from '@/components/user/User'

Vue.use(Router)

export default new Router({
  linkActiveClass: 'vux-tab-selected',
  routes: [
    {
      path: '/recommend',
      name: 'recommend',
      component: Recommend,
      children: [
        {
          path: ':id',
          component: RemdListDetail
        }
      ]
    },
    {
      path: '/rank',
      name: 'rank',
      component: Rank,
      children: [
        {
          path: ':id',
          component: RankDetail
        }
      ]
    },
    {
      path: '/singer',
      name: 'singer',
      component: Singer,
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    },
    {
      path: '/user',
      name: 'user',
      component: User
    },
    {
      path: '*',
      redirect: '/recommend'
    }
  ]
})
