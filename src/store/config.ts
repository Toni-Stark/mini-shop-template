import Taro from "@tarojs/taro";

const envConf = {
  // 开发版-本地环境
  develop: {
    mode: "dev",
    DEBUG: false,
    VCONSOLE: true,
    appid: "wx2b63e1935c7fa58f",
    // BASE_URL: "http://dev.shortvideo.ink/api/abc123/",
    BASE_URL: "http://s.shop.local.com/api/",
  },
  // 体验版-测试环境
  trial: {
    mode: "test",
    DEBUG: false,
    VCONSOLE: false,
    appid: "wx2b63e1935c7fa58f",
    BASE_URL: "https://video.test.jixuejima.com/api/dsadfs/",
  },
  // 正式版-正式环境
  release: {
    mode: "prod",
    DEBUG: false,
    VCONSOLE: false,
    appid: "wx2b63e1935c7fa58f",
    BASE_URL: "https://video.test.jixuejima.com/api/dsadfs/",
  },
};
export const env = envConf[Taro.getAccountInfoSync().miniProgram.envVersion];
