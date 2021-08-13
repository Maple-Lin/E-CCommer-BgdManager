import { createRouter, createWebHashHistory } from 'vue-router'
import '../assets/css/global.css'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import User from '../components/users/User.vue'

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
    
    ]
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

//登录守卫
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
