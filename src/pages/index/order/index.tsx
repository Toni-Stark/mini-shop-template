import { Image, View } from "@tarojs/components";
import Taro, { useLoad, useRouter, useDidShow } from "@tarojs/taro";
import "./index.less";
import { useMemo, useState } from "react";
import { HeaderView } from "../../../components/headerView/index";

import right from "../../../static/icon/right.png";
import {
  getAddrList,
  getOrderStatus,
  getPayAddOrder,
  getProduceInfo,
} from "@/common/interface";
import { GetStorageSync } from "@/store/storage";
import { THide, TShow } from "@/common/common";

let timer = null;
let times = 0;
export default function Order() {
  const router = useRouter();
  const [option, setOption] = useState({
    statusBarHeight: 0,
    barHeight: 0,
    refresh: false,
    num: undefined,
    sku: undefined,
    skuText: "",
    count: 0,
  });
  const [address, setAddress] = useState(undefined);
  const [addressList, setAddressList] = useState(undefined);
  const [info, setInfo] = useState(undefined);

  useDidShow(() => {
    const params = router.params;
    let _option = option;
    _option.sku = params.sku;
    const rect = Taro.getMenuButtonBoundingClientRect();
    _option.barHeight = rect.height;
    _option.statusBarHeight = rect.top;
    setOption({ ..._option });
    getProduceInfo().then((res) => {
      setInfo(res.data);
      let obj = res.data.sku.find((item) => params.sku == item.num);
      _option.skuText = obj.name;
      _option.count = params.sku * res.data.unit_price;
      setOption({ ..._option });
    });
  });
  useDidShow(() => {
    let id = GetStorageSync("addressId");
    getAddrList().then((res) => {
      let data = res.data;
      if (data.length > 0) {
        let info = {};
        if (id) {
          info = data.find((item) => item.id == id);
        }
        if (!info) {
          info = data[0];
        }
        setAddressList(data);
        setAddress(info);
      }
    });
  });
  const payStatus = (id) => {
    let bool = false;
    clearInterval(timer);
    timer = null;
    timer = setInterval(() => {
      if (bool == true) return;
      getOrderStatus({ order_id: id }).then((res) => {
        if (res.code !== 1) {
          THide();
          times = times + 1;
          if (times >= 3) {
            clearInterval(timer);
            timer = 0;
            TShow(res.msg);
          }
          return;
        }
        THide();
        TShow("支付成功");
        bool = true;
        naviToDetail(id);
      });
    }, 400);
  };

  const naviToDetail = (id) => {
    Taro.navigateTo("./detail/index?id=" + id);
  };
  const naviToList = () => {
    Taro.navigateTo("./list/index?type=2");
  };
  const confirmPay = () => {
    if (!address) {
      TShow("请设置收货地址");
      return;
    }
    getPayAddOrder({
      product_id: info.id,
      num: option.sku,
      addr_id: address.id,
    }).then((res) => {
      if (res.code != 200) {
        TShow(res.msg);
        return;
      }
      let data = res.data.json_params;
      Taro.requestPayment({
        timeStamp: data.time.toString(),
        nonceStr: data.nonce_str,
        package: data.package,
        signType: "RSA",
        paySign: data.sign,
        success: function (res) {
          THide();
          payStatus(data.order_id);
        },
        fail: function (err) {
          THide();
          let str = "fail";
          if (err.errMsg.indexOf("cancel") >= 0) {
            str = "cancel";
          }
          if (str == "cancel") {
            TShow("取消支付");
            naviToList();
          }
          if (str == "fail") {
            TShow("支付失败");
          }
          return;
        },
      });
    });
  };

  const settingAddress = () => {
    if (addressList.length <= 0) {
      Taro.navigateTo({
        url: "./address/index",
      });
    } else {
      Taro.navigateTo({
        url: "../../mine/delivery/index",
      });
    }
  };

  const currentContext = useMemo(() => {
    return (
      <View className="index_zone">
        {!address?.member_id ? (
          <View className="zone_label" onClick={settingAddress}>
            请补充收货地址
            <Image mode="widthFix" className="zone_label_image" src={right} />
          </View>
        ) : (
          <View className="zone_label" onClick={settingAddress}>
            收货地址：
            <View>{address?.addr}</View>
          </View>
        )}

        <View className="zone_label">
          配送方式
          <View>快递 免运费</View>
        </View>
        <View className="zone_card">
          <View className="label_content">
            <Image className="label_content_image" src={info?.product_img} />
            <View className="label_content_view">
              <View className="title">{info?.name}</View>
              <View className="content">
                <View className="content_price">
                  <View className="main_price">￥{info?.unit_price}</View>
                  <View className="eval_price">￥{info?.market_price}</View>
                </View>
                <View className="content_count">
                  <View className="content_count_num">{option?.skuText}</View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }, [option, info, address, addressList]);
  return (
    <View className="index">
      <HeaderView
        text="购买产品"
        barHeight={option.barHeight}
        height={option.statusBarHeight}
      />
      {currentContext}
      <View className="index_footer">
        <View className="index_footer_view">
          <View className="index_footer_view_text">应付：</View>
          <View className="index_footer_view_price">￥{option.count}</View>
        </View>
        <View className="index_footer_confirm" onClick={confirmPay}>
          微信支付
        </View>
      </View>
    </View>
  );
}
