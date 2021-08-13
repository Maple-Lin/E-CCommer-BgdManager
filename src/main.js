import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import $ from 'jquery'

//boostrap
import 'bootstrap/dist/css/bootstrap.min.css'

//自适应 px --> rem 
import 'lib-flexible/flexible'

//element plus
import ElementPlus from 'element-plus';
import 'element-plus/lib/theme-chalk/index.css';

//font
import './assets/font/iconfont.css'
//axios(http库)
import axios from "axios";
import VueAxios from "vue-axios";
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/';//默认请求路径


const app = createApp(App);
app.config.globalProperties.$axios = axios;//定义axios全局变量
//通过请求拦截器添加token，保证拥有获取数据权限
axios.interceptors.request.use(config => {
  // 为请求对象添加token验证的Authorization字段，让服务端识别身份
  config.headers.Authorization = window.sessionStorage.getItem('token');
  return config;
})

app.use(VueAxios, axios);
app.use(ElementPlus).use(router).mount('#app')
