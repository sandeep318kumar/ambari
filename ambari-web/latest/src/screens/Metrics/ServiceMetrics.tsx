import { useContext, useEffect, useRef, useState } from "react";
import metricsApi from "../../api/metricsApi";
import { AppContext } from "../../store/context";
import WidgetContainer from "../Dashboard/WidgetContainer";
import { Card, Col, Dropdown, Row } from "react-bootstrap";
import BrowseWidgetsModal from "./BrowseWidgetsModal";
import { WidgetInfo } from "./type";
import { cloneDeep, get, isEmpty, set } from "lodash";
import ChartContainer from "../Dashboard/ChartContainer";
import GraphWidgetView from "./GraphWidgetView";
import GaugeWidgetView from "./GaugeWidgetView";
import SelectTimeRangeModal from "../../components/SelectTimeRangeModal";
import { formatDate, getTimeInNumber } from "../../Utils/Utility";
import { durationMap } from "../../components/constants";
import Spinner from "../../components/Spinner";
import modalManager from "../../store/ModalManager";
import ConfirmationModal from "../../components/ConfirmationModal";
import { messages } from "../messages";
import { useUserContext } from "../../store/UserContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTh } from "@fortawesome/free-solid-svg-icons";

type MetricsProps = {
  serviceName: string;
};

