// components/loginForm/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    phone: String
  },

  /**
   * 组件的初始数据
   */
  data: {
    pwd: "",
    Email:"",
    isEmail:true
  },

  /**
   * 组件的方法列表
   */
  methods: {
    submit: function () {
      if (this.data.pwd === "" || this.data.pwd.length < 8) {
        wx.showToast({
          title: '密码最少8位数',
          icon: "none"
        })
      } else {
        wx.showToast({
          title: '登入成功',
        })
      }
    },
    onChange: function (e) {
      this.setData({
        pwd: e.detail
      })
    }
  }
})