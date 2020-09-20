//index.js
//获取应用实例
const app = getApp()

Page({
  data:{
    src:'https://msa.vr2shipping.com/',
    // src:'http://localhost:8085/'
  },
  show(){
    wx.showShareMenu({
      withShareTicket: true,
    })
  },
  onLoad: function (options) {
    const {authorization, userId} = options;
    const {src} = this.data;
    this.setData({
      src:`${src}?authorization=${authorization}&userId=${userId}`
    })
    this.show()
  }
})
