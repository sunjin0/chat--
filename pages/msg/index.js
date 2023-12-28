// pages/msg/index.js
// 定义格式化时间过滤器


Page({

  /**
   * 页面的初始数据
   * {
      id: 2155223,
      tag: 1,
      newTime: "17:32",
      newMesg: "早上好",
      userName: "超人强",
      imgUrl: "/static/images/tx.webp"
    }
   */
  data: {
    userList: [],
    messageNum: null,
    nums: Object
  },
  onClose(event) {
    const {
      position,
      instance
    } = event.detail;
    instance.close()
  },
  onChat(e) {
    const id = e.currentTarget.dataset.id;
    const groupId = e.currentTarget.dataset.groupid;
    const type = e.currentTarget.dataset.type;
    console.log(e);
    if (type === "group") {
      wx.navigateTo({ url: `/pages/gChats/index?id=` + groupId, })
      return;
    }
    wx.navigateTo({ url: `/pages/chats/index?id=` + id, })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
  
    wx.getStorage({
      key: 'toke',
      success: (res) => {
        getApp().globalData.token = res.data;
        wx.header = {
          'Authorization': 'Bearer.' + res.data,
        };
      }
    });
    wx.getStorage({
      key: 'info',
      success: (res) => {
        wx.userId = res.data.userId;
        getApp().globalData.userInfo = res.data;
        //建立连接
        if (getApp().globalData.userInfo != null) {
          console.log("开始链接服务器...");
          wx.goEasy.connect({
            id: getApp().globalData.userInfo.userId, //im必填，最大长度60字符
            data: {
              "avatar": getApp().globalData.userInfo.avatar,
              "nickname": getApp().globalData.userInfo.username
            }, //必须是一个对象，im必填，最大长度300字符，显示在会话列表中
            onSuccess: function () { //连接成功
              console.log("GoEasy connect successfully.") //连接成功
              getApp().subscribe("001");
              getApp().subscribe(getApp().globalData.userInfo.userId)
            },
            onFailed: function (error) { //连接失败
              console.log("Failed to connect GoEasy, code:" + error.code + ",error:" + error.content);
            },
            onProgress: function (attempts) { //连接或自动重连中
              console.log("GoEasy is connecting", attempts);
            }
          });

        };
        //订阅群聊
        wx.request({
          url: wx.host + '/user/groupChatMember/getGroupChatList/' + getApp().globalData.userInfo.userId,
          header: wx.header,
          dataType: "json",
          method: "GET",
          success: (res) => {
            getApp().subscribeGroup(res.data.map(item => item.groupChatId));
          }
        })
      }
    });
    getApp().$on('conversations', (data) => {
      let userList = data.conversations;
      console.log(userList);
      // 执行变化后的操作
      this.setData({ userList });
    });
    this.setData({ nums: getApp().globalData.nums })
    getApp().$on("nums", (res) => {
      this.setData({ nums: res })
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
    wx.getStorage({
      key: "toke",
      success(res) {
        const toke = res.data;
        wx.request({
          url: wx.host + '/user/login',
          method: "POST",
          header: {
            'Authorization': 'Bearer.' + toke,
          },
          data: {

          },
          dataType: "json",
          success: (res) => {
            let info = res.data;
            if (info.tag === "Warn") {
              // toke过期删除，返回主页面
              wx.removeStorage({
                key: 'toke',
              })
              wx.reLaunch({
                url: '/pages/index/index',
              })
            }
          },
          fail: (res) => {
            console.log(res);
          }
        })
      }
    });
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
    this.onLoad(0);
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