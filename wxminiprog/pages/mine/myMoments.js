//index.js
//获取应用实例
const app = getApp()
var utils = require('../../utils/util.js');

Page({
  data: {
    moments: [],
    page: 1,
    pulldownRefreshing : false,
    nomore : false
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onReady : function(){
    var _this = this;
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    // wx.showLoading({
    //   title: '正在登录...',
    //   mask: true
    // });

    loadMoment(_this);
  },
  lower: function () {
    var _this = this;
    if(!_this.data.nomore){
      loadMoment(this);
    }
  },
  upper: function () {
    var _this = this;
    _this.setData({
      pulldownRefreshing : true,
      nomore : false
    });

    wx.showLoading({
      mask : true,
      title: '刷新中',
      success: function () {
        _this.setData({
          page: 1,
          moments: []
        });

        if(_this.data.pulldownRefreshing){
          loadMoment(_this, function () {
            _this.setData({
              pulldownRefreshing: false
            });
            wx.hideLoading();
          });
        }
      }
    });
  },
  jumpToSend: function () {
    wx.navigateTo({
      url: '/pages/index/sendMoment',
    })
  },
  tapCard: function (e) {
    var _this = this;
    wx.showActionSheet({
      itemList: ['前往帖子详情','删帖'],
      success : res => {
        switch(res.tapIndex){
          case 0 : {
            wx.navigateTo({
              url: '../index/momentDetail?mid=' + e.currentTarget.dataset.d.id,
            });
          }break;

          case 1 : {
            utils.ajax('https://xtzero.me/index.php/Moment/Index/delMoment',{
              token : app.globalData.token,
              mid: e.currentTarget.dataset.d.id
            },function(xxx){
              if(xxx.meta.code == 200){
                
                _this.setData({
                  page:1,
                  moments : []
                });
                loadMoment(_this);
              }else{
                wx.showToast({
                  icon : "none",
                  title: xxx.meta.message,
                })
              }
            })
          }break;
        }
      }
    })
  }
});

function loadMoment(_this,cb){
  utils.ajax('https://xtzero.me/index.php/Moment/Index/listMoment', {
    token: app.globalData.token,
    page: _this.data.page,
    my : "my"
  }, function (xxx) {
    cb && cb();
    if (xxx.meta.code == 200) {
      var oriMomentsArr = _this.data.moments;
      for(var i in xxx.data){
        oriMomentsArr.push(xxx.data[i]);
      }
      _this.setData({
        moments: oriMomentsArr,
        page: _this.data.page + 1
      });

      console.log(_this.data.moments);
    } else if(xxx.meta.code == 40006){
      wx.showToast({
        icon : 'none',
        title: '没有更多了',
        success : function(){
          _this.setData({
            nomore : true
          });
        }
      })
    }else {
      console.log(xxx);
      console.log(app.globalData.token)
      wx.showToast({
        icon: 'none',
        title: '载入帖子时出现错误：' + xxx.meta.message,
      })
    }
  });
}
