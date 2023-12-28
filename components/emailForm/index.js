// components/loginForm/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    pwd: "",
    email: ""
  },

  /**
   * 组件的方法列表
   */
  methods: {
    submit: function () {
      if (this.data.email === "") {
        wx.showToast({
          title: '请输入邮箱',
          icon: "none"
        })
        return;
      }
      if (this.data.pwd === "" || this.data.pwd.length < 8) {
        wx.showToast({
          title: '密码最少8位数',
          icon: "none"
        })
        return;
      }
      wx.request({
        url: wx.host + '/user/login',
        method: "POST",
        header: {
          'Authorization': "Bearer"
        },
        data: {
          "email": this.data.email,
          "password": this.data.pwd
        },
        dataType: "json",
        success: (res) => {
          let info = JSON.parse(res.data);
          if (info.tag === "Warn") {
            wx.showToast({
              title: info.message,
              icon: "none"
            })
          } else {
            getApp().globalData.token = info.temporary;
            getApp().globalData.userInfo = info;
            wx.setStorage({ key: 'info', data: info });
            wx.setStorage({ key: 'toke', data: info.temporary });
            wx.reLaunch({
              url: '/pages/msg/index',
            })
          }

        },
        fail: (res) => {
          console.log(res);
        }
      })


    },
    onChange: function (e) {
      this.setData({
        pwd: e.detail
      })
    }
  }
})