const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const ajax = function(url, data, cb) {
  wx.request({
    url: url,
    data: data,
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    method: 'POST',
    success: function (xxx) {
      cb && cb(xxx.data);
    },
    fail: function (xxx) {
      cb && cb({
        meta: 250,
        message: '出现系统错误'
      });
    }
  })
}

const num2time = function (nums,full) {
  var time = parseInt(nums);//转换为数字类型
  var unixTimestamp = new Date(time * 1000);
  var timeStamp = unixTimestamp.getTime();//后台传来的时间戳！important


  var start = new Date();
  var currTime = start.getTime();//现在的手机的时间戳！important

  start.setHours(0);
  start.setMinutes(0);
  start.setSeconds(0);
  start.setMilliseconds(0);
  var todayStartTime = Date.parse(start);//今天0:00的时间戳 ！important
  var todayEndTime = todayStartTime + 86400000;//今天结束时候 ！important

  //精确到分的 时间戳时间获取
  var year = unixTimestamp.getFullYear();
  var mon = unixTimestamp.getMonth() + 1;
  var day = unixTimestamp.getDate();
  var hour = unixTimestamp.getHours();
  var mins = unixTimestamp.getMinutes();

  if (mins >= 0 && mins <= 9) {
    mins = "" + "0" + mins;
  }
  if (hour >= 0 && hour <= 9) {
    hour = "" + "0" + hour;
  }

  //一天是 【86400000】 毫秒
  if (full == true || currTime < timeStamp) {//显示完全模式 如果后台传来的时间戳 也是这样
    return year + '-' + mon + '-' + day + ' ' + hour + ':' + mins;
  }

  if (timeStamp >= todayStartTime && timeStamp <= todayEndTime) {//今天的时间
    return '今天' + ' ' + hour + ':' + mins;
  } else if (timeStamp >= (todayStartTime - 86400000) && timeStamp <= (todayEndTime - 86400000)) {//昨天的时间
    return '昨天' + ' ' + hour + ':' + mins;
  } else {//不是今天 不是昨天
    if (start.getFullYear() == year) {//今年
      if (start.getMonth() + 1 == mon) {//如果是今年的今月
        return '本月' + day + '号 ' + hour + ':' + mins;
      }
      return mon + '月' + day + '号 ' + hour + ':' + mins;
    } else if (start.getFullYear() - 1 == year) {//去年
      return '去年' + ' ' + mon + '月 ' + day + '号 ' + hour + ':' + mins;
    } else {//剩余的年份
      return year + '-' + mon + '-' + day + ' ' + hour + ':' + mins;
    }
  }
}

module.exports = {
  formatTime: formatTime,
  ajax : ajax,
  num2time: num2time
}
