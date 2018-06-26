// pages/mine/mine.js
const app = getApp();
var utils = require("../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickname : null,
    usericon: null,

    changeNickname : false,

    newNickname : ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      nickname: app.globalData.userinfo.nickname,
      usericon: app.globalData.userinfo.usericon
    });
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

  jumpToSetting: function(){
    wx.navigateTo({
      url: '/pages/settings/settings',
    })
  },

  tapUsericon : function(){
    var _this = this;
    wx.showActionSheet({
      itemList: ['修改头像','取消'],
      success : function(e){
        console.log(e);
        if(e.tapIndex == 0){
          console.log('取图片啦');
          wx.chooseImage({
            count: 1,
            success: function (res) {
              console.log('取图片成功！');
              var path = res.tempFilePaths[0];
              console.log(path);
              wx.uploadFile({
                url: 'https://xtzero.me/Upload/Index/index',
                filePath: path,
                name: 'file',
                header: {
                  'Content-Type': 'application/x-www-form-urlencoded'
                },
                success: function (res) {
                  var _iconUrl = JSON.parse(res.data);
                  var iconUrl = _iconUrl.data;

                  utils.ajax("https://xtzero.me/index.php/Userinfo/Index/editUsericon", {
                    token: app.globalData.token,
                    usericon: iconUrl
                  }, function (xxx) {
                    if (xxx.meta.code == 200) {
                      _this.setData({
                        usericon: iconUrl
                      });
                      app.globalData.userinfo.usericon = iconUrl;
                      wx.showToast({
                        title: '头像已上传',
                      });
                    } else {
                      wx.showToast({
                        icon: 'none',
                        title: '头像修改失败：' + xxx.meta.message,
                      });
                    }
                  })
                },
                fail: function (res) {
                  console.log(res);
                  wx.showToast({
                    icon: 'none',
                    title: '上传图片时出错',
                  })
                }
              })
            },
            fail: function () {
              wx.showToast({
                icon: 'none',
                title: '选择图片出错',
              });
            }
          })
        }
      }
    });
    
  },

  tapNickname : function(){
    var _this = this;
    wx.showActionSheet({
      itemList: ['修改昵称','取消'],
      
      success : function(e){
        if(e.tapIndex == 0){
          _this.setData({
            changeNickname : true
          });
        }
      }
    })
  },

  inputNewNickname : function(e){
    var _this = this;
    _this.setData({
      newNickname : e.detail.value
    });
  },

  changeNickname : function(){
    var _this = this;
    var nickname = _this.data.newNickname;
    if(nickname != ''){
      utils.ajax('https://xtzero.me/index.php/Userinfo/Index/editNickname',{
        token : app.globalData.token,
        nickname : nickname
      },function(xxx){
        if(xxx.meta.code == 200){
          wx.showToast({
            title: '修改完成！',
          })
          _this.setData({
            changeNickname : false,
            nickname : nickname
          })
          app.globalData.userinfo.nickname = nickname;
        }else{
          wx.showToast({
            title: '修改昵称时出错：'+xxx.meta.message,
          });
        }
      });
    }else{
      _this.setData({
        changeNickname : false
      })
    }
  },

  tapMyMoments : function(){
    wx.navigateTo({
      url: 'myMoments'
    });
  },

  tapMyCommentedMoments : function(){
    wx.navigateTo({
      url: 'myCommentedMoments'
    })
  }
})