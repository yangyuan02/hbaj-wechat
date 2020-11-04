//index.js
//获取应用实例
const app = getApp()

Page({
  data:{
    src:'https://msa.vr2shipping.com/',
    // src:'http://localhost:8084/',
    shareAppData:{}
  },
  show(){
    wx.showShareMenu({
      withShareTicket: true,
    })
  },
  onLoad: function (options) {
    console.log(111)
    const {authorization, userId, n} = options;
    const {src} = this.data;
    let baseURL = '';
   if(n) {
    baseURL = n;
   } else {
     baseURL = src;
   }
    let baseUrl = n ? n : src
    console.log(baseUrl,options)
    this.setData({
      src:`${baseUrl}?authorization=${authorization}&userId=${userId}`
    })
    this.show()
  },
  bindGetMessage:function(e){
    if(e.detail.data && e.detail.data.length > 0) {
      const leng = e.detail.data.length - 1;
      const data = e.
      detail.data[leng];
      this.setData({
        shareAppData:data
      })
    }
  },
  onShareAppMessage: function(res) {
    if (res.from === 'button') {
      // console.log("来自页面内转发按钮");
      console.log(res.target);
    }
    else {
      console.log("来自右上角转发菜单", res.webViewUrl)
    }
    if(res.webViewUrl.search('my/p_dito') < 0) {
      this.setData({
        shareAppData:{}
      })
    }
    const {imageUrl, name} = this.data.shareAppData;
    return {
      title: name ? name : '宝山海事局VR海事安全技术平台',
      path: res.webViewUrl ? `/pages/index/index?n=${res.webViewUrl}` : '/pages/index/index?n=https://msa.vr2shipping.com/',
      imageUrl:imageUrl ? imageUrl : 'https://msa_pc.vr2shipping.com/pano/image/PROJECT_IMAGE_default.jpg',
      success: (res) => {
        console.log("转发成功", res);
        console.log("成功了")
      },
      fail: (res) => {
        console.log("转发失败", res);
      }
    }
  },
  onLaunch: function (options) {
    if (options.scene == 1044){
      console.log("分享")
    }
  }
})
