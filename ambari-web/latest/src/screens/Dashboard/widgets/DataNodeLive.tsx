import { useContext } from "react";
import { ServiceContext } from "../../../store/ServiceContext";
import ChartContainer from "../ChartContainer";
import { messages } from "../../messages";

export default function DataNodeLive() {
  const { allServiceModels } = useContext(ServiceContext);

  const liveDataNodes = allServiceModels["hdfs"]?.["liveNodesDataNodes"] || 0;
  const deadDataNodes = allServiceModels["hdfs"]?.["deadNodesDataNodes"] || 0;
  const decomDataNodes =
    allServiceModels["hdfs"]?.["decommissionedNodesDataNodes"] || 0;
  const totalDataNodes = allServiceModels["hdfs"]?.["slaveComponents"].find((slaveComponent:any)=>slaveComponent.componentName === "DATANODE")?.totalCount || 0;

  const someMetricsNA =
    liveDataNodes === null ||
    totalDataNodes === null ||
    allServiceModels["hdfs"]?.["metricsNotAvailable"];

  const content = someMetricsNA
    ? messages["services.service.summary.notAvailable"]
    : `${liveDataNodes}/${totalDataNodes}`;

  const hiddenInfo = [
    `${liveDataNodes} ${messages["dashboard.services.hdfs.nodes.live"]}`,
    `${deadDataNodes} ${messages["dashboard.services.hdfs.nodes.dead"]}`,
    `${decomDataNodes} ${messages["dashboard.services.hdfs.nodes.decom"]}`,
  ];

  return (
    <ChartContainer
      text={content}
      onHoverContent={hiddenInfo.join(", ")}
    ></ChartContainer>
  );
}
