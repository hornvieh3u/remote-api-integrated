import { nextTick } from 'vue';
import { createRouter, createWebHistory } from 'vue-router'
// import { useAuthStore } from './utils'

const DEFAULT_TITLE = 'DL DocAI';

const router = createRouter({
  strict: true,
  history: createWebHistory(),
  routes: [
    // ℹ️ We are redirecting to different pages based on role.
    // NOTE: Role is just for UI purposes. ACL is based on abilities.
    {
      path: '/',
      redirect: to => {
        const user = JSON.parse( localStorage.getItem('user') )
        if( user && user.token ) {
          return { name: 'home' }
        }

        return { name: 'login', query: to.query }
      },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../components/auth/Login.vue')
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('../components/pages/Home.vue')
    },
    {
      path: '/upload',
      name: 'upload',
      component: () => import('../components/pages/Upload.vue')
    },
    {
      path: '/view',
      name: 'view',
      component: () => import('../components/pages/View.vue')
    }
  ],
})

router.beforeEach((to) => {
  const user = JSON.parse( localStorage.getItem('user') )
  if (!(user && user.token) && to.name !== 'login')
    return 'login'
  else
    return true
})

router.afterEach(to => {
  nextTick(() => document.title = `${DEFAULT_TITLE} - ${to.name.replace('-', ' ').toUpperCase()}`)
})

export default router
