import { GetStorageSync } from "@/store/storage";

export const getFormUrl = (paramObj) => {
  var sdata = [];
  for (var attr in paramObj) {
    if (paramObj[attr]) {
      sdata.push(attr + "=" + filter(paramObj[attr]));
    }
  }
  return sdata.join("&");
};

function filter(str) {
  // 特殊字符转义
  str += ""; // 隐式转换
  str = str.replace(/%/g, "%25");
  str = str.replace(/\+/g, "%2B");
  str = str.replace(/ /g, "%20");
  str = str.replace(/\//g, "%2F");
  str = str.replace(/\?/g, "%3F");
  str = str.replace(/&/g, "%26");
  str = str.replace(/\=/g, "%3D");
  str = str.replace(/#/g, "%23");
  return str;
}

export const getSex = (str) => {
  let arr = ["未知", "男", "女"];
  return arr[str];
};

export const getIsNull = (str) => {
  if (!str || str.trim().length == 0) {
    return true;
  }
  return false;
};
export const getIsStatus = (str) => {
  let obj = {
    "-2": "未发货",
    "-1": "已发货",
    "1": "已收货",
  };
  if (obj.hasOwnProperty(str)) {
    return obj[str];
  }
  return undefined;
};
