// pages/users/my/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:getApp().globalData.userInfo,
    mainPage:false,
    components:[true,true,true,true,true,true],
    nums:Object
  },
  onClick(e){
    const index=e.currentTarget.dataset.index
    this.data.components[index]=false
    this.setData({
      mainPage:true,
      components:this.data.components
    })
  },
  onClose(e){
   this.setData({
     mainPage:e.detail,
     components:this.data.components.map(item=>item=true)
   })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({ nums: getApp().globalData.nums })
    getApp().$on("nums", (res) => {
      this.setData({ nums:res })
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