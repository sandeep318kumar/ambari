import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faBriefcase } from "@fortawesome/free-solid-svg-icons";
import Modal from "../../components/Modal";
import { Col, Row, Stack } from "react-bootstrap";
import modalManager from "../../store/ModalManager";
import { formatStatus, timeAgo } from "../../Utils/Utility";
import { useNavigate } from "react-router-dom";

type ServiceAlertsProps = {
  serviceName: string;
  alerts: any;
  alertsCount: any;
};

const statusClassMap: { [key: string]: string } = {
  critical: "status-critical",
  warning: "status-warning",
  ok: "status-ok",
  unknown: "status-unknown",
  none: "status-none",
};

const getStatusClass = (status: string) =>
  statusClassMap[status.toLowerCase()] || "status-none";

export function AlertsModal({ alerts, serviceName, navigate, displayName }: any) {
  const modalBody = alerts.length?alerts.map((alert: any) => {
    const statuses = alert
      ? Object.keys(alert?.summary).map((status: any) => ({
          status,
          count: alert.summary[status].count,
          maintenance_count: alert.summary[status].maintenance_count,
        }))
      : [];
    if (!alert.summary) {
      return null;
    }
    return (
      <Row className="mt-3 border-bottom border-1 pb-3 align-items-center">
        <Col md={8}>
          <Stack>
            <h4
              className="custom-link mt-2"
              onClick={() => {
                navigate(`/main/alerts/${alert.id}`);
                modalManager.hide();
              }}
            >
              {alert.label}
            </h4>
            <div className="text-muted fs-12">
              {(() => {
                // Show latest_text from the highest priority status (including maintenance mode alerts)
                const order = ["CRITICAL", "WARNING", "OK", "UNKNOWN", "NONE"];
                let text = '';
                for (const state of order) {
                  const statusSummary = alert.summary[state];
                  if (statusSummary && (statusSummary.count > 0 || statusSummary.maintenance_count > 0)) {
                    text = statusSummary.latest_text || '';
                    break; // Take the first status with any alerts (including maintenance)
                  }
                }
                return text;
              })()}
            </div>
          </Stack>
        </Col>
        <Col md={4}>
          <div className="status-container">
            {statuses.length > 0 ? (
              statuses.map((statusItem: any, index: any) =>
                statusItem.count > 0 || statusItem.maintenance_count > 0 ? (
                  <div
                    key={statusItem.status}
                    className="status-row d-flex align-items-center"
                  >
                    {/* Show maintenance mode alerts with grayed-out styling and maintenance icon */}
                    {/* Start GenAI */}
                    {statusItem.maintenance_count > 0 ? (
                      <button
                        key={`${statusItem.status}-maintenance`}
                        className={`alert-item alert-maintenance alert-status-box ${getStatusClass(
                          statusItem.status
                        )} status-maintenance ${index > 0 ? "mt-1" : ""}`}
                      >
                        <FontAwesomeIcon
                          icon={faBriefcase}
                          className="fs-12 me-2 text-white"
                        />
                        {formatStatus(statusItem.status, statusItem.maintenance_count)}
                      </button>
                    ) : null}
                    {/* end GENAI */}
                    {/* Show regular alerts with normal styling */}
                    {statusItem.count > 0 ? (
                      <button
                        key={`${statusItem.status}-normal`}
                        className={`alert-item alert-status-box ${getStatusClass(
                          statusItem.status
                        )} ${index > 0 || statusItem.maintenance_count > 0 ? "mt-1" : ""}`}
                      >
                        {formatStatus(statusItem.status, statusItem.count)}
                      </button>
                    ) : null}
                    {alert.highestStatus === "NONE" ? null : (
                      <div className="fs-12 text-nowrap ms-2 mt-2">
                        for{" "}
                        {timeAgo(
                          alert.summary[statusItem.status].original_timestamp
                        )}
                      </div>
                    )}
                  </div>
                ) : null
              )
            ) : (
              <button className="alert-item alert-status-box status-none">
                None
              </button>
            )}
          </div>
        </Col>
      </Row>
    );
  }):<div className="text-center my-5">No Alerts for the service.</div>;
  return (
    <Modal
      className="alerts-modal"
      modalTitle={`Alerts for ${displayName || serviceName}`}
      modalBody={modalBody}
      successCallback={() => {
        modalManager.hide();
      }}
      isOpen={true}
      onClose={() => {
        modalManager.hide();
      }}
      options={{
        modalSize: "modal-xl",
        cancelableViaBtn: false,
        cancelableViaIcon: true,
      }}
    ></Modal>
  );
}

function ServiceAlerts({
  serviceName,
  alerts,
  alertsCount,
}: ServiceAlertsProps) {
  const navigate = useNavigate();
  return (
    <>
      <div className="notification-bell me-3">
        <FontAwesomeIcon
          className={`notification-bell-icon ${alertsCount > 0 ? "cursor-pointer" : "cursor-pointer"}`}
          icon={faBell}
          onClick={() => {
              modalManager.show(
                <AlertsModal
                  alerts={alerts}
                  serviceName={serviceName}
                  navigate={navigate}
                />)
          }}
        />
        {alertsCount > 0 ? (
          <div className="notification-count">{alertsCount}</div>
        ) : null}
      </div>
    </>
  );
}

export default ServiceAlerts;
