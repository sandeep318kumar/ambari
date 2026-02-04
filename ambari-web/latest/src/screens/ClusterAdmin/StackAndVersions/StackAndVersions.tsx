import { Tab, Tabs } from "react-bootstrap";
import ListStack from "./listStack";
import Versions from "./listVersion";
import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import VersionsApi from "../../../api/VersionsApi";
import { AppContext } from "../../../store/context";
import { get } from "lodash";
import UpgradeHistory from "./UpgradeHistory";
import { useAuth } from "../../../hooks/useAuth";
 
function StackAndVersions() {
  const { tabName } = useParams();
  const [selectedTab, setSelectedTab] = useState(tabName);
  const [showUpgradeHistory, setShowUpgradeHistory] = useState(false);
  const navigate=useNavigate();
  const { clusterName } = useContext(AppContext);

  // Authorization hooks - implementing Ember.js upgrade history authorization patterns
  const { hasAuthorization } = useAuth();
  
  // Check specific authorizations for upgrade history operations
  const canViewUpgradeHistory = hasAuthorization('CLUSTER.UPGRADE_DOWNGRADE_STACK');

  useEffect(() => {
    async function fetchUpgrades() {
      // Only fetch and show upgrade history if user has permission
      if (!canViewUpgradeHistory) {
        setShowUpgradeHistory(false);
        return;
      }

      const response = await VersionsApi.getUpgradeHistory(clusterName);
      const upgradeItems = get(response, "items");
      if(upgradeItems.length !== 0) 
        setShowUpgradeHistory(true);
    }
    fetchUpgrades();
  }, [canViewUpgradeHistory])

  return (
    <div className="py-4 mx-5">
      <Tabs
        className="ambari-tabs"
        activeKey={selectedTab}
        onSelect={(tab: any) => {
            navigate(`/main/admin/stack/${tab}`)
            setSelectedTab(tab);
        }}
      >
        <Tab title="Stack" eventKey={"services"}>
          <ListStack />
        </Tab>
        <Tab title="Versions" eventKey={"versions"}>
          <Versions />
        </Tab>
        { showUpgradeHistory && (
          <Tab title="Upgrade History" eventKey={"history"}>
            <UpgradeHistory />
          </Tab>
        )}
        
      </Tabs>
    </div>
  );
}
 
export default StackAndVersions;
