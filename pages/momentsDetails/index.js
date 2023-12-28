// pages/momentsDetails/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    post: Object,
    comments: [{}],
    current: 1,
    postId: "",
    message: '',
    toId: "",
    commentId: "",
    userId: getApp().globalData.userInfo.userId,
    placeholder: "请输入信息",
    clear: false,
  },
  report() {
    wx.showModal({
      title: '提示，请输入举报内容',
      content: '',
      editable: true,
      complete: (res) => {
        if (res.cancel) {

        }

        if (res.confirm) {
          getApp().publish("001", JSON.stringify({
            userId: getApp().globalData.userInfo.userId,
            toId: "001",
            text: this.data.postId + "帖子:" + res.content,
            time: new Date()
          }))
        }
      }
    })

  },
  onCommentShow(e) {
    const index = e.currentTarget.dataset.index;
    let comments=this.data.comments;
    comments[index].showReply=!comments[index].showReply;
    this.setData({comments})
  },
  onReply(e) {
    this.setData({
      toId: e.currentTarget.dataset.toid,
      placeholder: "@" + e.currentTarget.dataset.username,
      commentId: e.currentTarget.dataset.commentid,
      clear: true
    })
  },
  onClearMessage() {
    this.setData({
      toId: '',
      placeholder: "请输入信息",
      commentId: "",
      clear: false
    })
  },
  onLoadComment(postId) {
    if (this.data.comments != []) {
      wx.request({
        url: wx.host + '/post/comment/getCommentByPostId/' + postId + '/' + this.data.current,
        method: "GET",
        header: wx.header,
        dataType: "json",
        success: (res) => {
          res.data.forEach(c => c.showReply = true);
          console.log(res.data);
          this.setData({
            comments: res.data,
            current: ++this.data.current
          })
        }
      })
    } else {
      wx.showToast({
        title: '已经到底了',
        icon: "none"
      })
    }
  },
  onSendMessage() {
    if (this.data.message.trim() === "") {
      wx.showToast({
        title: '请输入信息',
        icon: 'none'
      });
      return;
    }
    this.sendMessage(this.data.toId, getApp().globalData.userInfo.username + "回复了你的信息")
  },
  sendMessage(toId, content) {
    this.setData({ current: --this.data.current });
    // 帖子信息保存与信息提醒
    if (this.data.toId === "") {
      wx.request({
        url: wx.host + '/post/comment/setCommentByPostId',
        method: "POST",
        header: wx.header,
        data: {
          postId: this.data.postId,
          userId: getApp().globalData.userInfo.userId,
          content: this.data.message.trim()
        },
        dataType: "json",
        success: (res) => {
          if (res.data) {
            wx.showToast({
              title: '发送成功！',
              icon: "success"
            })
            this.onLoadComment(this.data.postId);
            this.onClearMessage();
          }
          if (toId !== "" || toId !== getApp().globalData.userInfo.userId) {
            getApp().publish(toId, content);
          }
        }
      });
    } else {
      wx.request({
        url: wx.host + '/post/comment-reply/setCommentReply',
        method: "POST",
        header: wx.header,
        data: {
          commentId: this.data.commentId,
          userId: getApp().globalData.userInfo.userId,
          toId: this.data.toId,
          content: this.data.message.trim()
        },
        dataType: "json",
        success: (res) => {
          if (res.data) {
            wx.showToast({
              title: '发送成功！',
              icon: "success"
            })
            this.onLoadComment(this.data.postId);
            this.setData({ message: "" });
          }
          if (toId !== "" || toId !== getApp().globalData.userInfo.userId) {
            getApp().publish(toId, content);
          }
        }
      });
    }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

    wx.request({
      url: wx.host + '/user/post/history/addBrowsingHistory',
      method: "POST",
      header: wx.header,
      data: {
        userId: getApp().globalData.userInfo.userId,
        postId: options.id
      },
      dataType: "json",
      success: (res) => {
        console.log(res.data);
      }
    });
    wx.request({
      url: wx.host + '/user/post/getPostById/' + options.id,
      method: "GET",
      header: wx.header,
      dataType: "json",
      success: (res) => {
        const post = res.data;
        post.post.img = JSON.parse(post.post.img);
        console.log(post.post.userId);
        this.setData({
          post,
          postId: options.id
        })
      }
    });
    this.onLoadComment(options.id);
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