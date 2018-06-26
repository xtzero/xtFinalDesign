// pages/explore/article.js
var utils = require('../../utils/util.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    aid : false,
    articleDetail: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    _this.setData({
      aid : options.aid
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
    this.loadArticle();
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

  loadArticle : function(){
    var _this = this;
    utils.ajax("https://xtzero.me/index.php/Article/Index/articleDetail",{
      token : app.globalData.token,
      aid : _this.data.aid
    },function(xxx){
      if(xxx.meta.code == 200){
        xxx.data.time = utils.num2time(xxx.data.time);
        _this.setData({
          articleDetail: xxx.data
        })
      }else{
        wx.showToast({
          icon : 'none',
          title: '载入文章详情时出现错误：'+xxx.meta.message,
          success : function(){
            wx.navigateBack();
          }
        })
      }
    });
  }
})