// pages/index/momentDetail.js
var utils = require('../../utils/util.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    momentDetail : {
      
    },

    comments : [{
      usericon : "",
      nickname : "",
      time : "",
      content : ""
    }],

    mid : null,

    commentContent : '',

    sendCommentBtnContent : '发送',

    displayCommentInput : false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    _this.setData({
      mid : options.mid
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
    this.loadMomentDetail(this);
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

  //加载帖子详情
  loadMomentDetail : function(_this){

    utils.ajax("https://xtzero.me/index.php/Moment/Index/momentDetail",{
      token : app.globalData.token,
      mid : _this.data.mid
    },function(xxx){
       if(xxx.meta.code == 200){
         xxx.data.time = utils.num2time(xxx.data.time);
         for(var i in xxx.data.comments){
           xxx.data.comments[i].time = utils.num2time(xxx.data.comments[i].time);
         }

        _this.setData({
          momentDetail : xxx.data,
        });
       }else{
         wx.showToast({
           icon : 'none',
           title: '载入帖子时出现错误：'+xxx.meta.message,
         })
       }
    })
  },
  inputCommentContent : function(e){
    this.setData({
      commentContent : e.detail.value
    });
  }, 

  displayCommentInput : function(){
    var　_this = this;
    _this.setData({
      displayCommentInput : true
    })
  },

  addComment: function () {
    var _this = this;
    if (_this.data.sendCommentBtnContent == '发送' && _this.data.commentContent != ''){
      _this.setData({
        sendCommentBtnContent : '发表中'
      });
      utils.ajax('https://xtzero.me/index.php/Moment/Index/comment',{
        token : app.globalData.token,
        mid: _this.data.mid,
        content: _this.data.commentContent,
        image : 'image not open'
      },function(xxx){
        if(xxx.meta.code == 200){
          _this.setData({
            sendCommentBtnContent: '发送'
          });
          wx.showToast({
            title: '评论成功！',
            success : function(){
              _this.setData({
                comments : [],
                commentContent : ""
              });
              _this.loadMomentDetail(_this);
            }
          });
        }else{
          wx.showToast({
            icon : 'none',
            title: '发表评论失败：'+xxx.meta.message,
          })
        }
      });
    }  
  }
});