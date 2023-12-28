// pages/addFriends/index.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    value: "",
    result: null,
    addState: "添加",
    friendRequestList: [],
    userId: null
  },
  onAdd(e) {
    const toId = e.currentTarget.dataset.id;
    const id = getApp().globalData.userInfo.userId;
    wx.getStorage({
      key: "toke",
      success: (res) => {
        wx.request({
          url: wx.host + '/user/friends/addFriends',
          method: "POST",
          header: {
            'Authorization': 'Bearer.' + res.data
          },
          data: {
            "userId": id,
            "toId": toId,
            "relationShipType": "Firend",
            "state": 0
          },
          success: (res) => {
            wx.showToast({
              title: res.data.message,
            })
            console.log(res.data);
            if (res.data.tag == "OK") {
              this.setData({ addState: res.data.message });
              getApp().publish(toId,JSON.stringify({userId:id,text:"",time:new Date(),name:"新的好友"}))
            }
          },
          fail: (res) => {
            console.error("出错了：" + res.errMsg);
          }
        })
      }
    });
    this.loadFreindsState();
  },
  OnAgree(e) {
    const toId = e.currentTarget.dataset.id;
    const toke = 'Bearer.' + getApp().globalData.token;
    const id = getApp().globalData.userInfo.userId;
    console.log(id + ":" + toId);
    wx.request({
      url: wx.host + '/user/friends/setFriendsStateById',
      method: "POST",
      dataType: "json",
      header: {
        'Authorization': toke
      },
      data: {
        "userId": id,
        "toId": toId
      },
      success: (res) => {
        let msg = res.data;
        if (msg.tag === "OK") {
          this.loadFreindsState();
          return;
        }
        wx.showToast({
          title: msg.message,
        })
      }
    })
  },
  OnShowModel() {
    this.setData({ show: true });
  },
  onClose() {
    this.setData({
      show: false,
      result: null
    });
  },
  OnSearch(event) {

    this.setData({
      result: null,
      addState: "添加"
    })
    const idOrEmail = event.detail;
    if (idOrEmail === "") {
      wx.showToast({
        title: 'ID或邮箱不能为空！',
      })
      return
    }
    wx.request({
      url: wx.host + '/user/searchUser/' + idOrEmail,
      method: "GET",
      dataType: "json",
      header: wx.header,
      success: (res) => {
        console.log(res.data);
        const info = JSON.parse(res.data);
        if (info.tag) {
          wx.showToast({
            title: info.message,
          })
          return;
        }
        this.setData({
          result: info
        });
      },
      fail: (res) => {
      }
    })
  },
  loadFreindsState() {
    const app = getApp();
    const id = app.globalData.userInfo.userId;
    this.setData({ userId: id });
    const toke = 'Bearer.' + app.globalData.token;
    wx.request({
      url: wx.host + '/user/friends/getFriendsStateById/' + id,
      method: "GET",
      header: {
        'Authorization': toke
      },
      dataType: "json",
      success: (res) => {
        const arry = res.data;
        // 所有图片信息获取完成后，更新数据
        this.setData({ friendRequestList: arry });

      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.loadFreindsState();
    getApp().readNewFriends();
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