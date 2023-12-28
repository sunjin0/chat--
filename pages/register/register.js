// pages/register/register.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    username: "",
    email: "",
    pwd: "",
    pwd2: "",
    sex: "",
    avatarUrl: "",
    isSMS: true,
    time: 60 * 60 * 17,
    code: "",
  },
  onName(e) {
    this.setData({ username: e.detail.value })
    console.log(this.data.username);
  },
  onChooseAvatar(e) {
    const {
      avatarUrl
    } = e.detail;
    console.log(avatarUrl);
    this.setData({
      avatarUrl,
    })
  },
  sendSMS() {
    if (this.data.email === "") {
      wx.showToast({
        title: '请输入邮箱！',
        icon: "none"
      })
      return;
    }
    wx.request({
      url: wx.host + '/user/code',
      method: "POST",
      data: {
        "email": this.data.email
      },
      success: (res) => {
        if (res.data.tag !== "Warn") {
          this.setData({
            isSMS: false
          })
        }
        wx.showToast({
          title: res.data.message,
          icon: "error"
        })
      }
    })
  },
  countFinish() {
    this.setData({
      isSMS: true
    })
  },
  // 数据监听
  observers: {
    // 'time':function(time){
    //   console.log(this.data.time);
    // }
  },
  onRadioChange(e) {
    this.setData({
      sex: e.detail
    })
  },
  submit() {
    const datas = this.data;
    if (datas.username === "" || datas.sex === "" || datas.email === "" || datas.code === "" || datas.pwd === "" || datas.pwd2 === "") {
      wx.showToast({
        title: '请将表单填写完整',
        icon: "none"
      });
      return;
    }
    if (this.data.pwd.length >= 8 && this.data.pwd2.length >= 8) {

      if (datas.pwd !== datas.pwd2) {
        wx.showToast({
          title: '二次密码不一致',
          icon: "none"
        });
        return;
      }
      getApp().uploadFile(this.data.avatarUrl).then(res => {
        this.setData({ avatarUrl: res });
        wx.request({
          url: wx.host + '/user/register',
          method: 'POST',
          data: {
            "username": datas.username,
            "email": datas.email,
            "password": datas.pwd,
            "sex": datas.sex,
            "avatar": this.data.avatarUrl,
            "temporary": datas.code,
            "name": "",
            "registrationDate": "",
            "bio": "",
            "interests": ""
          },
          success(res) {
            if (res.data.message === "Successful") {
              wx.reLaunch({
                url: '/pages/login/login',
              })
            }
          }
        })
      })

      return;
    }
    wx.showToast({
      title: '密码最少8位',
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