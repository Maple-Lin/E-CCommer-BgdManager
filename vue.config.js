module.exports = {
  chainWebpack: config => {
    config.module
      .rule('css')
        .test(/\.css$/)
        .oneOf('vue')
        .resourceQuery(/\?vue/)
        .use('px2rem')
          .loader('px2rem-loader')
          .options({
            remUnit: 75
          })
	},
  //自动打开，端口号位8081
  devServer: {
    open: true,
    port: 8081
  },

}