export default defineAppConfig({
  pages: [
    "pages/index/index",
    "pages/index/detail/index",
    "pages/index/order/index",
    "pages/index/order/address/index",
    "pages/index/order/list/index",
    "pages/index/order/detail/index",
    "pages/mine/delivery/index",
    "pages/mine/index",
    "pages/mine/info/index",
  ],
  window: {
    navigationStyle: "custom",
    backgroundTextStyle: "light",
    navigationBarBackgroundColor: "#fff",
    navigationBarTitleText: "WeChat",
    navigationBarTextStyle: "black",
  },
  tabBar: {
    custom: false,
    list: [
      {
        pagePath: "pages/index/index",
        text: "首页",
        iconPath: "./static/tabbar/ze-home.png",
        selectedIconPath: "./static/tabbar/ze-wap-home.png",
      },
      {
        pagePath: "pages/mine/index",
        text: "我的",
        iconPath: "./static/tabbar/antOutline-user.png",
        selectedIconPath: "./static/tabbar/antOutline.png",
      },
    ],
    color: "#101010",
    selectedColor: "#FF2525", // 选中状态下的文本颜色
    backgroundColor: "#ffffff", // 背景颜色
    fontSize: 14,
  },
});
