import { useContext, useEffect, useState } from "react";
import { ServiceContext } from "../../../store/ServiceContext";
import ChartContainer from "../ChartContainer";
import { Doughnut } from "react-chartjs-2";
import { ArcElement, Tooltip, Chart as ChartJs } from "chart.js";
import { isEmpty } from "lodash";

ChartJs.register(ArcElement, Tooltip);

export default function NameNodeHeap() {
  const { allServiceModels } = useContext(ServiceContext);

  const [chartData, setChartData] = useState({
    maxValue: 0,
    usedValue: 0,
    percentage: 0,
    data: {
      datasets: [
        {
          data: [0, 100],
          backgroundColor: ["#429929", "#D3D3D3"],
        },
      ],
      labels: ["Used", "Free"],
    },
  });

  useEffect(() => {
    setChartData(getData());
  }, [JSON.stringify(allServiceModels)]);

  const modelValueMax = allServiceModels["hdfs"]?.["jvmMemoryHeapMaxValues"];
  const modelValueUsed = allServiceModels["hdfs"]?.["jvmMemoryHeapUsedValues"];

  const getUsed = () => {
    return modelValueUsed / (1024 * 1024) || 0;
  };

  const getMax = () => {
    return modelValueMax / (1024 * 1024) || 0;
  };

  const getData = () => {
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

    return { data, percentage, usedValue, maxValue };
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

  const dataToDisplay = `${chartData.percentage.toFixed(
    1
  )}% used \n ${chartData.usedValue.toFixed(1)}MB of ${(
    chartData.maxValue / 1024
  ).toFixed(1)}GB`;

  return (
    <ChartContainer
      text={`${Math.round(chartData.percentage)}%`}
      onHoverContent={dataToDisplay}
    >
      <div className="d-flex justify-content-center mh-100">
        {!isEmpty(chartData.data) && (
          <Doughnut data={chartData.data} options={options} />
        )}
      </div>
    </ChartContainer>
  );
}
