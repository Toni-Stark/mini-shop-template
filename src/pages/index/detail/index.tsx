import { Image, View } from "@tarojs/components";
import Taro, { useLoad, useRouter } from "@tarojs/taro";
import "./index.less";
import { useMemo, useState } from "react";
import { HeaderView } from "../../../components/headerView/index";

import { getProduceInfo } from "@/common/interface";

export default function Detail() {
  const router = useRouter();
  const [option, setOption] = useState({
    statusBarHeight: 0,
    barHeight: 0,
    refresh: false,
    id: "",
    title: "",
  });
  const [info, setInfo] = useState(undefined);

  useLoad(() => {
    const params = router.params;
    let _option = option;
    _option.title = params.title;
    _option.id = params.type;
    const rect = Taro.getMenuButtonBoundingClientRect();
    _option.barHeight = rect.height;
    _option.statusBarHeight = rect.top;
    setOption({ ..._option });

    getProduceInfo().then((res) => {
      setInfo(res.data);
    });
  });

  const currentContext = useMemo(() => {
    return (
      <View className="index_zone">
        <View className="index_zone_text">{info?.desc_detail}</View>
      </View>
    );
  }, [info]);
  return (
    <View className="index">
      <HeaderView
        text="成分介绍"
        barHeight={option.barHeight}
        height={option.statusBarHeight}
      />
      {currentContext}
    </View>
  );
}
