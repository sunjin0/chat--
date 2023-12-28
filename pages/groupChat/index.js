// pages/groupChat/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    show2: false,
    value: "",
    value2: "",
    groupName: "",
    groupChats: Object,
    result: null,
    userId: getApp().globalData.userInfo.userId
  },
  onAddChat() {
    this.setData({
      show: true,
      result: null
    })
  },
  onClose() {
    this.setData({
      show: false,
      show2: false
    });
  },
  onSearch() {
    if (this.data.value.trim() === "") {
      wx.showToast({
        title: '请输入内容...',
        icon: "none"
      })
      return;
    }
    wx.request({
      url: wx.host + '/user/groupChat/getGroupChat/' + this.data.value.trim(),
      method: "GET",
      header: wx.header,
      dataType: "json",
      success: (res) => {
        this.setData({
          value: "",
          result: res.data
        })
      }
    })
  },
  onAddGroupChat(e) {
    wx.request({
      url: wx.host + '/user/groupChatMember/addGroupChatMember',
      header: wx.header,
      method: "POST",
      dataType: "json",
      data: {
        groupChatId: e.currentTarget.dataset.id,
        userId: getApp().globalData.userInfo.userId
      },
      success: (res) => {
        wx.showToast({
          title: res.data.message,
        });
        this.onInitData()
      }
    })
  },
  onShowGroupChat() {
    this.setData({ show2: true })
  },
  onCreateGroupChat() {
    if (this.data.groupName.trim() === "") {
      wx.showToast({
        title: '请输入...',
        icon: "none"
      })
      return;
    }
    wx.request({
      url: wx.host + '/user/groupChat/createGroupChat',
      header: wx.header,
      method: "POST",
      data: {
        creatorId: getApp().globalData.userInfo.userId,
        groupName: this.data.groupName.trim()
      },
      dataType: "json",
      success: (res) => {
        wx.showToast({
          title: res.data.message,
        })
        this.setData({
          groupName: "",
          show2: false
        })
        this.onInitData()
      }
    })
  },
  onInitData() {
    wx.request({
      url: wx.host + '/user/groupChatMember/getGroupChatList/' + getApp().globalData.userInfo.userId,
      header: wx.header,
      dataType: "json",
      method: "GET",
      success: (res) => {
        this.setData({ groupChats: res.data })
      }
    })
  },
  onExitGroupChat(e) {
    const groupId = e.currentTarget.dataset.id;
    getApp().request2({
      url: "/user/groupChatMember/exitGroupChat",
      method: "POST",
      data: {
        groupChatId: groupId,
        userId: this.data.userId
      }
    }).then(res => {
      if (res.data) {
        wx.showToast({
          title: '退出成功',
        });
        this.onInitData();
      }
    });
  },
  onDeleteGroupChat(e) {
    const groupId = e.currentTarget.dataset.id;
    getApp().request2({
      url: "/user/groupChat/deleteGroupChat",
      method: "POST",
      data: {
        groupChatId: groupId,
        creatorId: this.data.userId
      }
    }).then(res => {
      console.log(res.data);
      if (res.data) {
        wx.showToast({
          title: '删除成功',
        });
        this.onInitData();
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.showLoading({
      title: '加载中...',
    })
    this.onInitData()
    wx.hideLoading();
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