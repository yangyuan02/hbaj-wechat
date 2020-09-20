// pages/auth/auth.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    code:"",
    encryptedData:"",
    iv:"",
    authorization:wx.getStorageSync('authorization')
  },
  toentryHome(){
    this.toHome()
  },
  getLogin(){ // 获取code
    console.log('进入')
    wx.login({
      success :(res)=> {
       const code = res.code;
       console.log('code', code)
       this.setData({
         code
       })
      }
    })
  },
  getPhoneNumber (e) {
    const {encryptedData,iv} = e.detail;
    this.setData({
      encryptedData,
      iv
    })
    this.checkSession(encryptedData, iv)
    
  },
  checkSession(encryptedData, iv){
    wx.checkSession({
      success: () => {
        this.login({encryptedData, iv})
        //session_key 未过期，并且在本生命周期一直有效
      },
      fail: () => {
        // session_key 已经失效，需要重新执行登录流程
       this.getLogin()
      }
    })
  },
  login(data){ // 登录
    const code = this.data.code;
    const params = {...data, code}
    console.log(JSON.stringify(params, null,4))
    wx.request({
      url: 'https://api-msa.vr2shipping.com/user/wxlogin',
      data:params,
      method:'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success :(res) => {
        const {
          suceeded,
          code,
          data: { authorization, id, openid, mobile }
      } = res.data;
      if (code === '1005' && openid && mobile) {
        wx.navigateTo({
          url: `/pages/register/register?openid=${openid}&mobile=${mobile}`,
          success:function(res) {
            console.log(res)
          }
        })
        return false;
      } else {
        if (suceeded) {
          if(authorization && id){
            wx.setStorageSync('authorization', authorization)
            wx.setStorageSync('userId', id)
            this.toHome()
          }
        }
      }
      
      }
    })
  },

  toHome(){ // 登录信息存在跳转到登录页面
    const authorization = wx.getStorageSync('authorization');
    const userId = wx.getStorageSync('userId');
    if (authorization) {
      wx.navigateTo({
        url: `/pages/index/index?authorization=${authorization}&userId=${userId}`,
        success:function(res) {
          console.log(res)
        }
      })
    }
  },
  setAuthorization(){
    if (wx.getStorageSync('authorization')) {
      this.setData({
        authorization:wx.getStorageSync('authorization')
      })
    }
  },
  isClearStore(){
    wx.clearStorageSync('authorization')
    wx.clearStorageSync('userId');
    this.setData({authorization:''})
  },

  show(){
    wx.showShareMenu({
      withShareTicket: true,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {isClearStore} = options;
    if (isClearStore === '1') {
      this.isClearStore()
    }
    this.getLogin()
    this.show()
    // this.toHome()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    this.setAuthorization();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})