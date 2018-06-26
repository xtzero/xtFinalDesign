// pages/explore/explore.js
var utils = require('../../utils/util.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    articles : [],
    page : 1,
    nomore : false
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
    console.log('进入了发现页');
    this.loadArticles();
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

  loadArticles : function (){
    var _this = this;
    utils.ajax('https://xtzero.me/index.php/Article/Index/listArticle',{
      token : app.globalData.token,
      page : _this.data.page
    },function(xxx){
      console.log(xxx);
      if(xxx.meta.code == 200){
        var oriArticles = _this.data.articles;
        for(var i in xxx.data){
          oriArticles.push(xxx.data[i]);
        }

        _this.setData({
          articles : oriArticles,
          page : _this.data.page + 1
        });
        console.log(_this.data.articles);
      }else if(xxx.meta.code == 40006){
        _this.setData({
          nomore : true
        });
      }else{
        wx.showToast({
          icon : 'none',
          title: '载入文章列表时出现错误：'+xxx.meta.message,
        })
      }
    });
  },

  lower : function(){
    var _this = this;
    if(!_this.data.nomore){
      _this.loadArticles();
    }
  },

  tapArticle : function(e){
    wx.navigateTo({
      url: 'article?aid='+e.currentTarget.dataset.aid,
    });
  }
})