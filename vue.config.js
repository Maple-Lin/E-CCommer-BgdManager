module.exports = {
  chainWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      // 为生产环境修改配置...
      config.entry('app').clear().add('./src/main-prod.js');
        // 问题出在这儿
      config.set('externals', {
        '{ createApp }': 'Vue',
        '{ createRouter, createWebHashHistory }':'vue-router',
        axios: 'axios',
        lodash: '_',
        echarts: 'echarts',
        nprogress: 'NProgress',
      });
      
      // 首页定制内容
      config.plugin('html').tap( args => {
        args[0].isProd = true;
        return args;
      });

    } else {
      // 为开发环境修改配置...
      config.entry('app').clear().add('./src/main-dev.js');

      config.plugin('html').tap( args => {
        args[0].isProd = false;
        return args;
      });
    }
  
   	 config.module
      .rule('css')
        .test(/\.css$/)
        .oneOf('vue')
        .resourceQuery(/\?vue/)
        .use('px2rem')
          .loader('px2rem-loader')
          .options({
            remUnit: 75
          });
    },
  //自动打开，端口号位8081
  devServer: {
    open: true,
    port: 8081
  },
}