import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  // 重定向
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
    component:() => import('components/Home')
  },
]

const router = new VueRouter({
  routes
})

// 设置导航守卫 如果没有记录token则不能进入到home
router.beforeEach((to,from,next) => {
  // next() 放行  next('/login')强制跳转
  if (to.path=='/login') return next();
  const tokenStr = window.sessionStorage.getItem('token');
  if(!tokenStr) return next('/login')
  next();
})
export default router
