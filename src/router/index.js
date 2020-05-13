import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from "../views/Login/Login";
import Home from "../views/Home/Home";
import Welcome from "../components/Welcome";
import User from "../views/Home/children/User";
import Categories from "../views/Home/children/Categories";
import Goods from "../views/Home/children/Goods";
import Orders from "../views/Home/children/Orders";
import Params from "../views/Home/children/Params";
import Reports from "../views/Home/children/Reports";
import Rights from "../views/Home/children/Rights";
import Roles from "../views/Home/children/Roles";

Vue.use(VueRouter)

const routes = [
  {
    path: "",
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: Welcome
      },
      {
        path: '/users',
        component: User
      },
      {
        path: '/categories',
        component: Categories
      },
      {
        path: '/goods',
        component: Goods
      },
      {
        path: '/orders',
        component: Orders
      },
      {
        path: '/params',
        component: Params
      },
      {
        path: '/reports',
        component: Reports
      },
      {
        path: '/rights',
        component: Rights
      },
      {
        path: '/roles',
        component: Roles
      }
    ]
  }
]

const router = new VueRouter({
  routes,
  mode: 'history'
})
router.beforeEach((to, from, next) => {
  /*
  * to表示将要访问的路径
  * from表示从哪个路径跳转而来
  * next是一个函数，表示放行
  * next()放行，next('/login')强制跳转
  * */
  if (to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
