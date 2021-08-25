import { createRouter, createWebHashHistory } from 'vue-router'
import '../assets/css/global.css'
<<<<<<< HEAD
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import User from '../components/users/User.vue'
import Rights from '../components/power/Rights.vue'
import Roles from '../components/power/Roles.vue'
import NotFinished from '../components/not-finished/Not-finished.vue'
import Reports from '../components/reports/Reports.vue'
=======

// import Login from '../components/Login.vue'
// import Home from '../components/Home.vue'
// import Welcome from '../components/Welcome.vue'
// import User from '../components/users/User.vue'
// import Rights from '../components/power/Rights.vue'
// import Roles from '../components/power/Roles.vue'
// import NotFinished from '../components/not-finished/Not-finished.vue'
// import Reports from '../components/reports/Reports.vue'

// 路由懒加载：把组件按组分块
const Login = () => import(/* webpackChunkName: "login-home-welcome" */ '../components/Login.vue');
const Home = () => import(/* webpackChunkName: "login-home-welcome" */ '../components/Home.vue');
const Welcome = () => import(/* webpackChunkName: "login-home-welcome" */ '../components/Welcome.vue');

const User = () => import(/* webpackChunkName: "user-rights-roles" */ '../components/users/User.vue');
const Rights = () => import(/* webpackChunkName: "user-rights-roles" */ '../components/power/Rights.vue');
const Roles = () => import(/* webpackChunkName: "user-rights-roles" */ '../components/power/Roles.vue');

const NotFinished = () => import(/* webpackChunkName: "notFinished-reports" */ '../components/not-finished/Not-finished.vue');
const Reports = () => import(/* webpackChunkName: "notFinished-reports" */ '../components/reports/Reports.vue');


>>>>>>> power

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { 
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      {path: '/welcome', component: Welcome},
      {path: '/users', component: User},
      {path: '/rights', component: Rights},
      {path: '/roles', component: Roles},
<<<<<<< HEAD

=======
>>>>>>> power
      {path: '/goods', component: NotFinished},
      {path: '/params', component: NotFinished},
      {path: '/categories', component: NotFinished},
      {path: '/orders', component: NotFinished},
      {path: '/reports', component: Reports},
<<<<<<< HEAD
    
=======
>>>>>>> power
    ]
  },
];

const router = createRouter({
  history: createWebHashHistory(process.env.VUE_APP_ROUTER),
  routes
});

//导航全局前置守卫
router.beforeEach((to, from, next) => {//to：将要访问的路径，from：代表从哪个路径跳转而来，next:function 方形  next('/xxx):强制跳转到xxx
  if(to.path == '/login')   return next();
  const sessionStorageStr = window.sessionStorage.getItem('token');
  if(!sessionStorageStr) {
    next('/login');
    }else{
      next();
    }
});

export default router
