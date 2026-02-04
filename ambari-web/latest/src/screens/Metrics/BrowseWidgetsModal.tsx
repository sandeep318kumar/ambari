import { useContext, useEffect, useState } from "react";
import { Button, Card, Col, Dropdown, Form, Modal, Nav, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faPlus, faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import metricsApi from "../../api/metricsApi";
import { AppContext } from "../../store/context";
import { WidgetInfo } from "./type";
import { get } from "lodash";
import modalManager from "../../store/ModalManager";
import ConfirmationModal from "../../components/ConfirmationModal";
import { messages } from "../messages";
import Spinner from "../../components/Spinner";

interface BrowseWidgetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceName: string;
  onWidgetAdded: () => void;
}

interface WidgetWithStatus extends WidgetInfo {
  added: boolean;
}

const BrowseWidgetsModal = ({
  isOpen,
  onClose,
  serviceName,
  onWidgetAdded,
}: BrowseWidgetsModalProps) => {
  const { clusterName } = useContext(AppContext);
  const [loginName, setLoginName] = useState<string>("admin"); // Default to admin if no login name is found
  const [activeService, setActiveService] = useState<string>(serviceName);
  const [isShowMineOnly, setIsShowMineOnly] = useState<boolean>(false);
  const [allSharedWidgets, setAllSharedWidgets] = useState<WidgetWithStatus[]>([]);
  const [mineWidgets, setMineWidgets] = useState<WidgetWithStatus[]>([]);
  const [isAllSharedWidgetsLoaded, setIsAllSharedWidgetsLoaded] = useState<boolean>(false);
  const [isMineWidgetsLoaded, setIsMineWidgetsLoaded] = useState<boolean>(false);
  const [activeWidgetLayout, setActiveWidgetLayout] = useState<any>(null);

  // List of services for filtering - limited to match the reference UI
  const services = [
    { id: "HDFS", name: "HDFS" },
    { id: "YARN", name: "YARN" },
    { id: "HBASE", name: "HBASE" },
  ];

  useEffect(() => {
    // Get login name from localStorage
    try {
      const ambariLocalData = localStorage.getItem("ambari");
      if (ambariLocalData) {
        let parsedData = {};
        try {
          parsedData = JSON.parse(ambariLocalData);
          if (typeof parsedData === "string") {
            parsedData = JSON.parse(parsedData);
          }
        } catch (err) {
          console.log("Error parsing ambari data", err);
          parsedData = {};
        }

        const ambari: any = parsedData;
        if (ambari?.app?.loginName) {
          setLoginName(decodeURIComponent(ambari.app.loginName));
        }
      }
    } catch (err) {
      console.error("Error getting login name", err);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      // Load layout first, then widgets
      (async () => {
        await loadActiveWidgetLayout();
      })();
    }
  }, [isOpen]);

  // Load widgets after activeWidgetLayout is set
  useEffect(() => {
    if (isOpen && activeWidgetLayout !== null) {
      (async () => {
        await loadAllSharedWidgets();
        await loadMineWidgets();
      })();
    }
  }, [isOpen, activeWidgetLayout]);

  const loadActiveWidgetLayout = async () => {
    try {
      const response = await metricsApi.getWidgets(
        loginName,
        `WidgetLayoutInfo/section_name=${serviceName.toUpperCase()}_SUMMARY`
      );
      console.log("[BrowseWidgetsModal] loadActiveWidgetLayout response:", response);
      if (response?.items?.length > 0) {
        setActiveWidgetLayout(response.items[0].WidgetLayoutInfo);
      } else {
        setActiveWidgetLayout(null);
      }
    } catch (error) {
      console.error("Error loading active widget layout:", error);
      setActiveWidgetLayout(null);
    }
  };

  // Helper to get active widget IDs
  const getActiveWidgetIds = () => {
    if (!activeWidgetLayout?.widgets) return [];
    
    return activeWidgetLayout.widgets.map((w: any) => {
      // Handle different widget ID formats
      if (w.id) return w.id;
      if (w.WidgetInfo?.id) return w.WidgetInfo.id;
      return w;
    }).filter((id: any) => id !== undefined);
  };

  // Update loadAllSharedWidgets to set 'added' based on activeWidgetLayout
  const loadAllSharedWidgets = async () => {
    setIsAllSharedWidgetsLoaded(false);
    try {
      const response = await metricsApi.getAllSharedWidgets(clusterName);
      console.log("[BrowseWidgetsModal] loadAllSharedWidgets response:", response);
      const activeIds = getActiveWidgetIds();
      console.log("[BrowseWidgetsModal] Active widget IDs:", activeIds);
      console.log("[BrowseWidgetsModal] Active widget layout:", activeWidgetLayout);
      const widgets = response?.items
        ?.filter((item: any) => item.WidgetInfo.widget_type !== "HEATMAP") // Filter out HEATMAP widgets like UI1
        ?.map((item: any) => {
          const isAdded = activeIds.includes(item.WidgetInfo.id);
          console.log(`[BrowseWidgetsModal] Widget ${item.WidgetInfo.widget_name} (ID: ${item.WidgetInfo.id}) - Added: ${isAdded}`);
          return {
            ...item.WidgetInfo,
            added: isAdded,
          };
        }) || [];
      setAllSharedWidgets(widgets);
      setIsAllSharedWidgetsLoaded(true);
    } catch (error) {
      console.error("Error loading shared widgets:", error);
      setIsAllSharedWidgetsLoaded(true);
    }
  };

  // Update loadMineWidgets to set 'added' based on activeWidgetLayout
  const loadMineWidgets = async () => {
    setIsMineWidgetsLoaded(false);
    try {
      const response = await metricsApi.getMineWidgets(loginName, clusterName);
      console.log("[BrowseWidgetsModal] loadMineWidgets response:", response);
      const activeIds = getActiveWidgetIds();
      const widgets = response?.items
        ?.filter((item: any) => item.WidgetInfo.widget_type !== "HEATMAP") // Filter out HEATMAP widgets like UI1
        ?.map((item: any) => ({
          ...item.WidgetInfo,
          added: activeIds.includes(item.WidgetInfo.id),
        })) || [];
      setMineWidgets(widgets);
      setIsMineWidgetsLoaded(true);
    } catch (error) {
      console.error("Error loading mine widgets:", error);
      setIsMineWidgetsLoaded(true);
    }
  };

  const getFilteredWidgets = () => {
    let widgets: WidgetWithStatus[] = [];

    if (isShowMineOnly) {
      widgets = [...mineWidgets];
    } else {
      // Merge mine widgets and all shared widgets, no duplicates allowed
      const widgetMap: { [key: string]: boolean } = {};
      const allWidgets = [...allSharedWidgets, ...mineWidgets];
      
      widgets = allWidgets.filter((widget) => {
        if (!widgetMap[widget.id]) {
          widgetMap[widget.id] = true;
          return true;
        }
        return false;
      });
    }

    // Filter by service
    widgets = widgets.filter((widget) => {
      try {
        const metrics = JSON.parse(widget.metrics);
        const widgetServiceNames = metrics.map((m: any) => m.service_name);
        return widgetServiceNames.includes(activeService);
      } catch (error) {
        return false;
      }
    });

    return widgets;
  };

  const handleAddWidget = async (widget: WidgetWithStatus) => {
    if (!activeWidgetLayout) return;

    try {
      // Ensure all widgets are { id: ... }
      const currentWidgetIds = (activeWidgetLayout.widgets || []).map((w: any) =>
        w.id ? { id: w.id } : w.WidgetInfo && w.WidgetInfo.id ? { id: w.WidgetInfo.id } : w
      );
      // Avoid duplicates
      const alreadyAdded = currentWidgetIds.some((w: any) => w.id === widget.id);
      const newWidgetsList = alreadyAdded
        ? currentWidgetIds
        : [...currentWidgetIds, { id: widget.id }];

      const updatedWidgetLayoutData = {
        WidgetLayoutInfo: {
          ...activeWidgetLayout,
          widgets: newWidgetsList,
        },
      };

      await metricsApi.updateWidgetLayout(
        clusterName,
        updatedWidgetLayoutData,
        activeWidgetLayout.id
      );

      // Update local state
      if (isShowMineOnly) {
        setMineWidgets(
          mineWidgets.map((w) =>
            w.id === widget.id ? { ...w, added: true } : w
          )
        );
      } else {
        setAllSharedWidgets(
          allSharedWidgets.map((w) =>
            w.id === widget.id ? { ...w, added: true } : w
          )
        );
        setMineWidgets(
          mineWidgets.map((w) =>
            w.id === widget.id ? { ...w, added: true } : w
          )
        );
      }

      onWidgetAdded();
    } catch (error) {
      console.error("Error adding widget:", error);
    }
  };

  const handleHideWidget = async (widget: WidgetWithStatus) => {
    if (!activeWidgetLayout) return;

    try {
      // Ensure all widgets are { id: ... }
      const currentWidgetIds = (activeWidgetLayout.widgets || []).map((w: any) =>
        w.id ? { id: w.id } : w.WidgetInfo && w.WidgetInfo.id ? { id: w.WidgetInfo.id } : w
      );
      // Remove the widget
      const newWidgetsList = currentWidgetIds.filter((w: any) => w.id !== widget.id);

      const updatedWidgetLayoutData = {
        WidgetLayoutInfo: {
          ...activeWidgetLayout,
          widgets: newWidgetsList,
        },
      };

      await metricsApi.updateWidgetLayout(
        clusterName,
        updatedWidgetLayoutData,
        activeWidgetLayout.id
      );

      // Update local state
      if (isShowMineOnly) {
        setMineWidgets(
          mineWidgets.map((w) =>
            w.id === widget.id ? { ...w, added: false } : w
          )
        );
      } else {
        setAllSharedWidgets(
          allSharedWidgets.map((w) =>
            w.id === widget.id ? { ...w, added: false } : w
          )
        );
        setMineWidgets(
          mineWidgets.map((w) =>
            w.id === widget.id ? { ...w, added: false } : w
          )
        );
      }

      onWidgetAdded();
    } catch (error) {
      console.error("Error hiding widget:", error);
    }
  };

  const handleShareWidget = (widget: WidgetWithStatus) => {
    modalManager.show(
      <ConfirmationModal
        isOpen={true}
        onClose={() => modalManager.hide()}
        modalTitle={get(messages, "popup.confirmation.commonHeader", "")}
        modalBody={get(messages, "widget.share.body").replace(
          "{0}",
          widget.widget_name
        )}
        successCallback={() => {
          shareWidget(widget);
          modalManager.hide();
        }}
        okButtonText={get(messages, "common.share").toUpperCase()}
      />
    );
  };

  const shareWidget = async (widget: WidgetWithStatus) => {
    try {
      await metricsApi.shareWidget(clusterName, widget.id.toString());
      
      // Update local state
      const updatedWidget = { ...widget, scope: "CLUSTER" };
      setMineWidgets(mineWidgets.filter((w) => w.id !== widget.id));
      setAllSharedWidgets([...allSharedWidgets, updatedWidget]);
    } catch (error) {
      console.error("Error sharing widget:", error);
    }
  };

  const handleDeleteWidget = (widget: WidgetWithStatus) => {
    modalManager.show(
      <ConfirmationModal
        isOpen={true}
        onClose={() => modalManager.hide()}
        modalTitle={get(messages, "popup.confirmation.commonHeader", "")}
        modalBody={get(messages, "widget.delete.body").replace(
          "{0}",
          widget.widget_name
        )}
        successCallback={() => {
          deleteWidget(widget);
          modalManager.hide();
        }}
        okButtonText={get(messages, "common.delete").toUpperCase()}
      />
    );
  };

  const deleteWidget = async (widget: WidgetWithStatus) => {
    try {
      await metricsApi.deleteWidget(clusterName, widget.id.toString());
      
      // Update local state
      if (widget.scope === "CLUSTER") {
        setAllSharedWidgets(allSharedWidgets.filter((w) => w.id !== widget.id));
      } else {
        setMineWidgets(mineWidgets.filter((w) => w.id !== widget.id));
      }

      // If the widget was added to the dashboard, refresh the dashboard
      if (widget.added) {
        onWidgetAdded();
      }
    } catch (error) {
      console.error("Error deleting widget:", error);
    }
  };

  const handleMoreAction = (action: string, widget: WidgetWithStatus) => {
    switch (action) {
      case 'share':
        handleShareWidget(widget);
        break;
      case 'delete':
        handleDeleteWidget(widget);
        break;
      case 'hide':
        handleHideWidget(widget);
        break;
      default:
        break;
    }
  };

const getWidgetTypeImage = (widgetType: string) => {
  // Use the public URL or root path
  switch (widgetType) {
    case "GRAPH":
      return "/src/assets/img/widget-graph.png";
    case "GAUGE":
      return "/src/assets/img/widget-gauge.png";
    case "NUMBER":
      return "/src/assets/img/widget-number.png";
    case "TEMPLATE":
      return "/src/assets/img/widget-template.png";
    default:
      return "/src/assets/img/widget-template.png";
  }
};

  const isLoading = !isAllSharedWidgetsLoaded || !isMineWidgetsLoaded;
  const filteredWidgets = getFilteredWidgets();

  return (
    <Modal show={isOpen} onHide={onClose} size="xl" centered dialogClassName="widget-browser-modal">
      <Modal.Header closeButton>
        <Modal.Title style={{ fontSize: '32px' }}>Widget Browser</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-0">
        <div className="border-bottom" style={{ backgroundColor: 'white' }}>
          <div className="d-flex justify-content-between align-items-center px-3 py-2">
            <Nav className="ambari-tabs border-0">
              {services.map((service) => (
                <Nav.Item key={service.id}>
                  <Nav.Link 
                    active={activeService === service.id}
                    onClick={() => setActiveService(service.id)}
                    className={`nav-link-underlined px-3 ${activeService === service.id ? 'active' : ''}`}
                  >
                    {service.name}
                  </Nav.Link>
                </Nav.Item>
              ))}
            </Nav>
            <div className="d-flex align-items-center">
              <Button 
                variant="success"
                className="d-flex align-items-center btn-default"
                style={{ backgroundColor: 'white', borderColor: '#dee2e6', color: '#3fae2a' }}
              >
                <FontAwesomeIcon icon={faPlus} className="me-2" />
                CREATE WIDGET
              </Button>
            </div>
          </div>
        </div>

        <div className="p-3" style={{ backgroundColor: '#f8f9fa' }}>
          {isLoading ? (
            <div className="text-center py-5">
              <Spinner />
            </div>
          ) : filteredWidgets.length === 0 ? (
            <div className="text-center py-5">
              <p>No widgets found for {activeService}</p>
            </div>
          ) : (
            <Row className="g-3">
              {filteredWidgets.map((widget) => (
                <Col md={6} key={widget.id} className="mb-3">
                  <Card className="h-100" style={{ border: '1px solid #dee2e6', borderRadius: '4px' }}>
                    <Card.Body className="p-3">
                      <div className="d-flex">
                        <div className="me-3 flex-shrink-0">
                          <img 
                            src={getWidgetTypeImage(widget.widget_type)} 
                            alt={widget.widget_type} 
                            style={{ 
                              width: "80px", 
                              height: "60px", 
                              objectFit: "cover",
                              border: '1px solid #dee2e6',
                              borderRadius: '2px'
                            }} 
                          />
                        </div>
                        <div className="flex-grow-1 d-flex flex-column">
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <h6 className="mb-1" style={{ fontWeight: 500, fontSize: '14px', color: '#333' }}>
                              {widget.widget_name}
                            </h6>
                            <button 
                              className="btn btn-sm p-1" 
                              type="button"
                              style={{ border: 'none', background: 'none', color: '#666' }}
                            >
                              <FontAwesomeIcon icon={faEllipsisV} size="sm" />
                            </button>
                          </div>
                          <p className="text-muted small mb-3" style={{ fontSize: '12px', lineHeight: '1.4' }}>
                            {widget.description || "No description"}
                          </p>
                          <div className="mt-auto d-flex justify-content-between align-items-center">
                            <div></div>
                            <div className="d-flex align-items-center">
                              <Dropdown className="me-2">
                                <Dropdown.Toggle 
                                  variant="outline-secondary" 
                                  size="sm"
                                  className="btn-default px-3"
                                  style={{ 
                                    fontSize: '12px',
                                    fontWeight: 500,
                                    textTransform: 'uppercase',
                                    minWidth: '60px'
                                  }}
                                >
                                  MORE...
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                  {widget.scope === "USER" && (
                                    <Dropdown.Item onClick={() => handleMoreAction('share', widget)}>
                                      Share
                                    </Dropdown.Item>
                                  )}
                                  <Dropdown.Item onClick={() => handleMoreAction('delete', widget)}>
                                    Delete
                                  </Dropdown.Item>
                                  {widget.added && (
                                    <Dropdown.Item onClick={() => handleMoreAction('hide', widget)}>
                                      Hide
                                    </Dropdown.Item>
                                  )}
                                </Dropdown.Menu>
                              </Dropdown>
                              {widget.added ? (
                                <div className="text-success d-flex align-items-center">
                                  <FontAwesomeIcon icon={faCheck} className="me-1" size="sm" />
                                  <span style={{ fontWeight: 500, fontSize: '12px' }}>ADDED</span>
                                </div>
                              ) : (
                                <Button 
                                  variant="outline-secondary" 
                                  size="sm" 
                                  className="btn-default px-3"
                                  style={{ 
                                    fontSize: '12px',
                                    fontWeight: 500,
                                    textTransform: 'uppercase',
                                    minWidth: '60px'
                                  }}
                                  onClick={() => handleAddWidget(widget)}
                                >
                                  ADD
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-between" style={{ borderTop: '1px solid #dee2e6', backgroundColor: 'white' }}>
        <Form.Check
          type="checkbox"
          id="show-mine-only"
          label="Show only my widgets"
          checked={isShowMineOnly}
          onChange={(e) => setIsShowMineOnly(e.target.checked)}
          style={{ fontSize: '14px' }}
        />
        <Button 
          variant="secondary" 
          onClick={onClose}
          className="btn-default text-uppercase"
          style={{ fontSize: '14px' }}
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default BrowseWidgetsModal;
