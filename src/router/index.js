import Vue from 'vue'
import Router from 'vue-router'
import Recommend from '@/components/recommend/Remd'
import Rank from '@/components/rank/Rank'
import Singer from '@/components/singer/Singer'

Vue.use(Router)

export default new Router({
  linkActiveClass: 'vux-tab-selected',
  routes: [
    {
      path: '/recommend',
      name: 'recommend',
      component: Recommend
    },
    {
      path: '/rank',
      name: 'rank',
      component: Rank
    },
    {
      path: '/singer',
      name: 'singer',
      component: Singer
    },
    {
      path: '*',
      redirect: '/recommend'
    }
  ]
})
