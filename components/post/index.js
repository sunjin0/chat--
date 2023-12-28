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
    items: [],
    isChildrenShow: true,
    fileList: [],
    columns: [''],
    tagShow: false,
    address: '',
    tag: "",
    tagId: 0,
    content: "",
    state: 1
  },


  /**
   * 组件的方法列表
   */
  methods: {
    uploadFile(file) {
      return new Promise(function (resolve, reject) {
        wx.uploadFile({
          url: wx.host + '/user/post/upload',
          header: wx.header,
          filePath: file.url,
          name: 'file',
          formData: { userId: getApp().globalData.userInfo.userId },
          success: function (res) {
            // 处理上传成功的逻辑
            resolve(res.data);
          },
          fail: function (error) {
            // 处理上传失败的逻辑
            reject(error);
          }
        });
      });
    },
    submit() {
      if (this.data.content === '') {
        wx.showToast({
          title: '请输入内容',
          icon: "none"
        })
        return;
      }
      const imgList = [];
      // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
      const promism = [];
      this.data.fileList.forEach(file => {
        const state = this.uploadFile(file).then(res => imgList.push(res));
        promism.push(state)
      });
      Promise.all(promism).then(() => {
        //  发布帖子
        wx.request({
          url: wx.host + '/user/post/addOrUpdatePost',
          method: "POST",
          header: wx.header,
          dataType: 'json',
          data: {
            userId: getApp().globalData.userInfo.userId,
            content: this.data.content,
            state: this.data.state,
            address: this.data.address,
            tagId: this.data.tagId,
            img: JSON.stringify(imgList)
          },
          success: (res) => {
            wx.showToast({
              title: res.data.message,
              icon: "none",
              duration:6000
            })
            if(res.data.tag==="error")return;
            this.setData({
              content: '',
              tag: '',
              address: '',
              fileList: [],
              hide: false,
              isChildrenShow: true
            });
            this.onLoadData();
          }
        });
      })




    },
    onShowTag() {
      this.setData({ tagShow: !this.data.tagShow })
    },
    onChange(event) {
      const { picker, value, index } = event.detail;
      this.setData({
        tag: value.text,
        tagId: value.tagId
      })
    },
    colse() {
      this.triggerEvent("colse", false)
    },
    onOpenPost() {
      this.setData({
        hide: true,
        isChildrenShow: false
      })
    },
    onChildrenColse() {
      this.setData({
        hide: false,
        isChildrenShow: true,
        address: '',
        tag: ''
      })
    },
    afterRead(event) {
      const { file } = event.detail;
      const { fileList = [] } = this.data;
      fileList.push({ ...file, url: file.url })
      this.setData({ fileList })
    },
    onDelete(event) {
      const fileList = this.data.fileList
      fileList.splice(event.detail.index, 1)
      this.setData({
        fileList
      })
    },
    onChooseLocation(event) {
      wx.chooseLocation({
        success: (res) => {
          this.setData({ address: res.name })
        }
      })
    },
    onDeleteById(event) {
      wx.request({
        url: wx.host + '/user/post/deletePostByPostId/' + event.currentTarget.dataset.id,
        method: "GET",
        header: wx.header,
        dataType: 'json',
        success: (res) => {
          console.log(res.data);
          wx.showToast({
            title: res.data.message,
            icon:"none"
          }),
            this.onLoadData()
        }
      });
    },
    onLoadData(){
       // 获取帖子
       wx.request({
        url: wx.host + '/user/post/getPostListById/' + getApp().globalData.userInfo.userId,
        method: "GET",
        header: wx.header,
        dataType: 'json',
        success: (res) => {
          this.setData({ items: res.data })
        }
      });
    }
  },
  lifetimes: {
    ready() {
      this.onLoadData()
       // 获取标签
       wx.request({
        url: wx.host + '/user/tags/getTags',
        method: "GET",
        header: wx.header,
        dataType: 'json',
        success: (res) => {
          const tags = res.data;
          tags.forEach(item => {
            item.text = item.name;
          })
          this.setData({ columns: this.data.columns.concat(tags) })
        }
      });
    }
  }
})
