import { Input, Picker, Textarea, View } from "@tarojs/components";
import Taro, { useLoad, useRouter } from "@tarojs/taro";
import "./index.less";
import { useMemo, useState } from "react";
import { HeaderView } from "../../../../components/headerView/index";

import { AtTextarea } from "taro-ui";
import {
  getAddrInfo,
  getAddrSet,
  getOrderAddr,
  getOrderInfo,
} from "@/common/interface";
import { TShow } from "@/common/common";
import { getIsNull } from "@/common/tools";

export default function Address() {
  const router = useRouter();
  const [option, setOption] = useState({
    statusBarHeight: 0,
    barHeight: 0,
    refresh: false,
    type: "",
  });
  const [region, setRegion] = useState(undefined);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    place: "",
    id: "",
  });
  useLoad(() => {
    const params = router.params;
    let _option = option;
    let _form = form;
    _form.id = params?.id;
    _option.type = params?.type;
    const rect = Taro.getMenuButtonBoundingClientRect();
    _option.barHeight = rect.height;
    _option.statusBarHeight = rect.top;
    setOption({ ..._option });
    setForm({ ..._form });
    if (params?.id && params.type == "11") {
      getOrderEdit(params.id);
      return;
    }
    if (params?.id) {
      getAddInfo(params.id);
      return;
    }
  });

  const getOrderEdit = (id) => {
    getOrderInfo({ order_id: id }).then((res) => {
      if (res.code != 200) return;
      let info = res.data;
      let list = [info.province, info.city, info.region];
      setForm({
        name: info.receiver_name,
        phone: info.receiver_mobile,
        place: info.address,
        id: id,
      });
      setRegion(list);
    });
  };
  const getAddInfo = (id) => {
    getAddrInfo({ id }).then((res) => {
      if (res.code != 200) return;
      let info = res.data;
      let list = [info.province, info.city, info.region];
      setForm({
        name: info.receiver_name,
        phone: info.mobile,
        place: info.addr,
        id: info.id,
      });
      setRegion(list);
    });
  };

  const handleChange = (e) => {
    let formData = form;
    formData["place"] = e;
    setForm({ ...formData });
  };
  const onChangeInput = (key, val) => {
    let formData = form;
    formData[key] = val;
    setForm({ ...formData });
  };
  const onDateChange = (e) => {
    setRegion(e.detail.value);
  };
  const confirmAddress = () => {
    if (getIsNull(form.name)) {
      TShow("请填写联系人");
      return;
    }
    if (getIsNull(form.phone)) {
      TShow("请填写手机号码");
      return;
    }
    if (!region || region?.length <= 0) {
      TShow("请选择地址");
      return;
    }
    if (getIsNull(form.place)) {
      TShow("请填写详细地址");
      return;
    }
    let params: any = {
      mobile: form.phone,
      receiver_name: form.name,
      province: region[0],
      city: region[1],
      region: region[2],
      addr: form.place,
    };
    if (option.type == "11") {
      params.order_id = form?.id;
      getOrderAddr(params).then((res) => {
        if (res.code != 200) {
          TShow(res.msg);
          return;
        }
        TShow("修改成功");
        setTimeout(() => {
          Taro.navigateBack();
        }, 1500);
      });
      return;
    }
    (params.id = form?.id),
      getAddrSet(params).then((res) => {
        if (res.code != 200) {
          TShow(res.msg);
          return;
        }
        setTimeout(() => {
          Taro.navigateBack();
        }, 1000);
      });
  };
  const currentContext = useMemo(() => {
    let address = region?.toString();
    address = address?.replaceAll(",", "-");
    return (
      <View className="index_zone">
        <View className="index_label">
          <View className="index_label_title">联系人</View>
          <Input
            className="index_label_input"
            value={form.name}
            onInput={(e) => onChangeInput("name", e.detail.value)}
            placeholder="名字"
          />
        </View>
        <View className="index_label">
          <View className="index_label_title">手机号码</View>
          <Input
            className="index_label_input"
            type="number"
            value={form.phone}
            onInput={(e) => onChangeInput("phone", e.detail.value)}
            placeholder="手机号码"
          />
        </View>
        <View className="index_label_area">
          <View className="index_label_area_title">选择地区</View>
          <View className="index_label_view">
            <Picker
              className="index_label_view_picker"
              mode="region"
              onChange={onDateChange}
            >
              {region ? (
                <View className="value">{address}</View>
              ) : (
                <View className="pla">地区信息</View>
              )}
            </Picker>
          </View>
        </View>
        <View className="index_label_area">
          <View className="index_label_area_title">详细地址</View>
          <View className="index_label_area_context">
            <AtTextarea
              className="textarea"
              count={false}
              value={form?.place}
              onChange={handleChange}
              maxLength={200}
              placeholder="街道门牌信息..."
            />
          </View>
        </View>
      </View>
    );
  }, [form, region]);
  return (
    <View className="index">
      <HeaderView
        text="填写地址"
        barHeight={option.barHeight}
        height={option.statusBarHeight}
      />
      {currentContext}
      <View className="index_footer" onClick={confirmAddress}>
        <View className="index_footer_confirm">完成</View>
      </View>
    </View>
  );
}
