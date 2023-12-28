// components/cell/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showText: {
      type: String,
      value: "abc"
    },
    barIsShow: {
      type: Boolean,
      value: true
    },
    url: {
      type: String,
      value: ''
    },
    images: {
      type: Array,
      value: [
        "https://img2.baidu.com/it/u=955956276,3392954639&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500",
        "https://img1.baidu.com/it/u=1937685938,389960891&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500",
        "https://img1.baidu.com/it/u=165764012,751844309&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500",
        "https://img1.baidu.com/it/u=944697300,871888326&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500",
        "https://img0.baidu.com/it/u=139558335,3352675390&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500",
        "https://img1.baidu.com/it/u=1254923215,2657662548&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500",
        "https://img0.baidu.com/it/u=4196418831,3741244744&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500",
        "https://img1.baidu.com/it/u=3720453631,1862620957&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=615",
        "https://img1.baidu.com/it/u=2653221185,2546760652&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500",
      ]
    },
    info: {
      type: Object,
      value: {
        id: "05522",
        username: "爱吃炒面I",
        avatar: "https://img0.baidu.com/it/u=4043094945,2572384192&fm=253&fmt=auto&app=120&f=JPEG?w=800&h=800",
        followCount: "600人关注了他",
        share: 542,
        comment: 234,
        like: 854,
        isLike: false,
        post: {
          publishTime: "2023-10-23",
          content: ` 在这个繁华喧嚣的世界里，我们时常忘记去关注内心深处的声音。我们忙于追求物质的满足，却忘了去滋养自己的心灵。但请记住，你的价值不仅仅在于你拥有的财富或成就，而更重要的是你内心的善良和真诚。尽管生活中的困难和挫折可能会让你感到疲惫和困惑，但请相信，你拥有足够的力量去克服它们。你的勇气、毅力和信念是战胜困难的最强武器。不要害怕失败，因为每一次失败都是你走向成功的阶梯。请你保持对生活的热爱，对世界的好奇，对人的善良。学会欣赏生活中的美好，感恩你所拥有的一切。你会发现，生活中的每一个瞬间都是那么的珍贵和有意义。最后，请记住，你是独一无二的，你有自己的价值和使命。不要因为他人的眼光而改变自己，不要因为短暂的困难而放弃自己的理想。坚持自己的信念，相信自己的力量，你会发现，成功和幸福就在你身边。愿你在这个世界上，活出自己的色彩，找到内心的宁静与和谐。希望这段鸡汤能给你带来一些鼓励和启示，祝你每一天都充满阳光和希望！`,
        },
        isFollow: false,
      }
    },
  },
  observers: {
    "info":function(n){
   
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    active: 1,
    selfId: getApp().globalData.userInfo.userId
  },

  /**
   * 组件的方法列表
   */
  methods: {

    onCliklike() {
      const number = this.data.info.like;
      if (this.data.info.isLike === false) {
        this.setData({
          'info.like': number + 1,
          'info.isLike': true,
        });
        getApp().throttle(this.addLike(), 2000);
      } else {
        this.setData({
          'info.like': number - 1,
          'info.isLike': false,
        });
        getApp().throttle(this.subLike(), 2000);
      }
    },
    addLike() {
      wx.request({
        url: wx.host + '/user/like/setLikeByPostId',
        method: "POST",
        header: wx.header,
        data: {
          postId: this.data.info.post.postId,
          userId: this.data.selfId,
        },
        dataType: "json",
        success: (res) => {
          console.log(res.data);
        }
      })
    },
    subLike() {
      wx.request({
        url: wx.host + '/user/like/deleteLikeByUserId',
        method: "POST",
        header: wx.header,
        data: {
          postId: this.data.info.post.postId,
          userId: this.data.selfId,
        },
        dataType: "json",
        success: (res) => {
          console.log(res.data);
        }
      })
    },
    onAttention() {
      let url="";
      if (this.data.info.isFollow === false) {
        this.setData({
          'info.isFollow': true,
        });
        url="/user/follow/setFollowing";
      } else {
        this.setData({
          'info.isFollow': false,
        });
        url="/user/follow/cancelFollowing";
      }
      this.triggerEvent("follow",10);
      getApp().throttle(this.follow(url),2000);
    },
    follow(url){
      wx.request({
        url: wx.host + url,
        method: "POST",
        header: wx.header,
        data: {
          followingId: this.data.info.post.userId,
          userId: this.data.selfId,
        },
        dataType: "json",
        success: (res) => {
          console.log(res.data);
        }
      })
    },
    onShowImg(e) {
      wx.previewImage({
        current: e.currentTarget.dataset.img,
        urls: this.data.images,
      })
    },
  }
})