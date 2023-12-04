import { PropsWithChildren, useEffect } from "react";
import Taro, { useLaunch } from "@tarojs/taro";
import "./app.less";
import "taro-ui/dist/style/index.scss";
import "taro-ui/dist/style/components/tab-bar.scss";
import "taro-ui/dist/style/components/badge.scss";
import "taro-ui/dist/style/components/input-number.scss";
import "taro-ui/dist/style/components/icon.scss";
import "taro-ui/dist/style/components/button.scss";
import "taro-ui/dist/style/components/loading.scss";
import "taro-ui/dist/style/components/action-sheet.scss";
import "taro-ui/dist/style/components/input.scss";
import "taro-ui/dist/style/components/textarea.scss";
import "taro-ui/dist/style/components/modal.scss";

function App({ children }: PropsWithChildren<any>) {
  useLaunch(() => {});
  return children;
}

export default App;
