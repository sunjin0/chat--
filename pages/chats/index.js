// pages/chats/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    messages: [],
    toUser: null,
    avatarUrl: getApp().globalData.userInfo.avatar,
    inputValue: "",
    height: "",
    id: getApp().globalData.userInfo.userId,
    scrollView: Object,
    once: true,
    current: 1,
    isLoading: false,
    pages: 0,
    toId: null
  },
  onSend() {
    if (this.data.inputValue.trim() === "") {
      wx.showToast({
        title: '请输入信息...',
      })
      return
    }
    getApp().sendPrivateChat(this.data.inputValue.trim(), this.data.toUser);
    this.setData({
      inputValue: ''
    });

  },
  onDetails(e) {
    wx.navigateTo({
      url: '/pages/userDetails/index?userId=' + e.currentTarget.dataset.id,
    })
  },
  onScroll(event) {
    console.log('滑动到顶部，开始加载数据...');

    this.setData({ once: false })
    if (!this.data.isLoading && this.data.pages >= this.data.current) {
      wx.showLoading({
        title: 'Load',
      })
      this.setData({ isLoading: true })
      this.onLoadData(this.data.current);
    }
  },
  onOnceData() {
    wx.showLoading({
      title: 'Load',
    })
    this.onLoadData(this.data.current);
    getApp().messages.set(this.data.toId + "", [])
    this.setData(
      {
        once: false,
      });
  },
  onLoadData(current) {
    wx.request({
      url: wx.host + '/user/privateMessage/getPrivateMessageById',
      header: wx.header,
      dataType: "json",
      method: "POST",
      data: {
        senderId: getApp().globalData.userInfo.userId,
        receiverId: this.data.toUser.userId,
        content: current,
      },
      success: (res) => {
        const msg = res.data.records
        console.log(res.data);
        const id = this.data.toUser.userId + "";
        const ms = getApp().messages.get(id)
        if (getApp().messages.has(id)) {
          getApp().messages.set(id, msg.concat(ms));
        } else {
          getApp().messages.set(id, msg);
        }
        console.log(msg);
        this.setData({
          messages: msg.concat(ms),
          current: ++this.data.current,
          isLoading: false,
          pages: res.data.pages
        });
        wx.hideLoading()
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({ toId: options.id })
    wx.showLoading({
      title: '加载中...',
    });
    wx.request({
      url: wx.host + '/user/friends/getFriendsInfoById',
      header: wx.header,
      method: "POST",
      data: {
        userId: this.data.id,
        toId: options.id
      },
      success: (res) => {
        const data = res.data;
        console.log(data);
        this.setData({ toUser: data });
        this.setData({ messages: getApp().messages.get(data.userId + "") });
        getApp().$on("messages", (res) => {
          this.setData({ messages: res.get(this.data.toUser.userId + "") })
        });
        getApp().$on("messages2", (res) => {
          this.setData({ messages: res.get(this.data.toUser.userId + "") })
        })
        wx.setNavigationBarTitle({
          title: this.data.toUser.temporary
        })

      }
    });
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