import { Image, View } from "@tarojs/components";

import "./index.less";
import left from "@/static/icon/back.png";
import home from "@/static/icon/home.png";
import Taro from "@tarojs/taro";
import { useMemo } from "react";

type Props = {
  barHeight: number;
  height: number;
  text: string;
};

export const HeaderView = (props: Partial<Props>) => {
  const pages = Taro.getCurrentPages();
  const { barHeight, height, text } = props;

  const naviBack = () => {
    Taro.navigateBack();
  };
  const naviHome = () => {
    Taro.switchTab({
      url: "/pages/index/index",
    });
  };

  const currentImage = useMemo(() => {
    if (pages.length > 1) {
      return (
        <Image
          mode="widthFix"
          className="he_view_header_img"
          src={left}
          onClick={naviBack}
        />
      );
    }
    return (
      <Image
        mode="widthFix"
        className="he_view_header_img"
        src={home}
        onClick={naviHome}
      />
    );
  }, [pages, text]);

  return (
    <View className="he_view">
      <View
        className="he_view_header"
        style={{
          marginTop: barHeight + "Px",
          height: height + "Px",
        }}
      >
        {currentImage}
        <View className="he_view_header_text">{text}</View>
      </View>
    </View>
  );
};
