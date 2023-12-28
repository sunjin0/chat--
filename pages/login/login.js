// pages/login.js、

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isChecked: false, // 用于存储单选框的选中状态
    show: false,
    show2: false,
    showLogin: true,
    phone: "",
    or: false
  },
  checkboxChange: function () {
    if (this.data.isChecked === false) {
      this.data.isChecked = true;
    } else {
      this.data.isChecked = false;
    }
    console.log("选择框是否选中:" + this.data.isChecked)
  },
  openModel: function () {
    this.setData({
      show: true
    })
  },
  openModel2: function () {
    this.setData({
      show2: true
    })
  },
  onClose() {
    this.setData({
      show: false
    });
  },
  onClose2() {
    this.setData({
      show2: false
    });
  },
  onHideEvent(event) {
    this.setData({
      showLogin: event.detail.data
    })
    this.setData({
      phone: event.detail.phone
    })
  },
  emailClick() {
    this.onClose()
    this.setData({
      or: false
    })
  },
  phoneClick() {
    this.onClose()
    this.setData({
      or: true
    })
  },
  wxLogin(){

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // wx.showTabBar()
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