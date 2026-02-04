import { useContext } from "react";
import { ServiceContext } from "../../../store/ServiceContext";
import ChartContainer from "../ChartContainer";

export default function HBaseMasterUptime() {
  const { allServiceModels } = useContext(ServiceContext);

  const masterStartTime = allServiceModels["hbase"]?.["masterStartTime"];
  const dataToDisplay = `${masterStartTime}`;

  return (
    <ChartContainer
      text={masterStartTime}
      onHoverContent={dataToDisplay}
    ></ChartContainer>
  );
}
