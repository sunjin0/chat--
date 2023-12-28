// components/post/index.js
import GoEasy from '../../miniprogram/miniprogram_npm/goeasy/index'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    hide: {
      type: Boolean,
      value: true
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    contact: ""
  },

  /**
   * 组件的方法列表
   */
  methods: {
    colse() {
      this.triggerEvent("colse", false)
    },
    handleSubmit() {
      this.sendService(JSON.stringify({
        userId: getApp().globalData.userInfo.userId,
        toId: "001",
        text: this.data.contact,
        time: new Date()
      }));
      this.setData({ contact: "" });
      wx.showToast({
        title: '反馈成功',
        icon: "success"
      })
      this.colse()
    },
    sendService(inputValue) {
      getApp().publish("001", inputValue);
    }
  },
  lifetimes: {
    attached() {
    }
  }
})
