import { createRouter, createWebHashHistory } from 'vue-router'
import '../assets/css/global.css'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import User from '../components/users/User.vue'
import Rights from '../components/power/Rights.vue'
import Roles from '../components/power/Roles.vue'
import NotFinished from '../components/not-finished/Not-finished.vue'
import Reports from '../components/reports/Reports.vue'

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

      {path: '/goods', component: NotFinished},
      {path: '/params', component: NotFinished},
      {path: '/categories', component: NotFinished},
      {path: '/orders', component: NotFinished},
      {path: '/reports', component: Reports},
    
    ]
  },
];

const router = createRouter({
  history: createWebHashHistory(),
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
