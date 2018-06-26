// pages/system/signin.js
var utils = require('../../utils/util.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickname : null,
    icon: '/images/bannerimage.jpeg'
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

  ok : function(){
    if(this.data.nickname){
      var nickname = this.data.nickname;
      var icon = this.data.icon;
      utils.ajax('https://xtzero.me/index.php/Account/Signin/signin',{
        nickname : nickname,
        usericon : icon,
        code : app.globalData.jsCode
      },function(xxx){
        console.log(xxx)
        if(xxx.meta.code == 200){
          wx.showToast({
            title: '注册成功',
            success : e => {
              wx.reLaunch({
                url: '/pages/index/index',
              })
            }
          })
        }else{
          wx.showToast({
            title: '注册时出现错误：'+xxx.meta.message,
          })
        }
      })
    }else{
      wx.showToast({
        title: '请填写昵称',
      })
    }
  },

  tapIcon : function(){
    var _this = this;
    wx.chooseImage({
      count : 1,
      sourceType : 'album',
      success: function(res) {
        var path = res.tempFilePaths[0];
        console.log(path);
        wx.uploadFile({
          url: 'https://xtzero.me/Upload/Index/index',
          filePath: path,
          name: 'file',
          header: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          success : function(res){
            var _iconUrl = JSON.parse(res.data);
            var iconUrl = _iconUrl.data;
            _this.setData({
              icon : iconUrl
            });
            wx.showToast({
              title: '头像已上传',
            })
          },
          fail : function(res){
            console.log(res);
            wx.showToast({
              icon : 'none',
              title: '上传图片时出错',
            })
          }
        })
      },
      fail : function(){
        wx.showToast({
          icon : 'none',
          title: '选择图片出错',
        });
      }
    })
  },
  inputNickname : function(e){
    this.setData({
      nickname: e.detail.value
    })
  }
})