import { Image, View } from "@tarojs/components";
import Taro, { useDidShow, useLoad, useRouter } from "@tarojs/taro";
import "./index.less";
import { useMemo, useState } from "react";
import { HeaderView } from "../../../components/headerView/index";

import edit from "../../../static/icon/edit.png";
import { getAddrList } from "@/common/interface";
import { SetStorageSync } from "@/store/storage";

export default function Delivery() {
  const router = useRouter();
  const [option, setOption] = useState({
    statusBarHeight: 0,
    barHeight: 0,
    refresh: false,
    id: "",
    title: "",
    count: 1,
    payType: 1,
    type: 0,
  });
  const [addressList, setAddressList] = useState([]);
  useDidShow(() => {
    const params = router.params;
    let _option = option;
    _option.title = params.title;
    _option.type = params?.type;
    _option.id = params.type;
    const rect = Taro.getMenuButtonBoundingClientRect();
    _option.barHeight = rect.height;
    _option.statusBarHeight = rect.top;
    setOption({ ..._option });
    getAddrList().then((res) => {
      if (res.data.length > 0) {
        setAddressList(res.data);
      }
    });
  });

  const naviToAddEddress = (e, id) => {
    e.stopPropagation();
    Taro.navigateTo({
      url: "../../index/order/address/index?id=" + id,
    });
  };
  const chooseItem = (id) => {
    SetStorageSync("addressId", id);
    if (!option?.type) {
      Taro.navigateBack();
    }
  };
  const currentContext = useMemo(() => {
    return (
      <View className="index_zone">
        {addressList?.map((item, index) => {
          return (
            <View
              className="index_zone_item"
              onClick={() => chooseItem(item.id)}
            >
              <View className="index_zone_item_content">
                <View className="title">
                  {item?.receiver_name}
                  <View className="phone">{item?.mobile}</View>
                </View>
                <View className="desc">{item.addr}</View>
              </View>
              <Image
                className="index_zone_item_edit"
                onClick={(e) => {
                  naviToAddEddress(e, item.id);
                }}
                src={edit}
              />
            </View>
          );
        })}
      </View>
    );
  }, [addressList]);
  return (
    <View className="index">
      <HeaderView
        text="收货地址"
        barHeight={option.barHeight}
        height={option.statusBarHeight}
      />
      {currentContext}
      <View className="index_footer">
        <View
          className="index_footer_confirm"
          onClick={() => naviToAddEddress(e)}
        >
          新增地址
        </View>
      </View>
    </View>
  );
}
