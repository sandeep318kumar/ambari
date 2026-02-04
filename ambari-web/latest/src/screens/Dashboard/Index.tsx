import { Col, Row, Tab, Tabs } from "react-bootstrap";
import DashboardMetrics from "./Metrics";
import DashboardConfigHistory from "./ConfigHistory";
import DashboardHeatmaps from "./DashboardHeatmaps";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

function Dashboard() {
  const navigate = useNavigate();
  const { tabName } = useParams<{ tabName: string }>();
  const [activeTab, setActiveTab] = useState("metrics");
  
  // Set the active tab based on the tabName parameter from the URL
  useEffect(() => {
    if (tabName) {
      setActiveTab(tabName);
    } else {
      setActiveTab("metrics");
    }
  }, [tabName]);
  
  // Handle tab selection and update URL
  const handleTabSelect = (key: string | null) => {
    if (key) {
      setActiveTab(key);
      navigate(`/main/dashboard/${key}`);
    }
  };

  return (
    <div className="p-4">
      <Row>
        <Col md={12} style={{ position: "relative" }}>
          <Tabs 
            id="service-tabs" 
            className="ambari-tabs mb-3"
            activeKey={activeTab}
            onSelect={handleTabSelect}
          >
            <Tab eventKey="metrics" title="METRICS">
              <DashboardMetrics />
            </Tab>
            <Tab eventKey="heatmaps" title="HEATMAPS">
              <DashboardHeatmaps />
            </Tab>
            <Tab eventKey="confighistory" title="CONFIG HISTORY">
              <DashboardConfigHistory />
            </Tab>
          </Tabs>
        </Col>
      </Row>
    </div>
  );
}

export default Dashboard;
