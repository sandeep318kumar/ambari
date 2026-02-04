import { useContext } from "react";
import { ServiceContext } from "../../../store/ServiceContext";
import ChartContainer from "../ChartContainer";
import { Doughnut } from "react-chartjs-2";

export default function HBaseMasterHeap() {
  const { allServiceModels } = useContext(ServiceContext);

  const modelValueMax = allServiceModels["hbase"]?.heapMemoryMax;
  const modelValueUsed = allServiceModels["hbase"]?.heapMemoryUsed;

  const getUsed = () => {
    return modelValueUsed / (1024 * 1024) || 0;
  };

  const getMax = () => {
    return modelValueMax / (1024 * 1024) || 0;
  };

  const usedValue = getUsed();
  const maxValue = getMax();
  const percentage = maxValue ? (usedValue / maxValue) * 100 : 0;

  const data = {
    datasets: [
      {
        data: [percentage, 100 - percentage],
        backgroundColor: ["#429929", "#D3D3D3"],
      },
    ],
    labels: ["Used", "Free"],
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

  const dataToDisplay = `${percentage.toFixed(1)}% used ${usedValue.toFixed(
    1
  )}MB of ${(maxValue / 1024).toFixed(1)}GB`;

  return (
    <ChartContainer
      text={`${Math.round(percentage)}%`}
      onHoverContent={dataToDisplay}
    >
      <div className="d-flex justify-content-center mh-100">
        <Doughnut data={data} options={options} />
      </div>
    </ChartContainer>
  );
}
