// components/browsingHistory/index.js

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
    items: [],
  },


  /**
   * 组件的方法列表
   */
  methods: {
    colse() {
      this.triggerEvent("colse", false)
    },
    onLoadData() {
      // 获取帖子
      wx.request({
        url: wx.host + '/user/post/history/getHistoryListById/' + getApp().globalData.userInfo.userId,
        method: "GET",
        header: wx.header,
        dataType: 'json',
        success: (res) => {
          if (res.data.tag) {
            return;
          }
          this.setData({ items: res.data })
        }
      });
    }
  },
  lifetimes: {
    ready() {
      this.onLoadData()
    }
  }
})

