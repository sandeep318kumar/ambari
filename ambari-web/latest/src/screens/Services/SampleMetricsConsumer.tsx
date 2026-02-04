// import {findCapacityPercentage} from "../../Utils/serviceMetricsCalcUtils.ts";
import {useContext} from "react";
import {ServiceContext} from "../../store/ServiceContext.tsx";

export const SampleMetricsConsumer = () => {
  const serviceContext = useContext(ServiceContext);
  const serviceModels = serviceContext?.serviceModels;
  console.log("Service Models in SampleMetricsConsumer", serviceModels);
  // const percentageCapacity = findCapacityPercentage(1, 2);
}