// pages/retrievePassword/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    email: "",
    pwd: "",
    pwd2: "",
    isSMS: true,
    time: 60 * 60 * 16.9,
    code: "",
  },
  sendSMS() {
    this.setData({
      isSMS: false
    })
    wx.showToast({
      title: '发送成功',
    });

  },
  countFinish() {
    this.setData({
      isSMS: true
    })
  },
  submit() {
    const datas = this.data;
    if (datas.email === "" || datas.code === "" || datas.pwd === "" || datas.pwd2 === "") {
      wx.showToast({
        title: '请将表单填写完整',
        icon: "none"
      })
    } else {
      if (datas.pwd.length >= 8 && datas.pwd2.length >= 8) {
        if (datas.pwd !== datas.pwd2) {
          wx.showToast({
            title: '二次密码不一致',
            icon: "none"
          })
        } else {
          wx.showModal({
            title: '提示',
            content: '请确认',
            complete: (res) => {
              if (res.cancel) {

              }

              if (res.confirm) {
                wx.request({
                  url: wx.host + '/user/changePassword',
                  method: "POST",
                  data: {
                    temporary: this.data.code,
                    email: this.data.email,
                    password: this.data.pwd
                  },
                  dataType: "json",
                  success: (res) => {
                    if (res.data) {
                      wx.showToast({
                        title: '修改成功',
                      })
                      wx.reLaunch({
                        url: '/pages/index/index',
                        success() {
                          wx.removeStorage({
                            key: 'info',
                          });
                          wx.removeStorage({
                            key: 'toke',
                          });
                        }
                      })
                    }
                  }
                })
              }
            }
          })
        }
      } else {
        wx.showToast({
          title: '密码最少8位',
        })
      }
    }
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