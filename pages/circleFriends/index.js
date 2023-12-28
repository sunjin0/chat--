// pages/users/circleFriends/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 1,
    labels: [],
    canConfirm: false,
    isHaveInterest: false,
    nums: Object,
    posts: [],
    postsLength: 10,
    followPosts: [],
    followPostsLength: 10,
    selectedId: [],
    height: 0,
    height2: 0,
    isLoading: true,
    isNew: true
  },
  onLabelTap(e) {
    const index = e.currentTarget.dataset.index;
    const labels = this.data.labels;
    const selected = !labels[index].selected;
    labels[index].selected = selected;
    const selectedLabels = labels.filter(label => label.selected);
    this.setData({
      labels: labels,
      canConfirm: selectedLabels.length > 0
    });
    if (selectedLabels.length > 4) {
      wx.showToast({
        title: '最多只能选择4个标签',
        icon: 'none'
      });
      labels[index].selected = false;
      this.setData({
        labels: labels,
        canConfirm: selectedLabels.length > 0
      });
    }
  },
  onFollow(e) {
    this.setData({ followPostsLength: e.detail })
  },

  onConfirmTap() {
    if (!this.data.canConfirm) {
      return;
    }
    const selectedId = this.data.labels.map(item => {
      if (item.selected) {
        return item;
      }
    }).filter(item => item != null).map(item => item.tagId);
    this.setData({
      isHaveInterest: true,
      selectedId
    })
    wx.setStorage({
      key: "tags",
      data: selectedId
    })
    // TODO: 处理确认按钮点击事件，比如跳转到下一个页面
    this.recommendedBasedOnLabels()
  },
  //按标签推荐
  recommendedBasedOnLabels() {
    if (this.data.postsLength === 10) {
      wx.request({
        url: wx.host + '/user/post/recommendedBasedOnLabels',
        method: "POST",
        header: wx.header,
        data: {
          "userId": getApp().globalData.userInfo.userId,
          "array": this.data.selectedId,
          "current": 1
        },
        dataType: "json",
        success: (res) => {
          let posts = res.data;
          posts.forEach(item => {
            item.post.img = JSON.parse(item.post.img);
          });
          posts = this.data.posts.concat(posts);
          console.log(posts);
          this.setData({
            posts,
            postsLength: res.data.length
          })
        }
      })
    }
  },
  onChange(event) {
  },
  //去搜索页面
  onToSearch() {
    wx.navigateTo({
      url: '/pages/search/index',
    })
  },
  //加载标签
  onLoadTags() {
    wx.request({
      url: wx.host + '/user/tags/getTags',
      method: "GET",
      header: wx.header,
      dataType: 'json',
      success: (res) => {
        const tags = res.data;
        tags.forEach(item => {
          item.selected = false;
        })
        this.setData({ labels: tags });
      }
    });
  },
  // 推荐帖子
  loadPosts() {
    if (this.data.postsLength < 10) {
      wx.showToast({
        title: '没有了',
        icon: "error"
      });
      return;
    }
    this.setData({ isLoading: false })
    wx.request({
      url: wx.host + '/user/post/recommendPost/' + getApp().globalData.userInfo.userId,
      method: "GET",
      header: wx.header,
      dataType: 'json',
      success: (res) => {
        let posts = res.data;
        posts.forEach(item => {
          item.post.img = JSON.parse(item.post.img);
        });
        posts = this.data.posts.concat(posts)
        this.setData({
          posts,
          postsLength: res.data.length,
          isLoading: true
        });
        console.log(posts);
      }
    });
  },
  // 推荐关注人的帖子
  loadFollowPosts() {
    if (this.data.followPostsLength < 10) {
      wx.showToast({
        title: '没有了',
        icon: "error"
      });
      return;
    }
    this.setData({ isLoading: false })
    wx.request({
      url: wx.host + '/user/post/followRecommendations/' + getApp().globalData.userInfo.userId,
      method: "GET",
      header: wx.header,
      dataType: 'json',
      success: (res) => {
        let followPosts = res.data;
        console.log(followPosts);
        followPosts.forEach(item => {
          item.post.img = JSON.parse(item.post.img);
        })
        followPosts = this.data.followPosts.concat(followPosts)
        this.setData({
          followPosts,
          followPostsLength: res.data.length,
          isLoading: true
        })
      }
    });
  },
  onBottom() {
    console.log("热门到底了");
    if (this.data.isLoading) {
      this.data.isNew ? this.recommendedBasedOnLabels() : this.loadPosts();
    }
  },
  onBottom2() {
    console.log("关注到底了");
    if (this.data.isLoading) {
      this.loadFollowPosts();
    }
  },
  getHeight() {
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          height: res.windowHeight,
          height2: res.windowHeight
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getHeight()
    wx.showLoading({
      title: '加载中...',
    })
    //消息接受
    this.setData({ nums: getApp().globalData.nums })
    getApp().$on("nums", (datas) => {
      this.setData({ nums: datas })
    });
    //是否新用户
    wx.request({
      url: wx.host + '/user/post/newUserOrNot/' + getApp().globalData.userInfo.userId,
      method: "GET",
      header: wx.header,
      dataType: 'json',
      success: (res) => {
        this.setData({ isNew: res.data })
        console.log(res.data);
        if (res.data) {
          // 获取标签
          wx.getStorage({
            key: "tags",
            success: (res) => {
              this.setData({
                selectedId: res.data,
                isHaveInterest: true
              });
              this.recommendedBasedOnLabels()
            },
            fail: (res) => {
              console.log(res);
              this.onLoadTags()

            }
          });
          this.loadFollowPosts();
          return;
        }
        this.loadPosts();
        this.loadFollowPosts();
        this.setData({ isHaveInterest: true })
      }
    });
    wx.hideLoading()
  },
  // 推荐帖子

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