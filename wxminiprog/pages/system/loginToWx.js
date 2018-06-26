// pages/system/loginToWx.js
const app = getApp();
var utils = require('../../utils/util.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
      
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
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
  
  },

  login : e => {
    wx.showLoading({
      mask : true,
      title: '请稍等',
    })
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        app.globalData.jsCode = res.code;
        utils.ajax('https://xtzero.me/index.php/Account/Login/login', {
          code: res.code
        }, function (xxx) {
          wx.hideLoading();
          if (xxx.meta.code == 200) {
            //登录成功，将用户信息存入全局变量
            app.globalData.userinfo = xxx.data;
            app.globalData.token = xxx.data.token;

            wx.showToast({
              title: '欢迎你，' + xxx.data.nickname + '！',
              success : function () {
                wx.reLaunch({
                  url: '/pages/index/index',
                })
              }
            });

          } else if (xxx.meta.code == 40002) {
            //未注册，跳转到注册页面
            wx.showToast({
              title: '欢迎你，新用户！',
              icon: 'none',
              success: function () {
                wx.redirectTo({
                  url: '/pages/system/signin',
                });
              }
            });
          } else {
            //其他意外情况
            wx.showToast({
              title: '出现意外情况：' + xxx.meta.message + '，建议重新打开小程序。',
            })
          }
        });
      }
    });
  }
})