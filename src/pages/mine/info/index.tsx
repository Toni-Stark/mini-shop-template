import { Image, View } from "@tarojs/components";
import Taro, { useLoad } from "@tarojs/taro";

import { useState } from "react";
import right from "../../../static/icon/right_icon.png";
import "./index.less";
import { HeaderView } from "../../../components/headerView/index";

export default function Info() {
  const [option, setOption] = useState({
    statusBarHeight: 0,
    barHeight: 0,
    videoHeight: 0,
    screenWidth: 0,
    screenHeight: 0,
  });

  useLoad(() => {
    let _option = option;
    const rect = Taro.getMenuButtonBoundingClientRect();
    _option.barHeight = rect.height;
    _option.statusBarHeight = rect.top;
    Taro.getSystemInfo({
      success: (res) => {
        _option.screenWidth = res.screenWidth;
        _option.screenHeight = res.screenHeight;
        _option.videoHeight = res.screenWidth / 0.72;
      },
    });

    setOption({ ..._option });
  });
  return (
    <View className="index">
      <HeaderView
        home={1}
        title="个人中心"
        barHeight={option.barHeight}
        statusBarHeight={option.statusBarHeight}
      />
      <View className="index_body">
        <View className="index_body_title">基本信息</View>
        <View className="index_body_label index_body_image">
          <View className="text">头像</View>
          <View className="view">
            <Image
              className="view_image"
              src="http://231110002.ldcvh.china-yun.net/source/dog.png"
            />
            <Image className="view_right" src={right} />
          </View>
        </View>
        <View className="index_body_label">
          <View className="text">姓名</View>
          <View className="view">
            <View className="view_text">请填写</View>
            <Image className="view_right" src={right} />
          </View>
        </View>
        <View className="index_body_label">
          <View className="text">生日</View>
          <View className="view">
            <View className="view_text">请选择</View>
            <Image className="view_right" src={right} />
          </View>
        </View>
        <View className="index_body_label">
          <View className="text">地区</View>
          <View className="view">
            <View className="view_text">请选择</View>
            <Image className="view_right" src={right} />
          </View>
        </View>
      </View>
    </View>
  );
}
