import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  // �ض���
  {
    path:'/',
    redirect:'/login'
  },
  {
    path:'/login',
    component:() => import('components/Login')
  },
  {
    path:'/home',
    component:() => import('components/Home'),
    redirect:'/welcome',
    children:[{
      path:'/welcome',
      component:() => import('components/Welcome'),
    },{
      path:'/users',
      component:() => import('components/user/Users'),
    },{
      path:'/rights',
      component:() => import('components/power/PowerList'),
    },{
      path:'/roles',
      component:() => import('components/power/Roles'),
    },{
      path:'/categories',
      component:() => import('components/goods/Categories'),
    }]
  },
]

const router = new VueRouter({
  routes
})

// ���õ������� ���û�м�¼token���ܽ��뵽home
router.beforeEach((to,from,next) => {
  // next() ����  next('/login')ǿ����ת
  if (to.path=='/login') return next();
  const tokenStr = window.sessionStorage.getItem('token');
  if(!tokenStr) return next('/login')
  next();
})
export default router
