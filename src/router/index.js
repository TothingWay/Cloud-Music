import Vue from 'vue'
import Router from 'vue-router'
import Recommend from '@/components/recommend/Remd'
import Rank from '@/components/rank/Rank'
import Singer from '@/components/singer/Singer'
import SingerDetail from '@/components/singerDetail/singerDetail'
import RemdListDetail from '@/components/remdListDetail/RemdListDetail'

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
      component: Rank
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
      path: '*',
      redirect: '/recommend'
    }
  ]
})
