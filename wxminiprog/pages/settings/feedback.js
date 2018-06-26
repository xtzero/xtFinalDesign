// pages/settings/feedback.js
var app = getApp();
var utils = require('../..//utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content : '',
    contact : ''
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

  editContent : function(e) {
    this.setData({
      content : e.detail.value
    })
  },

  editContact : function(e){
    this.setData({
      contact: e.detail.value
    })
  },

  send : function(e) {
    utils.ajax('https://xtzero.me/index.php/Moment/Index/feedback',{
      token : app.globalData.token,
      content : this.data.content,
      contact : this.data.contact
    },function(xxx){
        if(xxx.meta.code == 200){
            wx.showToast({
              title: '感谢反馈',
              success : function(){
                wx.navigateBack({
                  
                })
              }
            })
        }else{
          wx.showToast({
            icon : 'none',
            title: xxx.meta.message,
          })
        }
    })
  }
})
