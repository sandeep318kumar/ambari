import { useContext } from "react";
import { ServiceContext } from "../../../store/ServiceContext";
import ChartContainer from "../ChartContainer";

export default function HBaseRegionsInTransition() {
  const { allServiceModels } = useContext(ServiceContext);

  const regionsInTransition =
    allServiceModels["hbase"]?.["regionsInTransition"];
  const dataToDisplay = `${regionsInTransition} regions in Transition`;

  return (
    <ChartContainer
      text={regionsInTransition}
      onHoverContent={dataToDisplay}
    ></ChartContainer>
  );
}
