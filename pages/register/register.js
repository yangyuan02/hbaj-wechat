// pages/auth/auth.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    password: "",
    confirmPassword: "",
    openid: "",
    mobile: ""
  },

  passwordChange(e) {
    this.setData({
      password: e.detail.value
    });
  },

  confirmPassword(e) {
    this.setData({
      confirmPassword: e.detail.value
    });
  },
  dispathdepartment(userId, authorization, cookie) {
    const params = {
      departmentId: 39,
      enterpriseId: 1,
      userId //用户ID
    };
    // options.headers["Authorization"] = `Bearer ${store.get("authorization", "local")}`;
    //     utils.setCookie("authorization", store.get("authorization", "local"));
    wx.request({
      url: "https://api-msa.vr2shipping.com/enterprise/1/user ",
      data: params,
      method: "POST",
      header: {
        "content-type": "application/json", // 默认值
        Authorization: `Bearer ${authorization}`,
        Cookie: cookie
      },
      success: res => {
        if (!res.suceeded) {
          wx.showToast({
            title: "加入部门失败",
            icon: "none",
            duration: 1000
          });
        }
      },
      fail: () => {
        wx.showToast({
          title: "接口调用失败",
          icon: "none",
          duration: 1000
        });
      }
    });
  },
  register() {
    const { password, confirmPassword, openid, mobile } = this.data;
    if (password !== confirmPassword) {
      return wx.showToast({
        title: "两次输入密码不一致",
        icon: "none",
        duration: 1000
      });
    }
    const params = {
      password,
      openid,
      mobile
    };
    wx.request({
      url: "https://api-msa.vr2shipping.com/user/wxUpdatePassword",
      data: params,
      method: "POST",
      header: {
        "content-type": "application/json" // 默认值
      },
      success: res => {
        const cookie = res.cookies[0];
        const {
          suceeded,
          data: { authorization, id }
        } = res.data;
        if (suceeded) {
          if (authorization && id) {
            wx.setStorageSync("authorization", authorization);
            wx.setStorageSync("userId", id);
            this.toHome();
            this.dispathdepartment(id, authorization, cookie);
          } else {
            wx.showToast({
              title: "userId不存在或authorization不存在",
              icon: "none",
              duration: 1000
            });
          }
        } else {
          res.message &&
            wx.showToast({
              title: res.message,
              icon: "none",
              duration: 1000
            });
        }
      },
      fail: () => {
        wx.showToast({
          title: "接口调用失败",
          icon: "none",
          duration: 1000
        });
      }
    });
  },

  toHome() {
    // 登录信息存在跳转到登录页面
    const authorization = wx.getStorageSync("authorization");
    const userId = wx.getStorageSync("userId");
    if (authorization) {
      wx.navigateTo({
        url: `/pages/index/index?authorization=${authorization}&userId=${userId}`,
        success: function (res) {
          console.log(res);
        }
      });
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { openid, mobile } = options;
    this.setData({
      openid,
      mobile
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {}
});
