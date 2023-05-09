import { Empty } from "antd";
export default function NotFound() {
  return (
    <Empty
      image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
      imageStyle={{ height: 60 }}
      description={<span>没有这个页面</span>}
    ></Empty>
  );
}
