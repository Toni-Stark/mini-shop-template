import {
  View,
  ScrollView,
  Swiper,
  SwiperItem,
  Image,
  CoverImage,
} from "@tarojs/components";
import Taro, { useLoad } from "@tarojs/taro";
import { AtFloatLayout, AtInputNumber } from "taro-ui";
import "./index.less";
import { useState } from "react";
import { HeaderView } from "../../components/headerView/index";
import { getIndexBanner, getProduceInfo } from "@/common/interface";
import larImg from "../../static/source/banner.png";

export default function Index() {
  const [option, setOption] = useState({
    statusBarHeight: 0,
    barHeight: 0,
    screenWidth: 0,
    screenHeight: 0,
    swiperHeight: 0,
    bannerHeight: 0,
    specVal: null,
  });
  const [scrollOpacity, setScrollOpacity] = useState(0);
  const [show, setShow] = useState(false);
  const [detailShow, setDetailShow] = useState(undefined);
  const [bannerList, setBannerList] = useState([]);
  const [info, setInfo] = useState(undefined);

  useLoad(() => {
    let _option = option;
    const rect = Taro.getMenuButtonBoundingClientRect();
    _option.barHeight = rect.height;
    _option.statusBarHeight = rect.top;
    Taro.getSystemInfo({
      success: (res) => {
        _option.screenWidth = res.screenWidth;
        _option.screenHeight = res.screenHeight;
        _option.swiperHeight = res.screenWidth / 1.95;
        _option.bannerHeight = res.screenWidth / 7.8;
      },
    });
    setOption({ ..._option });

    getIndexBanner().then((res) => {
      setBannerList(res.data);
    });
    getProduceInfo().then((res) => {
      setInfo(res.data);
      setOption({ ...option, specVal: res.data.sku[0].num });
    });
  });

  const onScroll = (e) => {
    if (scrollOpacity === 0 && e.detail.scrollTop >= option.screenHeight) {
      setScrollOpacity(1);
    }
    if (scrollOpacity > 0 && e.detail.scrollTop < option.screenHeight) {
      setScrollOpacity(0);
    }
  };

  const handleOpen = () => {
    setShow(true);
  };
  const handleUseOpen = () => {
    let params = {
      title: "使用说明",
      show: true,
      text: info.use_detail,
    };
    setDetailShow({ ...params });
  };
  const handleDetailOpen = () => {
    let params = {
      title: "成分介绍",
      show: true,
      text: info.desc_detail,
    };
    setDetailShow({ ...params });
  };
  const handleCoOpen = () => {
    Taro.navigateTo({
      url: "./detail/index",
    });
  };
  const handleClose = () => {
    setDetailShow({ ...detailShow, show: false });
    setTimeout(() => {
      setDetailShow({ show: false, title: "", text: "" });
    }, 500);
    setShow(false);
  };

  const chooseSpec = (id) => {
    setOption({
      ...option,
      specVal: id,
    });
  };
  const nextToNavi = () => {
    Taro.navigateTo({
      url: "./order/index?sku=" + option.specVal,
    });
  };
  const previewSource = () => {
    Taro.previewImage({
      current: info.cert_detail_img, // 当前显示图片的http链接
      urls: [info.cert_detail_img], // 需要预览的图片http链接列表
      // http://231110002.ldcvh.china-yun.net/wximg2/1.jpg
    });
  };
  return (
    <View className="index">
      <HeaderView
        text="润米商城"
        barHeight={option.barHeight}
        height={option.statusBarHeight}
      />
      <View className="index_zone">
        <ScrollView
          className="index_zone_view"
          scrollY
          scrollWithAnimation={true}
          enhanced
          onScroll={onScroll}
        >
          <View className="scroll_header">
            <Swiper
              className="scroll_header_swiper"
              indicatorColor="#999"
              indicatorActiveColor="#333"
              circular
              autoplay
              style={{ height: option.swiperHeight + "Px" }}
            >
              {bannerList.map((item) => (
                <SwiperItem className="swiper_view">
                  <View
                    style={{ height: option.swiperHeight }}
                    className="swiper_view_item"
                  >
                    <Image className="img" src={item.img} />
                  </View>
                </SwiperItem>
              ))}
            </Swiper>
            <Image
              style={{ height: option.bannerHeight + "Px" }}
              className="scroll_header_image"
              src={larImg}
            />
          </View>
          <View className="scroll_content">
            <View className="scroll_content_first">
              <Image
                mode="heightFix"
                className="scroll_content_first_img"
                src={info?.logo}
              />
              <View className="scroll_content_first_main">
                <View className="scroll_content_first_main_title">
                  {info?.name}
                </View>
                <View className="scroll_content_first_main_price">
                  <View className="price">￥{info?.unit_price}</View>
                  <View className="main_btn" onClick={handleOpen}>
                    立即购买
                  </View>
                </View>
              </View>
            </View>
            <View className="scroll_content_second">
              <View className="scroll_content_second_context">
                <View className="title_label">使用说明</View>
                <View className="desc">{info?.use_desc}</View>
              </View>
              <View className="main_btn" onClick={handleUseOpen}>
                查看详情
              </View>
            </View>
            <View className="scroll_content_second">
              <View className="scroll_content_second_context">
                <View className="title_label">成分介绍</View>
                <View className="desc">{info?.desc}</View>
              </View>
              <View className="main_btn" onClick={handleDetailOpen}>
                查看详情
              </View>
            </View>
            <View className="scroll_content_second" onClick={previewSource}>
              <View className="image_detail">
                <View className="title_label">证书</View>
                <View className="image_label">
                  <Image className="image_label_image" src={info?.cert_img} />
                </View>
              </View>
              <View className="main_btn">查看详情</View>
            </View>
            <View className="scroll_content_footer" />
          </View>
        </ScrollView>
      </View>
      <View className="float_layout">
        <AtFloatLayout isOpened={show} onClose={handleClose}>
          <View className="layout">
            <View className="shop">
              <View className="shop_info">
                <Image className="shop_info_image" src={info?.product_img} />
                <View className="shop_info_view">
                  <View className="price">￥{info?.unit_price}</View>
                  <View className="discount">价格：{info?.market_price}</View>
                </View>
              </View>
              <View className="shop_tab">
                <View className="shop_tab_title">规格</View>
                <View className="shop_tab_bar">
                  {info?.sku.map((item) => {
                    let classStr = "shop_tab_bar_item";
                    if (item.num === option.specVal) {
                      classStr += " shop_tab_bar_active";
                    }
                    return (
                      <View
                        className={classStr}
                        onClick={() => chooseSpec(item.num)}
                      >
                        {item.name}
                      </View>
                    );
                  })}
                </View>
              </View>
              <View className="shop_footer" />
            </View>
            <View
              className="next_btn"
              hoverClass="next_btn_active"
              onClick={nextToNavi}
            >
              下一步
            </View>
          </View>
        </AtFloatLayout>
      </View>
      <View className="float_detail">
        <AtFloatLayout isOpened={detailShow?.show} onClose={handleClose}>
          <View className="detail">
            <View className="detail_title">{detailShow?.title}</View>
            <View className="detail_time" />
            <View className="detail_desc">
              <View className="detail_desc_text">{detailShow?.text}</View>
            </View>
            <View className="detail_btn" onClick={handleClose}>
              关闭
            </View>
          </View>
        </AtFloatLayout>
      </View>
    </View>
  );
}
