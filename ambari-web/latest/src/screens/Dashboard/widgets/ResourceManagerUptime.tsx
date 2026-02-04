import { useContext } from "react";
import ChartContainer from "../ChartContainer";
import { ServiceContext } from "../../../store/ServiceContext";

export default function NameNodeUptime() {
  const { allServiceModels } = useContext(ServiceContext);

  const modelValue = allServiceModels["yarn"]?.resourceManagerUptime ?? 0;

  const getUptime = () => {
    if (!modelValue) return "Not Running";
    return modelValue;
  };

  const uptime = getUptime();
  const dataToDisplay = `${uptime}`;

  return (
    <ChartContainer
      text={uptime}
      onHoverContent={dataToDisplay}
    ></ChartContainer>
  );
}