// pages/userDetails/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: Object,
    checked: false,
    show: false,
    userId: null,
    toId: null,
    notFriend: true
  },
  showPopup() {
    this.setData({ show: true });
  },

  onClose() {
    this.setData({ show: false });
  },
  // 备注
  onNotes() {
    wx.showModal({
      title: '修改备注',
      editable: true,
      complete: (res) => {
        if (res.cancel) {

        }
        if (res.confirm) {
          wx.request({
            url: wx.host + '/user/friends/changeRemarks',
            header: wx.header,
            method: "POST",
            data: {
              userId: this.data.userId,
              toId: this.data.toId,
              toNotes: res.content
            },
            dataType: "json",
            success: (res) => {
              console.log(res.data);
              this.onLoadData();
            }
          })
        }
      }
    })
  },
  // 屏蔽
  onShield(e) {
    // 需要手动对 checked 状态进行更新
    this.setData({
      checked: e.detail
    });
  },
  onShowImg() {
    wx.previewImage({
      current: this.data.userInfo.avatar,
      urls: [this.data.userInfo.avatar],
    })
  },
  onDel() {
    wx.showModal({
      title: "确定删除？",
      success: (res) => {
        if (res.confirm) {
          wx.request({
            url: wx.host + '/user/friends/deleteFriend',
            dataType: "json",
            header: wx.header,
            method:"POST",
            data: {
              userId: this.data.userId,
              toId: this.data.toId
            },
            success: (res) => {
              console.log(res.data);
             wx.navigateBack(1)
            }
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoadData() {
    wx.request({
      url: wx.host + '/user/friends/getFriendsInfoById',
      header: wx.header,
      method: "POST",
      data: {
        userId: this.data.userId,
        toId: this.data.toId
      },
      dataType: "json",
      success: (res) => {
        this.setData({ userInfo: res.data });
      }
    })
  },
  onLoad(options) {
    this.setData({
      userId: options.userId,
      toId: options.id,
    });
    if (this.data.toId === undefined) {
      this.setData({ notFriend: Boolean(options.notFriend) })
      wx.request({
        url: wx.host + '/user/getUserInfoById/' + options.userId,
        header: wx.header,
        method: "GET",
        dataType: "json",
        success: (res) => {
          this.setData({ userInfo: res.data });
        }
      });
      return;
    }
    this.onLoadData()
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