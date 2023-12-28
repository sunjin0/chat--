// pages/gChats/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    messages: [],
    groupChatInfo: null,
    avatarUrl: getApp().globalData.userInfo.avatar,
    inputValue: "",
    height: "",
    id: getApp().globalData.userInfo.userId,
    scrollView: Object,
  },
  onSend() {
    if (this.data.inputValue.trim() === "") {
      wx.showToast({
        title: '请输入信息...',
      })
      return
    }
    getApp().sendPublicChat(this.data.inputValue, this.data.groupChatInfo);
    this.setData({
      inputValue: ''
    });

  },
  onDetails(e){
    wx.navigateTo({
      url: '/pages/userDetails/index?userId='+e.currentTarget.dataset.id,
    })
  },
  onGchatDetails(){
    wx.navigateTo({
      url: '/pages/gChatDetails/index?id='+this.data.groupChatInfo.groupChatId,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(this.data.messages);
    // 在页面逻辑代码中调用 wx.getSystemInfo 方法
    wx.getSystemInfo({
      // 获取设备信息成功的回调函数
      success: (res) => {
        // 可以通过 res.windowHeight 获取屏幕高度
        const screenHeight = res.windowHeight;
        this.setData({ height: screenHeight });
      },
      // 获取设备信息失败的回调函数
      fail: (res) => {

      }
    });
    wx.request({
      url: wx.host + '/user/groupChat/getGroupChat/' + options.id + "".trim(),
      method: "GET",
      header: wx.header,
      dataType: "json",
      success: (res) => {
        this.setData({
          groupChatInfo: res.data,
          messages: getApp().messages.get(res.data.groupChatId+"")
        });
        wx.setNavigationBarTitle({
          title: res.data.groupName
        });
      }
    });

    getApp().$on("publicMsg", (res) => {
      this.setData({ messages: res })
    });
    getApp().$on("publicMsg2", (res) => {
      this.setData({ messages: res })
    })
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