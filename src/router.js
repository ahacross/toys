import Vue from 'vue'
import Router from 'vue-router'
import Constant from '@/store/constant'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('./views/Home')
    },
    {
      path: '/xlsx',
      name: 'xlsx',
      component: () => import('./views/XlsxParser')
    },
    {
      path: '/cinema/cgv',
      name: 'cgv',
      component: () => import('./components/cinema/cgv')
    },
    {
      path: '/exchange',
      name: 'exchange',
      component: () => import('./views/Exchange')
    }
  ]
})

// 현재 페이지 정보 추가
router.afterEach((to, from) => {
  router.app.$store.dispatch(Constant.CHANGE_VIEW, { view: to.name })
})

export default router
