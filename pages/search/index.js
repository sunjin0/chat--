// pages/search/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    value: '',
    result: []
  },
  onSearch() {
    console.log('搜索' + this.data.value);
    if (this.data.value.trim() === "") {
      return;
    }
    getApp().throttle(this.loadData(), 2000);
  },
  loadData() {
    wx.request({
      url: wx.host + '/user/post/fuzzyQueryPost/' + this.data.value,
      method: "GET",
      header: wx.header,
      dataType: "json",
      success: (res) => {
        let result = res.data
        console.log(result);
        result.forEach(item => {
          item.img = JSON.parse(item.img);
        })
        this.setData({
          value: "",
          result
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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