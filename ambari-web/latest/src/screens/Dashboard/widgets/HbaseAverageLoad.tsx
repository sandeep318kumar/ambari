import { useContext } from "react";
import { ServiceContext } from "../../../store/ServiceContext";
import ChartContainer from "../ChartContainer";
import { messages } from "../../messages";

export default function HBaseAverageLoad() {
  const { allServiceModels } = useContext(ServiceContext);

  const averageLoad = allServiceModels["hbase"]?.["averageLoad"];
  const dataToDisplay = `${averageLoad} ${messages["dashboard.services.hbase.averageLoadPerServer"]}`;

  return (
    <ChartContainer
      text={averageLoad}
      onHoverContent={dataToDisplay}
    ></ChartContainer>
  );
}
