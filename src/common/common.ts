import Taro from "@tarojs/taro";
import {
  GetStorageSync,
  RemoveStorageSync,
  SetStorageSync,
} from "@/store/storage";
import { env } from "@/store/config";

const checkLoginUrl = env.BASE_URL + "member/login";

export const getLogin = () => {
  return new Promise((resolve, reject) => {
    Taro.login({
      complete: (loginRes) => {
        if (!loginRes.code) return;
        Taro.request({
          url: checkLoginUrl,
          header: { "Content-Type": "application/x-www-form-urlencoded" },
          data: { code: loginRes.code },
          method: "POST",
          success: function (res) {
            let { code, data } = res.data;
            if (res.statusCode === 300)
              return Taro.showToast({ title: "网络超时", icon: "none" });
            if (code === 200) return resolve(data);
            TShow(data.msg);
            return reject(data);
          },
        });
      },
    });
  });
};

export const TShow = (text, icon = "none", duration = 1500) => {
  return new Promise((resolve) => {
    Taro.showToast({
      title: text,
      icon,
      duration,
    }).then(() => {
      resolve();
    });
  });
};
export const THide = () => {
  Taro.hideLoading();
};
