import { useContext } from "react";
import { ServiceContext } from "../../../store/ServiceContext";
import ChartContainer from "../ChartContainer";
import { Doughnut } from "react-chartjs-2";
import { ArcElement, Tooltip, Chart as ChartJs } from "chart.js";

ChartJs.register(ArcElement, Tooltip);

export default function NameNodeCapacity() {
  const { allServiceModels } = useContext(ServiceContext);

  const modelValueMax = allServiceModels["hdfs"]?.["capacityTotal"];
  const modelValueUsed = allServiceModels["hdfs"]?.["capacityRemaining"];
  const modelValueCapacityUsed = allServiceModels["hdfs"]?.["capacityUsed"];
  const modelValueNonDfsUsed = allServiceModels["hdfs"]?.["capacityNonDfsUsed"];

  const total = modelValueMax || 0;
  const remaining = modelValueUsed || 0;
  const dfsUsed = modelValueCapacityUsed || 0;
  const nonDfsUsed = modelValueNonDfsUsed || 0;

  const dfsPercent = total > 0 ? (dfsUsed * 100) / total : 0;
  const nonDfsPercent = total > 0 ? (nonDfsUsed * 100) / total : 0;
  const remainingPercent = total > 0 ? (remaining * 100) / total : 0;

  const data = {
    datasets: [
      {
        data: [dfsPercent + nonDfsPercent, remainingPercent],
        backgroundColor: ["#429929", "#D3D3D3"],
      },
    ],
    labels: ["Used", "Remaining"],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    cutout: "75%",
  };

  const dataToDisplay = `DFS Used: ${dfsPercent.toFixed(
    1
  )}%, Non-DFS Used: ${nonDfsPercent.toFixed(
    1
  )}%, Remaining: ${remainingPercent.toFixed(1)}%`;

  return (
    <ChartContainer
      text={`${Math.round(dfsPercent + nonDfsPercent)}%`}
      onHoverContent={dataToDisplay}
    >
      <div className="d-flex justify-content-center mh-100">
        <Doughnut data={data} options={options} />
      </div>
    </ChartContainer>
  );
}
