import { View, ScrollView, Image, Input, Button } from "@tarojs/components";
import Taro, { useDidShow, useLoad, useRouter } from "@tarojs/taro";
import "taro-ui/dist/style/components/loading.scss";
import "./index.less";
import { useMemo, useState } from "react";
import { HeaderView } from "../../../../components/headerView/index";

import {
  getOrderConfirm,
  getOrderIndex,
  getOrderPay,
  getOrderStatus,
  getPayAddOrder,
} from "@/common/interface";
import { getIsStatus } from "@/common/tools";
import { THide, TShow } from "@/common/common";
import { AtModal, AtModalAction, AtModalContent, AtModalHeader } from "taro-ui";

let timer = null;
let times = 0;
export default function List() {
  const router = useRouter();
  const [option, setOption] = useState({
    statusBarHeight: 0,
    barHeight: 0,
    screenWidth: 0,
    screenHeight: 0,
    more: false,
    refresh: false,
    active: -99,
    p: 1,
  });
  const [loading, setLoading] = useState(false);
  const [scrollOpacity, setScrollOpacity] = useState(0);
  const [list, setList] = useState([
    {
      title: "全部",
      id: -99,
    },
    {
      title: "代付款",
      id: -2,
    },
    {
      title: "待发货",
      id: -1,
    },
    {
      title: "待收货",
      id: 1,
    },
  ]);
  const [dataList, setDataList] = useState([]);
  const [current, setCurrent] = useState({
    show: false,
    id: "",
  });

  useLoad(() => {
    console.log(1, option);
    const params = router.params;
    let _option = option;
    _option.active = params?.type;
    setOption({ ..._option });
  });

  useDidShow(() => {
    console.log(2, option);
    let _option = option;
    const rect = Taro.getMenuButtonBoundingClientRect();
    _option.barHeight = rect.height;
    _option.statusBarHeight = rect.top;
    Taro.getSystemInfo({
      success: (res) => {
        _option.screenWidth = res.screenWidth;
        _option.screenHeight = res.screenHeight;
      },
    });

    setOption({ ..._option });
    getDataList(option.active, 1);
  });

  const getDataList = (active, p) => {
    getOrderIndex({ status: active, p }).then((res) => {
      let list = [...dataList];
      if (p == 1) {
        list = res.data;
      } else {
        list = list.concat(res.data);
      }
      setDataList(list);
      setOption({ ...option, active, p, refresh: false });
      setTimeout(() => {
        setLoading(true);
      }, 500);
    });
  };
  const addScrollList = () => {
    getDataList(option.active, option.p + 1);
  };
  const refreshChange = () => {
    setOption({ ...option, refresh: true });
    getDataList(option.active, 1);
  };
  const onScroll = (e) => {
    if (scrollOpacity === 0 && e.detail.scrollTop >= option.screenHeight) {
      setScrollOpacity(1);
    }
    if (scrollOpacity > 0 && e.detail.scrollTop < option.screenHeight) {
      setScrollOpacity(0);
    }
  };
  const checkBar = (val) => {
    setOption({ ...option, active: val });
    getDataList(val, 1);
  };
  const naviToAddress = (e, id) => {
    e.stopPropagation();
    Taro.navigateTo({
      url: "../address/index?id=" + id + "&type=11",
    });
  };
  const naviToModal = (e, id) => {
    e.stopPropagation();
    setCurrent({
      show: true,
      id,
    });
  };

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
  const naviToPay = (e, id) => {
    e.stopPropagation();
    getOrderPay({ order_id: id }).then((res) => {
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
          }
          if (str == "fail") {
            TShow("支付失败");
          }
          return;
        },
      });
    });
  };
  const naviToDetail = (id) => {
    Taro.navigateTo({
      url: "../detail/index?id=" + id,
    });
  };
  const handleCancel = () => {
    setCurrent({
      show: false,
      id: "",
    });
  };
  const handleConfirm = () => {
    getOrderConfirm({ order_id: current.id }).then((res) => {
      if (res.code != 200) return;
      setCurrent({
        show: false,
        id: "",
      });
      TShow("收货成功");
      setTimeout(() => {
        getDataList();
      }, 1500);
    });
  };
  const currentContext = useMemo(() => {
    return (
      <View className="index_zone">
        <ScrollView
          className="index_zone_view"
          id="scroll_view"
          scrollY
          scrollWithAnimation={true}
          refresherEnabled={true}
          refresherTriggered={option.refresh}
          refresherBackground="#ffffff"
          onRefresherRefresh={refreshChange}
          lowerThreshold={30}
          onScrollToLower={addScrollList}
          enhanced
          onScroll={onScroll}
        >
          <View id="top" />
          <View className="index_zone_view_content">
            <View className="navi-data">
              {dataList.map((item, index) => {
                return (
                  <View
                    onClick={() => naviToDetail(item.order_id)}
                    className="navi-data-item"
                  >
                    <View className="header">
                      <View className="header-view"></View>
                      <View className="header-text">
                        {getIsStatus(item.express_status)}
                      </View>
                    </View>
                    <View className="content">
                      <Image
                        className="content-image"
                        src={item.product.logo}
                      />
                      <View className="content-context">
                        <View className="title">{item.product.name}</View>
                        <View className="count">
                          <View className="count-main">
                            ￥{item.total_price}
                          </View>
                          <View className="count-eval">{item.quantity}</View>
                        </View>
                      </View>
                    </View>
                    <View className="footer">
                      {item.express_status == -2 ? (
                        <View
                          className="button"
                          onClick={(e) => naviToPay(e, item.order_id)}
                        >
                          去付款
                        </View>
                      ) : null}
                      {item.express_status == -2 ? (
                        <View
                          className="button"
                          onClick={(e) => naviToAddress(e, item.order_id)}
                        >
                          修改地址
                        </View>
                      ) : null}
                      {item.express_status == -1 ? (
                        <View
                          className="button button-active"
                          onTap={(e) => naviToModal(e, item.order_id)}
                        >
                          确认收货
                        </View>
                      ) : null}
                    </View>
                  </View>
                );
              })}
            </View>
            <View className="index-footer">
              {option.more ? (
                <View className="index-footer-view">加载中...</View>
              ) : (
                <View className="index-footer-view">暂无更多</View>
              )}
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }, [option]);
  return (
    <View className="index">
      <HeaderView
        text="订单列表"
        barHeight={option.barHeight}
        height={option.statusBarHeight}
      />
      <View className="bar_list">
        {list.map((item) => {
          let str = "bar_list_item";
          if (item.id == option.active) {
            str += " bar_list_active";
          }
          return (
            <View className={str} onClick={() => checkBar(item.id)}>
              {item.title}
            </View>
          );
        })}
      </View>
      {currentContext}
      <AtModal isOpened={current.show}>
        <AtModalContent>您是否收到改订单商品?</AtModalContent>
        <AtModalAction>
          <Button onClick={handleCancel}>未收到</Button>
          <Button onClick={handleConfirm}>已收货</Button>
        </AtModalAction>
      </AtModal>
    </View>
  );
}
