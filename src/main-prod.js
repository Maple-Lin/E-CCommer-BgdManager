import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'bootstrap/dist/css/bootstrap.min.css'//boostrap
import 'lib-flexible/flexible'//自适应 px --> rem 

//element plus
import ElementPlus from 'element-plus';
import 'element-plus/lib/theme-chalk/index.css';
import './assets/font/iconfont.css'//font

//axios(http库)
import axios from "axios";
import VueAxios from "vue-axios";
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/';//默认请求路径

// Nprogress
import nProgress from 'nprogress'
import 'nprogress/nprogress.css'

const app = createApp(App);
app.config.globalProperties.$axios = axios;//定义axios全局变量

// 当拦截器request时，展示精度条 nProgress.start()
axios.interceptors.request.use(config => {
  nProgress.start();
  config.headers.Authorization = window.sessionStorage.getItem('token');// 为请求对象添加token验证的Authorization字段，让服务端识别身份
  return config;
});

// 当拦截器response时，隐藏进度条 nProgress.done()
axios.interceptors.response.use(config => {
  nProgress.done();
  return config;
});

app.use(VueAxios, axios);
app.use(ElementPlus).use(router).mount('#app')
