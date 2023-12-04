import { Image, View } from "@tarojs/components";
import Taro, { useLoad, useRouter } from "@tarojs/taro";
import "./index.less";
import { useMemo, useState } from "react";
import { HeaderView } from "../../../../components/headerView/index";

import shop from "../../../../static/icon/shop.png";
import { getOrderInfo } from "@/common/interface";
import { TShow } from "@/common/common";

export default function Order() {
  const router = useRouter();
  const [option, setOption] = useState({
    statusBarHeight: 0,
    barHeight: 0,
    refresh: false,
    id: "",
  });
  const [info, setInfo] = useState(undefined);
  useLoad(() => {
    const params = router.params;
    let _option = option;
    _option.id = params?.id;
    const rect = Taro.getMenuButtonBoundingClientRect();
    _option.barHeight = rect.height;
    _option.statusBarHeight = rect.top;
    setOption({ ..._option });
    getDetailInfo(params?.id);
  });
  const handleCopy = (text) => {
    Taro.setClipboardData({
      data: text,
      success: function () {
        Taro.showToast({
          title: "复制成功",
          icon: "success",
        });
      },
      fail: function () {
        Taro.showToast({
          title: "复制失败",
          icon: "none",
        });
      },
    });
  };
  const getDetailInfo = (id) => {
    getOrderInfo({ order_id: id }).then((res) => {
      if (res.code != 200) {
        TShow(res.msg);
        return;
      }
      console.log(res);
      setInfo(res.data);
    });
  };
  const currentContext = useMemo(() => {
    return (
      <View className="index_zone">
        <View className="zone_card">
          <View className="label_content">
            <Image
              className="label_content_image"
              src={info?.product?.product_img}
            />
            <View className="label_content_view">
              <View className="title">{info?.product?.name}</View>
              <View className="content">
                <View className="quantity">{info?.quantity}</View>
              </View>
            </View>
          </View>
        </View>
        <View className="zone_card">
          <View className="zone_card_text">
            商品总价
            <View className="zone_card_text_value">￥{info?.total_price}</View>
          </View>
          <View className="zone_card_text">
            实付款
            <View className="zone_card_text_value red">
              ￥{info?.total_price}
            </View>
          </View>
          <View className="zone_card_text">
            订单编号
            <View
              className="zone_card_text_desc"
              onClick={() => {
                handleCopy(info?.order_id);
              }}
            >
              {info?.order_id} | <View className="copy">复制</View>
            </View>
          </View>
          <View className="zone_card_text">
            收货人信息
            <View className="zone_card_text_value">
              {info?.receiver_name}，{info?.receiver_mobile}，{info?.address}
            </View>
          </View>
          <View className="zone_card_text">
            支付方式 <View className="zone_card_text_value">微信</View>
          </View>
          <View className="zone_card_text">
            下单时间
            <View className="zone_card_text_value">{info?.created_time}</View>
          </View>
          <View className="zone_card_text">
            付款时间
            <View className="zone_card_text_value">{info?.pay_time}</View>
          </View>
          <View className="zone_card_text">
            发货时间
            <View className="zone_card_text_value">{info?.shipping_time}</View>
          </View>
        </View>
        <View style={{ width: "100%", height: "50Px" }} />
      </View>
    );
  }, [option, info]);
  return (
    <View className="index">
      <HeaderView
        text="订单详情"
        barHeight={option.barHeight}
        height={option.statusBarHeight}
      />
      {currentContext}
    </View>
  );
}
