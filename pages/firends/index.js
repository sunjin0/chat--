// pages/users/firends/index.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nums: {},
    friendsList: [],
    keys: []
  },
  getFirends(userId) {

  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.showLoading({
      title: '正在加载...',
      mask: true
    });
    const id = getApp().globalData.userInfo.userId
    wx.request({
      url: wx.host + '/user/friends/getFriends/' + id,
      header: wx.header,
      success: (res) => {
        const friends = res.data
        // 所有图片信息获取完成后，更新数据
        this.setData({
          friendsList: friends,
          keys: Object.keys(friends)
        });
        wx.hideLoading();
      }
    });
    this.setData({ nums: getApp().globalData.nums })
    getApp().$on("nums", (res) => {
      this.setData({ nums: res });
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    this.onLoad(0)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})