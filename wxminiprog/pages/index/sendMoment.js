// pages/index/sendMoment.js
var utils = require("../../utils/util.js");
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    momentContent : "",
    images: [],
    displayAddImgBtn : true,
    canSend : false,
    uploadingImage : false
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

  textareaInput : function(e){
    this.setData({
      momentContent : e.detail.value
    })
  },

  tapAddImg : function(){
    console.log(this.data.momentContent)
    var _this = this;
    wx.chooseImage({
      count: 9 - _this.data.images.length,
      success: function (res) {
        _this.setData({
          uploadingImage : true
        });
        
        for(var i in res.tempFilePaths){
          var path = res.tempFilePaths[i];
          var oriImagesArr = _this.data.images;
          var currentIndex = oriImagesArr.length;

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

              //上传成功后
              var oriImagesArr = _this.data.images;
              oriImagesArr.unshift({
                url : iconUrl
              })

              _this.setData({
                images: oriImagesArr
              });

              if(_this.data.images.length >= 9){
                _this.setData({
                  displayAddImgBtn : false
                })
              }
            },
            fail: function (res) {
              console.log(res);
              wx.showToast({
                icon: 'none',
                title: '上传图片时出错',
              })
            }
          })
        }
      },
      fail: function () {
        
      }
    })
  },
  tapImage : function(e){
    var _this = this;
    wx.showActionSheet({
      itemList: ["删除","取消"],
      success : function(res){
        if (res.tapIndex == 0){
          var oriImagesArr = _this.data.images;
          var currentArr = [];
          for(var j in oriImagesArr){
            if(j == e.currentTarget.dataset.index){
              continue;
            }else{
              currentArr.unshift(oriImagesArr[j]);
            }
          }

          _this.setData({
            images : currentArr
          })
        }
      }
    })
  },
  sendMoment : function(){
    var _this = this;
    var _images = '';
    for(var i in _this.data.images){
      if(i != 0){
        _images += ',';
      }

      _images += _this.data.images[i].url;
    }
    utils.ajax("https://xtzero.me/index.php/Moment/Index/sendMoment",{
      token : app.globalData.token,
      content: _this.data.momentContent,
      images: _images
    },function(xxx){
      if(xxx.meta.code == 200){ 
        wx.showToast({
          title: '成功',
        });

        wx.reLaunch({
          url: '/pages/index/index',
        })
      }else{
        wx.showToast({
          icon : "none",
          title: '发帖时出现错误：'+xxx.meta.message,
        })
      }
    })
  }
})