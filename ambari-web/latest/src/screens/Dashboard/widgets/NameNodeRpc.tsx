import { useContext } from "react";
import { ServiceContext } from "../../../store/ServiceContext";
import ChartContainer from "../ChartContainer";
import { isEmpty } from "lodash";

export default function NameNodeRpc() {
  const { allServiceModels } = useContext(ServiceContext);

  const modelValue = isEmpty(allServiceModels["hdfs"]?.["nameNodeRpcValues"]) ? 0 : allServiceModels["hdfs"]?.["nameNodeRpcValues"];

  const getData = () => {
    if (modelValue === 0) {
      return "0";
    }
    if (typeof modelValue === "number") {
      return modelValue.toFixed(2);
    }
    return null;
  };

  const data = getData();
  const content = data !== null ? `${data} ms` : "n/a";
  const hoverContent = data !== null ? `${data} ms average RPC \n queue wait time` : "n/a";

  return <ChartContainer text={content} onHoverContent={hoverContent}>
    <div className="p-3"></div>
  </ChartContainer>;
}
