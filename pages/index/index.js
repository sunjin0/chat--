// index.js


Page({
  data: {

  },
  // 事件处理函数
  onLoad() {
    // wx.hideTabBar()
    wx.getStorage({
      key: "toke",
      success: (res) => {
        if (res.data === null) {
          return false;
        }
        wx.reLaunch({
          url: '/pages/msg/index',
        })
      }
    })
  }

})