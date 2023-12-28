// components/login/login.js
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
    isChecked: false, // 用于存储单选框的选中状态
    phone: null,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    checkboxChange: function () {
      if (this.data.isChecked === false) {
        this.data.isChecked = true;
      } else {
        this.data.isChecked = false;
      }
      console.log("选择框是否选中:" + this.data.isChecked)
    },
    submit: function () {
      const regex = /^1[3456789]\d{9}$/;
      if (!regex.test(this.data.phone)) {
        wx.showToast({
          title: '请输入电话号码',
          icon:"none"
        })
      } else if (!this.data.isChecked) {
        wx.showToast({
          title: '请阅读并同意服务协议',
          icon:"none"
        })
      } else {
        console.log(this.data);
       this.triggerEvent("hideEvent",{data:false,phone:this.data.phone},{});
      }
    },
    onChange(event) {
      this.data.phone = event.detail;
      // event.detail 为当前输入的值
    },
  }
})