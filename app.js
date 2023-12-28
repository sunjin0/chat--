// app.js
import GoEasy from './miniprogram/miniprogram_npm/goeasy/index'
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz_jpg/dK5kTHH2ZIEoYMFROtRH1cN5z65S0PFfADJUxPX3BQNGVAGE4EkrTetsAYU5EZbpxnTzKQ1ScticsiaLibBgfexhw/640?wx_fmt=jpeg';

wx.goEasy = GoEasy.getInstance({
  host: 'hangzhou.goeasy.io', //应用所在的区域地址: [hangzhou.goeasy.io, 新加坡暂不支持IM，敬请期待]
  appkey: 'BC-5ee15ba8328449e1b0de1bedd97ba14f', // common key
  modules: ['im', 'pubsub'] //根据需要，传入'im’或'pubusub'，或数组方式同时传入
});
const im = wx.goEasy.im;
App({
  eventBus: new Map(),
  messages: new Map(),
  replys: new Array(),
  $emit(eventName, data) {
    const callbacks = this.eventBus.get(eventName) || [];
    callbacks.forEach(callback => callback(data));
  },
  $on(eventName, callback) {
    const callbacks = this.eventBus.get(eventName) || [];
    callbacks.push(callback);
    this.eventBus.set(eventName, callbacks);
  },
  $off(eventName, callback) {
    const callbacks = this.eventBus.get(eventName) || [];
    const index = callbacks.findIndex(cb => cb === callback);
    if (index !== -1) {
      callbacks.splice(index, 1);
      this.eventBus.set(eventName, callbacks);
    }
  },
  //订阅消息
  subscribe(channelName) {
    wx.goEasy.pubsub.subscribe({
      channel: channelName,//替换为您自己的channel
      onMessage: (message) => { //收到消息
        const msg = JSON.parse(message.content)
        console.log("接收到:" + message.channel + " content:", msg);
        if (msg.name === "新的好友") {
          this.globalData.nums.b += 1;
          msg.isRead = false;
          this.replys.push(msg);
          // 触发事件通知监听者
          this.$emit('nums', this.globalData.nums);
          return;
        }
        if (msg.userId === this.globalData.userInfo.userId && msg.toId !== "001") {
          msg.isRead = false;
          this.replys.push(msg);
          this.globalData.nums.b = this.replys.filter(item => item.isRead === false).length;
          // 触发事件通知监听者
          this.$emit('nums', this.globalData.nums);
          wx.setStorage({
            key: "replys",
            data: this.replys
          })
        }
      },
      onSuccess: function () {
        console.log(channelName + "订阅成功。");
      },
      onFailed: function (error) {
        console.log(channelName + "订阅失败, 错误编码：" + error.code + " 错误信息：" + error.content)
      }
    })
  },
  publish(channel, content) {
    //发送
    wx.goEasy.pubsub.publish({
      channel: channel,//替换为您自己的channel
      message: content,//替换为您想要发送的消息内容
      qos: 1,
      onSuccess: function () {
        console.log("消息发布成功。");
      },
      onFailed: function (error) {
        console.log("消息发送失败，错误编码：" + error.code + " 错误信息：" + error.content);
      }
    });
  },
  uploadFile(fileUrl) {
    return new Promise(function (resolve, reject) {
      wx.uploadFile({
        url: wx.host + '/user/register/upload',
        filePath: fileUrl,
        name: 'file',
        formData: { userId: "self" },
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
  readAllReply() {
    wx.setStorage({
      key: "replys",
      data: this.replys
    })
    this.replys.map(item => {
      if (item.name === "系统通知") item.isRead = true
    })
    this.globalData.nums.b = this.replys.filter(item => item.name !== "系统通知" && item.isRead === false).length;
    // 触发事件通知监听者
    this.$emit('nums', this.globalData.nums);
    wx.setStorage({
      key: "replys",
      data: this.replys
    })
  },
  readNewFriends() {
    this.replys.map(item => {
      if (item.name === "新的好友") item.isRead = true
    })
    console.log(this.replys);
    this.globalData.nums.b = this.replys.filter(item => item.name !== "新的好友" && item.isRead === false).length;
    // 触发事件通知监听者
    this.$emit('nums', this.globalData.nums);
  },
  request2(option) {
    return new Promise((resolve, reject) => {
      if (option.method === undefined) option.method = "GET";
      wx.request({
        url: wx.host + option.url,
        data: option.data,
        dataType: "json",
        method: option.method,
        header: wx.header,
        success: (res) => {
          resolve(res);
        },
        fail: (res) => {
          reject(res);
        }
      })
    })
  },
  globalData: { //全局数据
    userInfo: null,
    token: null,
    conversations: null,
    nums: {},

  },
  onShow() {

  },
  throttle(fn, delay) {
    let timer = null;
    return function () {
      if (!timer) {
        timer = setTimeout(() => {
          fn.apply(this, arguments);
          timer = null;
        }, delay);
      }
    };
  },

  onLaunch() {
    wx.getStorage({ key: "replys" }).then(res => {
      this.replys = res.data;
      this.globalData.nums.b = this.replys.filter(item => item.isRead === false).length;
      // 触发事件通知监听者
      this.$emit('nums', this.globalData.nums);
    }).catch(error => {
      console.log(error);
    })
    wx.throttle = this.throttle();
    // 通过Promise封装getImageInfo方法，返回Promise对象
    wx.host = "http://localhost:8787";
    //监听和接收单聊消息
    im.on(GoEasy.IM_EVENT.PRIVATE_MESSAGE_RECEIVED, this.onPrivateMessageReceived);
    //接收群消息
    im.on(GoEasy.IM_EVENT.GROUP_MESSAGE_RECEIVED, this.onGroupMessageReceived);
    //监听会话列表更新
    im.on(GoEasy.IM_EVENT.CONVERSATIONS_UPDATED, this.onConversationsUpdated);
  },
  //监听会话列表更新
  onConversationsUpdated(conversations) {
    console.log(conversations);
    this.globalData.nums.a = conversations.unreadTotal + "";
    this.globalData.conversations = conversations;
    // 触发事件通知监听者
    this.$emit('nums', this.globalData.nums);
    // 触发事件通知监听者
    this.$emit('conversations', this.globalData.conversations);
  },
  //监听和接收单聊消息
  onPrivateMessageReceived(message) {
    let msg = this.messages;
    const msgData = {
      id: message.senderId,
      senderId: 1,
      sendTime: message.timestamp,
      content: message.payload.text
    };
    if (msg.has(message.senderId)) {
      this.messages.get(message.senderId).push(msgData)
    } else {
      msg.set(message.senderId, [msgData]);
    }
    this.$emit("messages", this.messages);
  },
  //发送私聊
  sendPrivateChat(inputValue, toUser) {
    //创建消息, 内容最长不超过3K，可以发送字符串，对象和json格式字符串
    let textMessage = im.createTextMessage({
      text: inputValue, //消息内容
      to: {
        type: GoEasy.IM_SCENE.PRIVATE, //私聊还是群聊，群聊为GoEasy.IM_SCENE.GROUP
        id: toUser.userId, //接收方用户id
        data: {
          "avatar": toUser.avatar,
          "nickname": toUser.temporary
        } //接收方用户扩展数据, 任意格式的字符串或者对象，用于更新会话列表conversation.data
      }
    });
    //发送消息
    im.sendMessage({
      message: textMessage,
      onSuccess: (message) => { //发送成功
        console.log(message);
        let msg = this.messages;
        const msgData = {
          id: message.senderId,
          senderId: 0,
          sendTime: message.timestamp,
          content: message.payload.text
        };
        if (msg.has(message.receiverId)) {
          this.messages.get(message.receiverId).push(msgData)
        } else {
          msg.set(message.receiverId, [msgData]);
        };
        this.$emit("messages2", this.messages);
        wx.request({
          url: wx.host + "/user/privateMessage/addPrivateMessage",
          header: wx.header,
          method: "POST",
          data: {
            senderId: message.senderId,
            receiverId: message.receiverId,
            content: message.payload.text,
            sendTime: null,
          },
          dataType: "json",
          success: (res) => {
            console.log(res);
          }
        })
      },
      onFailed: function (error) { //发送失败
        console.log('Failed to send private message，code:' + error.code + ' ,error ' + error.content);
      }
    });
  },
  //发送群聊
  sendPublicChat(inputValue, groupChatInfo) {
    //创建消息, 内容最长不超过3K，可以发送字符串，对象和json格式字符串
    var textMessage = im.createTextMessage({
      text: inputValue, //消息内容
      to: {
        type: GoEasy.IM_SCENE.GROUP,   //私聊还是群聊，私聊为GoEasy.IM_SCENE.PRIVATE
        id: groupChatInfo.groupChatId,  //群id
        data: { "avatar": defaultAvatarUrl, "nickname": groupChatInfo.groupName } //群信息, 任意格式的字符串或者对象，用于更新会话列表中的群信息conversation.data
      }
    });
    //发送消息
    im.sendMessage({
      message: textMessage,
      onSuccess: (message) => {  //发送成功
        console.log("Group message sent successfully.", message);
        const msg = {
          senderId: 0,
          userId: this.globalData.userInfo.userId,
          sendTime: message.timestamp,
          id: message.groupId,
          nickname: message.senderData.nickname,
          content: message.payload.text,
          avatar: this.globalData.userInfo.avatar
        }
        if (this.messages.has(message.groupId)) {
          this.messages.get(message.groupId).push(msg)
        } else {
          this.messages.set(message.groupId, [msg])
        }
        this.$emit("publicMsg", this.messages.get(message.groupId))
        console.log(this.messages);
      },
      onFailed: function (error) { //发送失败
        console.log("Failed to send group message, code:" + error.code + ",error:" + error.content);
      }
    });
  },
  //监听和接收群聊消息
  onGroupMessageReceived(message) {
    console.log("received group message:", message);

    const msg = {
      senderId: 1,
      userId: message.senderId,
      sendTime: message.timestamp,
      id: message.groupId,
      nickname: message.senderData.nickname,
      content: message.payload.text,
      avatar: message.senderData.avatar
    }
    if (this.messages.has(message.groupId)) {
      this.messages.get(message.groupId).push(msg)
    } else {
      this.messages.set(message.groupId, [msg])
    }
    this.$emit("publicMsg2", this.messages.get(message.groupId));
    console.log(this.messages);
  },
  //订阅群消息
  subscribeGroup(groupIds) {
    im.subscribeGroup({
      groupIds: groupIds,
      onSuccess: function () {  //订阅成功
        console.log("Group message subscribe successfully.");
      },
      onFailed: function (error) { //订阅失败
        console.log("Failed to subscribe group message, code:" + error.code + " content:" + error.content);
      }
    }
    )
  }
})