export default function Metrics({ serviceName }: MetricsProps) {
  const aggregatorFunc = ["._sum", "._avg", "._min", "._max", "._rate"];
  const {user}=useUserContext();
  console.log("User in metrics component",user);
  enum MetricType {
    TEMPORAL = "TEMPORAL",
    POINT_IN_TIME = "POINT_IN_TIME",
  }

  enum WidgetType {
    GRAPH = "GRAPH",
    NUMBER = "NUMBER",
    GAUGE = "GAUGE",
  }

  const timeRangeOptions = [
    "Last 1 hour",
    "Last 2 hours",
    "Last 4 hours",
    "Last 12 hours",
    "Last 24 hours",
    "Last 1 week",
    "Last 1 month",
    "Last 1 year",
  ];

  const timeStep = 15;

  const { clusterName } = useContext(AppContext);
  const [widgets, setWidgets] = useState<WidgetInfo[]>();
  const [metricsData, setMetricsData] = useState<any[]>([]);
  const [selectedTimeRangerOption, setSelectedTimeRangerOption] =
    useState<string>(timeRangeOptions[0]);
  const [showSelectTimeModal, setShowSelectTimeModal] =
    useState<boolean>(false);
  
  const [loading, setLoading] = useState<boolean>(true);
  const [showBrowseWidgetsModal, setShowBrowseWidgetsModal] = useState<boolean>(false);

  const activeWidgetData = useRef({});

  useEffect(() => {
    fetchActiveWidgets();
  }, [serviceName]);

  useEffect(() => {
    if (widgets) {
      loadMetrics(widgets);
    }
  }, [selectedTimeRangerOption]);

  const fetchActiveWidgets = async () => {
    try {
      setLoading(true);
      const response = await metricsApi.getWidgets(
        user?.user_name||"",
        `WidgetLayoutInfo/section_name=${serviceName.toUpperCase()}_SUMMARY`
      );
      activeWidgetData.current = response;
      const widgetsData = extractWidgets(response);
      setWidgets(widgetsData);
      loadMetrics(widgetsData);
    } catch (error) {
      console.error("Error fetching widgets:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRequestData = (widgets: WidgetInfo[]) => {
    const metricsData: { [key: string]: any[] } = {};

    for (const widget of widgets || []) {
      for (const metric of JSON.parse(widget.metrics)) {
        const serviceName = get(metric, "service_name", "");
        const componentName = get(metric, "component_name", "");
        const hostComponentCriteria = get(
          metric,
          "host_component_criteria",
          ""
        );

        const key = hostComponentCriteria
          ? `${serviceName}_${componentName}_${hostComponentCriteria}`
          : `${serviceName}_${componentName}`;

        metric["metric_type"] =
          widget.widget_type === "GRAPH"
            ? MetricType.TEMPORAL
            : MetricType.POINT_IN_TIME;

        if (!metricsData[key]) {
          metricsData[key] = [];
        }
        metricsData[key].push(metric);
      }
    }

    return metricsData;
  };

  const loadMetrics = (widgetsData: WidgetInfo[]) => {
    const metricsData: { [key: string]: any[] } = getRequestData(widgetsData);

    for (const key in metricsData) {
      const metrics = metricsData[key];
      const componentName = get(metrics, "0.component_name", "");
      const hostComponentCriteria = get(
        metrics,
        "0.host_component_criteria",
        ""
      );
      const serviceName = get(metrics, "0.service_name", "");

      if (hostComponentCriteria.length > 0) {
        getHostComponentMetrics(metrics, componentName, hostComponentCriteria);
      } else {
        getServiceComponentMetrics(metrics, componentName, serviceName);
      }
    }
  };

  const getServiceComponentMetrics = async (
    requestMetrics: any,
    componentName: string,
    serviceName: string
  ) => {
    let temporalFields = [];
    let pointInTimeFields = [];

    for (let requestMetric of requestMetrics) {
      const metricType = get(requestMetric, "metric_type");
      if (metricType === MetricType.TEMPORAL) {
        temporalFields.push(
          get(requestMetric, "metric_path") +
            addTimeRange(selectedTimeRangerOption)
        );
      } else {
        pointInTimeFields.push(get(requestMetric, "metric_path"));
      }
    }

    const temporalMetricsPath = temporalFields.join(",");
    const pointInTimeMetricsPath = pointInTimeFields.join(",");

    try {
      if (temporalMetricsPath) {
        const temporalData = await metricsApi.getServiceComponentMetrics(
          clusterName,
          componentName,
          serviceName,
          temporalMetricsPath
        );
        addDataValues(
          temporalData,
          requestMetrics.filter(
            (metric: any) => metric.metric_type === MetricType.TEMPORAL
          )
        );
      }

      if (pointInTimeMetricsPath) {
        const pointInTimeData = await metricsApi.getServiceComponentMetrics(
          clusterName,
          componentName,
          serviceName,
          pointInTimeMetricsPath
        );
        addDataValues(
          pointInTimeData,
          requestMetrics.filter(
            (metric: any) => metric.metric_type === MetricType.POINT_IN_TIME
          )
        );
      }
    } catch (error) {
      console.log("error loading metrics", error);
    }
  };

  const getHostComponentMetrics = async (
    requestMetrics: any,
    componentName: string,
    hostComponentCriteria: string
  ) => {
    let temporalFields = [];
    let pointInTimeFields = [];

    for (let requestMetric of requestMetrics) {
      const metricType = get(requestMetric, "metric_type");
      if (metricType === MetricType.TEMPORAL) {
        temporalFields.push(
          get(requestMetric, "metric_path") +
            addTimeRange(selectedTimeRangerOption)
        );
      } else {
        pointInTimeFields.push(get(requestMetric, "metric_path"));
      }
    }

    const temporalMetricsPath = temporalFields.join(",");
    const pointInTimeMetricsPath = pointInTimeFields.join(",");

    try {
      if (temporalMetricsPath) {
        const temporalData = await metricsApi.getHostComponentMetrics(
          clusterName,
          componentName,
          hostComponentCriteria.replace("host_components/", ""),
          temporalMetricsPath
        );

        addDataValues(
          temporalData.items[0],
          requestMetrics.filter(
            (metric: any) => metric.metric_type === MetricType.TEMPORAL
          )
        );
      }

      if (pointInTimeMetricsPath) {
        const pointInTimeData = await metricsApi.getHostComponentMetrics(
          clusterName,
          componentName,
          hostComponentCriteria.replace("host_components/", ""),
          pointInTimeMetricsPath
        );

        addDataValues(
          pointInTimeData.items[0],
          requestMetrics.filter(
            (metric: any) => metric.metric_type === MetricType.POINT_IN_TIME
          )
        );
      }
    } catch (error) {
      console.log("error loading metrics", error);
    }
  };

  const addDataValues = (data: any, metricsToAdd: any) => {
    const metricsToAddCopy = cloneDeep(metricsToAdd);

    for (const metric of metricsToAddCopy) {
      const metricPath = get(metric, "metric_path");
      if (!metricPath) continue;

      let hasAggregateFunction = false;

      for (const func of aggregatorFunc) {
        if (metricPath.includes(func)) {
          hasAggregateFunction = true;
          break;
        }
      }

      let dataValue = null;

      if (!hasAggregateFunction) {
        const dataPath = `${metricPath.split("/").join(".")}`;
        dataValue = get(data, dataPath, null);
      } else {
        const metricPathParts = metricPath.split("/");
        const metricBeanProperty = metricPathParts.pop();
        const basePath = metricPathParts.join(".");
        const dataPathValue = get(data, `${basePath}`, {});

        dataValue = get(dataPathValue, metricBeanProperty, null);
      }

      if (dataValue !== null) {
        metric.data = dataValue;
      }
    }

    setMetricsData((prevMetricsData) => [
      ...prevMetricsData,
      ...metricsToAddCopy,
    ]);
  };

  const handleClone = (widget: WidgetInfo) => {
    modalManager.show(
      <ConfirmationModal
        isOpen={true}
        onClose={() => modalManager.hide()}
        modalTitle={get(messages, "popup.confirmation.commonHeader", "")}
        modalBody={get(messages, "widget.clone.body").replace(
          "{0}",
          get(widget, "widget_name")
        )}
        successCallback={() => {
          onCloneWidget(widget);
          modalManager.hide();
        }}
        okButtonText={get(messages, "common.clone").toUpperCase()}
      />
    );
  };

  const onCloneWidget = async (widget: WidgetInfo) => {
    const clonedWidgetData = {
      WidgetInfo: {
        widget_name: widget.widget_name + "(Copy)",
        widget_type: widget.widget_type,
        scope: "USER",
        metrics: JSON.parse(widget.metrics),
        values: JSON.parse(widget.values),
        properties: JSON.parse(widget.properties),
      },
    };
    try {
      const createWidgetResponse = await metricsApi.createWidget(
        clusterName,
        clonedWidgetData
      );
      const widgetId = get(
        createWidgetResponse,
        "resources.[0].WidgetInfo.id",
        ""
      );
      if (widgetId) {
        const widgetLayoutInfo = get(
          activeWidgetData.current,
          "items.[0].WidgetLayoutInfo",
          ""
        );
        if (!isEmpty(widgetLayoutInfo)) {
          let newWidgetsList = get(widgetLayoutInfo, "widgets", []).map(
            (w: any) => {
              return {
                id: get(w, "WidgetInfo.id", ""),
              };
            }
          );
          newWidgetsList.push({
            id: widgetId,
          });
          const updatedWidgetLayoutData = {
            WidgetLayoutInfo: {
              display_name: get(widgetLayoutInfo, "display_name", ""),
              id: get(widgetLayoutInfo, "id", ""),
              layout_name: get(widgetLayoutInfo, "layout_name", ""),
              scope: "USER",
              section_name: get(widgetLayoutInfo, "section_name", ""),
              widgets: newWidgetsList,
            },
          };
          await metricsApi.updateWidgetLayout(
            clusterName,
            updatedWidgetLayoutData,
            get(widgetLayoutInfo, "id", "")
          );
          fetchActiveWidgets();
        }
      }
    } catch (error) {
      console.error("Error cloning widget:", error);
    }
  };

  const onDeleteWidget = async (widget: WidgetInfo) => {
    const widgetLayoutInfo = get(
      activeWidgetData.current,
      "items.[0].WidgetLayoutInfo",
      ""
    );
    if (isEmpty(widgetLayoutInfo)) return;
    const widgetId = get(widget, "id", "");
    let newWidgetsList = get(widgetLayoutInfo, "widgets", [])
      .map((w: any) => {
        return {
          id: get(w, "WidgetInfo.id", ""),
        };
      })
      .filter((w: any) => w.id !== widgetId);
    const updatedWidgetLayoutData = {
      WidgetLayoutInfo: {
        display_name: get(widgetLayoutInfo, "display_name", ""),
        id: get(widgetLayoutInfo, "id", ""),
        layout_name: get(widgetLayoutInfo, "layout_name", ""),
        scope: "USER",
        section_name: get(widgetLayoutInfo, "section_name", ""),
        widgets: newWidgetsList,
      },
    };
    try {
      await metricsApi.updateWidgetLayout(
        clusterName,
        updatedWidgetLayoutData,
        get(widgetLayoutInfo, "id", "")
      );
      setWidgets((prevWidgets) =>
        prevWidgets?.filter((w) => w.id !== widgetId)
      );
      let widgets = get(
        activeWidgetData.current,
        "items.[0].WidgetLayoutInfo.widgets",
        []
      );
      widgets = widgets.filter((w: any) => w.WidgetInfo.id !== widgetId);
      set(
        activeWidgetData.current,
        "items.[0].WidgetLayoutInfo.widgets",
        widgets
      );
    } catch (error) {
      console.error("Error deleting widget:", error);
    }
  };

  const onEditWidget = (widget: WidgetInfo) => {
    console.log("Edit widget", widget);
    // Implement the edit functionality here
  };

  const renderWidgets = (widget: WidgetInfo) => {
    switch (widget.widget_type) {
      case WidgetType.GRAPH:
        return (
          <WidgetContainer
            onClone={() => handleClone(widget)}
            onDelete={() => onDeleteWidget(widget)}
            onEdit={() => onEditWidget(widget)}
            widgetHeader={widget.widget_name}
          >
            <GraphWidgetView widgetInfo={widget} metricsValues={metricsData} />
          </WidgetContainer>
        );
      case WidgetType.NUMBER:
        return (
          <WidgetContainer
            onClone={() => handleClone(widget)}
            onDelete={() => onDeleteWidget(widget)}
            onEdit={() => onEditWidget(widget)}
            widgetHeader={widget.widget_name}
          >
            {RenderNumberWidget(widget)}
          </WidgetContainer>
        );
      case WidgetType.GAUGE:
        return (
          <WidgetContainer
            onClone={() => handleClone(widget)}
            onDelete={() => onDeleteWidget(widget)}
            onEdit={() => onEditWidget(widget)}
            widgetHeader={widget.widget_name}
          >
            <GaugeWidgetView widgetInfo={widget} metricsValues={metricsData} />
          </WidgetContainer>
        );
    }
  };

  const RenderNumberWidget = (widget: WidgetInfo) => {
    const metricData = JSON.parse(widget.metrics);
    const metricName = metricData[0].name;
    const metricValue = metricsData.find(
      (item: any) => item.name === metricName
    );
    const metricDataValue = metricValue ? metricValue.data : [];

    return <ChartContainer text={metricDataValue}></ChartContainer>;
  };

  const extractWidgets = (data: any) => {
    if (!data || !data.items) {
      return [];
    }
    return data.items.flatMap((item: any) =>
      item.WidgetLayoutInfo.widgets.map((widget: any) => widget.WidgetInfo)
    );
  };

  const addTimeRange = (timeRange: string): string => {
    const startTime = getTimeInNumber(formatDate(new Date()));
    const duration = durationMap[timeRange.replace("Last ", "")];

    if (duration === undefined) {
      throw new Error(`Invalid time range: ${timeRange}`);
    }

    const endTime = startTime - duration;

    return `[${endTime},${startTime},${timeStep}]`;
  };

  if (loading) {
    return <Spinner />;
  }

  if (isEmpty(widgets) || isEmpty(metricsData)) {
    return (
      <Card className="mx-3 my-4 p-5">
        <Card.Body className="d-flex align-items-center justify-content-center">
          <h4 className="text-muted mb-0">No Widgets to show</h4>
        </Card.Body>
      </Card>
    );
  }
  return (
    <>
      {showSelectTimeModal ? (
        <SelectTimeRangeModal
          isOpen={showSelectTimeModal}
          onClose={() => setShowSelectTimeModal(false)}
          successCallback={(data) => {
            setSelectedTimeRangerOption(
              "CUSTOM: " +
                formatDate(new Date(data.startTime * 1000))
                  .split("T")
                  .join(" ")
            );
            setShowSelectTimeModal(false);
          }}
        />
      ) : null}
      
      <BrowseWidgetsModal
        isOpen={showBrowseWidgetsModal}
        onClose={() => setShowBrowseWidgetsModal(false)}
        serviceName={serviceName}
        onWidgetAdded={() => {
          setShowBrowseWidgetsModal(false);
          fetchActiveWidgets();
        }}
      />
      <Card className="p-5 mt-2">
        <div className="d-flex justify-content-between mb-4">
          <div></div> {/* Empty div for flex spacing */}
          <div className="d-flex">
            <Dropdown className="me-2">
              <Dropdown.Toggle 
                variant="success" 
                className="text-uppercase"
              >
                ACTIONS
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => console.log("Create Widget")}>
                  <FontAwesomeIcon icon={faPlus} className="me-2" /> Create Widget
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setShowBrowseWidgetsModal(true)}>
                  <FontAwesomeIcon icon={faTh} className="me-2" /> Browse Widgets
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            
            <Dropdown>
              <Dropdown.Toggle variant="transparent" className="btn-default">
                <span className="me-2">{selectedTimeRangerOption}</span>
              </Dropdown.Toggle>
              <Dropdown.Menu className="rounded-0">
                {timeRangeOptions.map((option) => (
                  <Dropdown.Item
                    key={option}
                    onClick={() => {
                      setSelectedTimeRangerOption(option);
                    }}
                  >
                    {option}
                  </Dropdown.Item>
                ))}
                <Dropdown.Item onClick={() => setShowSelectTimeModal(true)}>
                  Custom
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
        <Row>
          {metricsData.length > 0 &&
            widgets?.map((widget: WidgetInfo) => (
              <Col md={3} key={widget.id} className="mb-3">
                {renderWidgets(widget)}
              </Col>
            ))}
        </Row>
      </Card>
    </>
  );
}
