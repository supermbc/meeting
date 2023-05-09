import { useEffect, useState } from "react";

/**
 *
 * 这个hooks接收一个接口
 * 这个接口用来获取数据
 */
export default function UseFetch({ API }) {
  const [filterParams, setFilterParams] = useState({
    page: 1,
    size: 3,
    order: "createTime",
    sort: "desc",
    keyWord: "",
  });

  const [tableData, setTableData] = useState([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false)

  /**
   * filterParams变化
   * 重新调用接口
   * 并且初始化的时候也要调用一次
   */
  useEffect(() => {
    getData();
  }, [filterParams]);

  const getData = async () => {
    setIsLoading(true)
    const data = await API(filterParams);
    data.list.forEach((item) => {
      item.key = item.id;
    });
    setTableData(data.list);
    setTotal(data.pagination.total);
    setIsLoading(false)
  };

  return {
    setFilterParams,
    tableData,
    total,
    filterParams,
    isLoading
  };
}
