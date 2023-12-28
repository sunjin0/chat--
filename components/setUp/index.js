// components/post/index.js
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

  },

  /**
   * 组件的方法列表
   */
  methods: {
    colse() {
      this.triggerEvent("colse", false)
    },
    onExit() {
      wx.removeStorage({
        key: 'tags',
      });
      wx.removeStorage({
        key: 'replys',
      })
      wx.removeStorage({
        key: 'toke',
        success(res) {
          console.log(res);
          wx.reLaunch({
            url: '/pages/index/index',
          })
        }
      });

    }
  }
})
