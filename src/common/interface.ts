// 获取首页店铺数据
import { cloudPost } from "@/store/request";

export const getMemberLogin = async (params) => {
  return await cloudPost("member/login", params);
};
export const getMemberSet = async (params) => {
  return await cloudPost("member/set", params);
};
export const getIndexBanner = async (params) => {
  return await cloudPost("index/banner", params);
};
export const getProduceInfo = async (params) => {
  return await cloudPost("product/info", params);
};
export const getAddrList = async (params) => {
  return await cloudPost("addr/list", params);
};
export const getAddrInfo = async (params) => {
  return await cloudPost("addr/info", params);
};
export const getAddrSet = async (params) => {
  return await cloudPost("addr/set", params);
};
export const getPayAddOrder = async (params) => {
  return await cloudPost("pay/add-order", params);
};
export const getOrderIndex = async (params) => {
  return await cloudPost("order/index", params);
};
export const getOrderPay = async (params) => {
  return await cloudPost("order/pay", params);
};
export const getOrderInfo = async (params) => {
  return await cloudPost("order/info", params);
};
export const getOrderConfirm = async (params) => {
  return await cloudPost("order/confirm", params);
};
export const getOrderStatus = async (params) => {
  return await cloudPost("order/status", params);
};
export const getOrderAddr = async (params) => {
  return await cloudPost("order/addr", params);
};
