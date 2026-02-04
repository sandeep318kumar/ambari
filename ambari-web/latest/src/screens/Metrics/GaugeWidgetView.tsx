import { Doughnut } from "react-chartjs-2";
import ChartContainer from "../Dashboard/ChartContainer";
import { WidgetInfo } from "./type";
import { isEmpty } from "lodash";

type GaugeWidgetViewProps = {
  widgetInfo: WidgetInfo;
  metricsValues: any;
};

export default function GaugeWidgetView({
  widgetInfo,
  metricsValues,
}: GaugeWidgetViewProps) {
  const values = JSON.parse(widgetInfo.values)[0];
  const expression = values.value.replace(/^\$\{|\}$/g, "");
  const variables = extractVariables(expression);

  let evaluatedExpression = expression;

  for (let i = 0; i < variables.length; i++) {
    const variable = variables[i];
    const metricData = metricsValues.find(
      (item: any) => item.name === variable
    );
    const metricValue = metricData ? metricData.data : 0;
    evaluatedExpression = evaluatedExpression.replace(
      new RegExp(`\\b${variable}\\b`, "g"),
      metricValue
    );
  }

  let result;
  try {
    result = eval(evaluatedExpression);
  } catch (error) {
    console.error("Error evaluating expression:", error);
    result = "Error";
  }

  function extractVariables(expression: string) {
    const VARIABLE_REGEX = /[a-zA-Z_][\w\.]*/g;
    const matches = expression.match(VARIABLE_REGEX);
    return [...new Set(matches)];
  }

  const percentage = result * 100;

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
  };

  return (
    <>
      <ChartContainer text={`${Math.round(percentage)}%`}>
        <div className="d-flex justify-content-center mh-100">
          {!isEmpty(data) && <Doughnut data={data} options={options} />}
        </div>
      </ChartContainer>
    </>
  );
}
