// components/userdetails/index.js

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    hide: {
      type: Boolean,
      value: true
    },
    noSelf: {
      type: Boolean,
      value: false
    },
    userId: {
      type: Number,
      value: getApp().globalData.userInfo.userId
    }
  },
  observers: {
    "userId": function (n) {
      if (n != 0) {
       this.onLoadData()
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    userInfo: Object,
    isClick: true
  },
  lifetimes: {
    attached() {
      this.onLoadData()
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    colse() {
      this.triggerEvent("colse", false)
    },
    onBoi(e) {
      if (e.detail.trim() !== "") {
        this.setData({ "userInfo.bio": e.detail })
      }
      this.setData({ isClick: false })
    },
    onUserName(e) {
      if (e.detail.trim() !== "") {
        this.setData({ "userInfo.username": e.detail })
      }
      this.setData({ isClick: false })
    },
    onSubmit() {
      const time = this.data.userInfo.registrationDate;
      this.setData({ "userInfo.registrationDate": null });
      wx.request({
        url: wx.host + '/user/updateUserInfoById',
        header: wx.header,
        data: this.data.userInfo,
        method: "POST",
        dataType: "json",
        success: (res) => {
          wx.showToast({
            title: res.data.message,
          })
          this.setData({ isClick: true })
        }
      })
      this.setData({ "userInfo.registrationDate": time });
    },
    onLoadData(){
      wx.request({
        url: wx.host + '/user/getUserInfoById/' + this.properties.userId,
        header: wx.header,
        method: "GET",
        dataType: "json",
        success: (res) => {
          const info = res.data;
          this.setData({ userInfo: info })
        }
      })
    }

  }
})
