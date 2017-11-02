var util = require('../../utils/util.js') 
// 从从60到到0倒计时 
function countDays(y,m,d) {
  var x = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  var i =0;
  var s=0;
  for (i = 1; i < y; i++)
    if (i % 4 == 0 && i % 100 != 0 || i % 400 == 0)
      s += 366;//闰年
    else
      s += 365;//平年
  if (y % 4 == 0 && y % 100 != 0 || y % 400 == 0)
    x[2] = 29;

  for (i = 1; i < m; i++)
    s += x[i];//整月的天数
  s += d;//日的天数
  return s
}
function countTime(that) {
  var appInstance = getApp();
  var time = util.formatTime(new Date());
  var timestamp = Date.parse(new Date());
  timestamp = timestamp / 1000;
  var n = timestamp * 1000;
  var date = new Date(n);
  var Y = date.getFullYear();
  var M = date.getMonth() + 1
  var D = date.getDate()
  var stringM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
  var stringD = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  var h = date.getHours();
  var m = date.getMinutes();
  var s = date.getSeconds();
  var second0 = appInstance.baseHour * 3600 + appInstance.baseMinute * 60 + appInstance.baseSecond;
  var second1 = h * 3600 + m * 60 + s;
  var seconds = 0

  var days = countDays(Y, M, D) - countDays(appInstance.baseYear, appInstance.baseMonth, appInstance.baseDay)
  if(second1 >= second0)
    seconds = second1 - second0    
  else{
    days -= 1;
    seconds = 24*3600-second0+second1;
  }  
  
  h = seconds / 3600 + 0 ;
  m = seconds % 3600 / 60;
  s = seconds % 60;
  that.setData({ 
    days: days,
    time: time,  
    h: h < 10? '0'+Math.floor(h):Math.floor(h),
    m: m < 10? '0'+Math.floor(m):Math.floor(m),
    s: s < 10? '0'+s:s
  });    
  const ctx = wx.createCanvasContext('myCanvas')
  var R =100
  var x = R * Math.cos(Math.PI*(75-s)/30)
  var y = R * Math.sin(Math.PI*(75-s)/30)
  x = x + appInstance.width/2
  y = -y+appInstance.height/1.6
  ctx.arc(x,y, 10, 0, 2 * Math.PI)
  ctx.arc(appInstance.width / 2, appInstance.height / 1.6, 5, 0, 2 * Math.PI)
  ctx.setFillStyle('pink')
  
  ctx.fill()
    
  ctx.draw()     

  setTimeout(function () {
    countTime(that);
  }, 1000)
}

Page({
  data: {
    width: 0,
    height: 0,
    days: 0,
    time: 0,
    h :0,
    m:0,
    s:0,
    audioPoster: 'http://i.gtimg.cn/music/photo/mid_album_90/H/d/0044cysE1yorHd.jpg',
      audioName: 'The way you look tonight',
      audioAuthor: 'Frank Sinatra',
      audioSrc: 'http://ws.stream.qqmusic.qq.com/202467264.m4a?fromtag=46',

  },
  onLoad: function () {
    const backgroundAudioManager = wx.getBackgroundAudioManager()
    backgroundAudioManager.title = 'The way you look tonight'
    backgroundAudioManager.epname = 'Ultimate Sinatra'
    backgroundAudioManager.singer = 'Frank Signatra'
    backgroundAudioManager.coverImgUrl = 'http://i.gtimg.cn/music/photo/mid_album_90/H/d/0044cysE1yorHd.jpg'
    backgroundAudioManager.src = 'http://ws.stream.qqmusic.qq.com/202467264.m4a?fromtag=46' 
    var appInstance = getApp()    
    var that = this
    wx.getSystemInfo({
      success: function(res) {
        appInstance.width = res.windowWidth
        appInstance.height = res.windowHeight                       
      }
    })           
    this.setData({
      width: appInstance.width,
      height: appInstance.height
    })
    countTime(this);
  },
  onShareAppMessage: function() {
    return {
      title: "我们相遇的日子",
      path: '/page/user?id=123'
    }
  }
});   