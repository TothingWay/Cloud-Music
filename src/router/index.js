import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const Recommend = (resolve) => {
  import('@/components/recommend/Remd').then((recommend) => {
    resolve(recommend)
  })
}

const Rank = (resolve) => {
  import('@/components/rank/Rank').then((rank) => {
    resolve(rank)
  })
}

const Singer = (resolve) => {
  import('@/components/singer/Singer').then((singer) => {
    resolve(singer)
  })
}

const SingerDetail = (resolve) => {
  import('@/components/singerDetail/singerDetail').then((singerDetail) => {
    resolve(singerDetail)
  })
}

const RemdListDetail = (resolve) => {
  import('@/components/remdListDetail/RemdListDetail').then((remdListDetail) => {
    resolve(remdListDetail)
  })
}

const RankDetail = (resolve) => {
  import('@/components/rankDetail/RankDetail').then((rankDetail) => {
    resolve(rankDetail)
  })
}

const User = (resolve) => {
  import('@/components/user/User').then((user) => {
    resolve(user)
  })
}
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
