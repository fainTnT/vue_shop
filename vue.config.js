module.exports = {
  // ȡ��eslint
  lintOnSave: false,
  // ·�����ñ���
  configureWebpack: {
    resolve:{
      extensions:[],
      alias:{
        'assets':'@/assets',
        'common':'@/common',
        'components':'@/components',
        'network':'@/network',
        'views':'@/views',
      }
    }
  }
}