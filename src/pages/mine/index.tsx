import { Image, View } from "@tarojs/components";
import Taro, { useLoad } from "@tarojs/taro";

import { useState } from "react";
import tag1 from "../../static/icon/tag1.png";
import tag2 from "../../static/icon/tag2.png";
import tag3 from "../../static/icon/tag3.png";
import nav1 from "../../static/icon/nav1.png";
import nav2 from "../../static/icon/area.png";
import "./index.less";
import { HeaderView } from "../../components/headerView/index";


export default function Mine() {
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

  const naviToInfo = () => {
    Taro.navigateTo({
      url: "./info/index",
    });
  };
  const naviToAllOrder = () => {
    Taro.navigateTo({
      url: "../index/order/list/index",
    });
  }
  const naviToDelivery = () => {
    Taro.navigateTo({
      url: "./delivery/index?type=1",
    });
  }
  const naviToOrderList = (num) => {
    Taro.navigateTo({
      url: "../index/order/list/index?type="+num,
    });
  }
  return (
    <View className="index">
      <HeaderView
        text="个人中心"
        barHeight={option.barHeight}
        height={option.statusBarHeight}
      />
      <View className="index_body">
        <View className="index_body_header">
          <Image
            mode="widthFix"
            onClick={naviToInfo}
            className="index_body_header_img"
            src="http://231110002.ldcvh.china-yun.net/source/dog.png"
          />
          微信昵称
        </View>
        <View className="index_body_tag">
          <View className="label_view">
            我的订单
            <View className="label_view_text" onClick={naviToAllOrder}>查看全部订单></View>
          </View>
          <View className="label_list">
            <View className="label_list_item" onClick={()=>naviToOrderList(-2)}>
              <Image className="image" src={tag1} />
              <View className="text">待付款</View>
            </View>
            <View className="label_list_item" onClick={()=>naviToOrderList(-1)}>
              <Image className="image" src={tag2} />
              <View className="text">待发货</View>
            </View>
            <View className="label_list_item" onClick={()=>naviToOrderList(1)}>
              <Image className="image" src={tag3} />
              <View className="text">待收货</View>
            </View>
          </View>
        </View>
        <View className="index_body_tag">
          <View className="label_list">
            <View className="label_list_item">
              <Image className="image" src={nav1} />
              <View className="text">客服聊天</View>
            </View>
            <View className="label_list_item" onClick={naviToDelivery}>
              <Image className="image" src={nav2} />
              <View className="text">收货地址</View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
