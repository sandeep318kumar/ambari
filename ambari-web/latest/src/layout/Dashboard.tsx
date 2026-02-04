import { useEffect, useMemo, useRef, useState } from "react";
import { Outlet, useParams } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../store/context.tsx";
import { AlertsApi } from "../api/alertsApi.ts";
import { useLocation } from "react-router-dom";
import {
  chain,
  flatMap,
  map,
  get,
  cloneDeep,
  filter,
  snakeCase,
  startCase,
} from "lodash";
import ViewApi from "../api/ViewApi";
import SideBar from "../components/Sidebar/Sidebar";
import NavBar from "../components/Navbar";
import LicenseFooter from "../components/LicenseFooter";
import ServiceProvider from "../store/ServiceContext";
import { Alert, Button } from "react-bootstrap";
import modalManager from "../store/ModalManager.ts";
import Upgrade from "../screens/ClusterAdmin/StackAndVersions/upgrade.tsx";
import { getUpgradeRequestStatus, translate } from "../Utils/Utility.ts";
import { messages } from "../screens/messages.ts";
import ClusterApi from "../api/clusterApi.ts";
import { processData } from '../screens/Alerts/alertUtils';
import useAuth from "../hooks/useAuth.ts";
import { isUpgradeRequest } from "../screens/BackgroundOperations/index.tsx";
import { HostsApi } from "../api/hostsApi.ts";
import usePolling from "../hooks/usePolling.ts";
/**
 * DashboardLayout component is responsible for rendering the main layout of the dashboard.
 * It includes a sidebar, a navigation bar, and an outlet for nested routes.
 *
 * @component
 * @example
 * return (
 *   <DashboardLayout />
 * )
 *
 * @returns {JSX.Element} The rendered component.
 *
 * @remarks
 * - Uses `useState` to manage the sidebar collapse state and cluster name.
 * - Uses `useEffect` to fetch the cluster name on component mount.
 * - Uses `useLocation` to get the current location parameters.
 *
 * @function getSubPath
 * @param {string} pathname - The current pathname.
 * @returns {string} The sub-path extracted from the pathname.
 */
const DashboardLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const location = useLocation();
  const [instanceInfoList, setInstanceInfoList] = useState<
    { name: string; link: string }[]
  >([]);
  const { clusterName, upgradeId, upgradeState, upgradeDirection, upgradeIsFinalizeItem, runningOperationsCount, cluster } =
    useContext(AppContext);
  
  const isClusterInstalled = cluster?.provisioning_state === "INSTALLED";
  // add a id and name map of alerts
  const [alertLabels, setAlertLabels] = useState(new Map());
  const { hostname } = useParams();
  //@ts-ignore
  const [clusterRequests, setClusterRequests] = useState<any[]>([]);
  const { parsedSocketMessages } = useContext(AppContext);
  const requestsRef = useRef<any>([]);
  const [alertLabelsLoaded, setAlertLabelsLoaded] = useState(false);
  const [hostMaintenanceState, setHostMaintenanceState] = useState<string>("OFF");

  // Function to fetch host maintenance state
  const fetchHostMaintenanceState = async () => {
    // TLHASD-1163: Fetch host maintenance state for breadcrumb display
    if (!isClusterInstalled || !hostname) {
      return;
    }
    
    try {
      const hostData = await HostsApi.getHostComponentsDetails(
        clusterName,
        `fields=Hosts/maintenance_state&Hosts/host_name=${hostname}`
      );
      
      if (hostData?.items?.length > 0) {
        const maintenanceState = get(hostData.items[0], "Hosts.maintenance_state", "OFF");
        setHostMaintenanceState(maintenanceState);
      }
    } catch (error) {
      console.error("Failed to fetch host maintenance state:", error);
    }
  };

  // Use polling for real-time updates of host maintenance state
  const { pausePolling: pauseHostPolling, resumePolling: resumeHostPolling } = usePolling(
    fetchHostMaintenanceState,
    10000 // Poll every 10 seconds for real-time updates
  );

  const { hasAuthorization } = useAuth();
    
  // Check specific authorizations for stack/version operations
  const canUpgradeDowngrade = hasAuthorization('CLUSTER.UPGRADE_DOWNGRADE_STACK');

  //add a function to get list of instance names from instances
  const fetchInstancesInfo = (data: any) => {
    const instanceDetails = chain(data?.items || [])
      .flatMap((item) =>
        flatMap(get(item, "versions", []), (version) =>
          map(get(version, "instances", []), (instance) => ({
            ...get(instance, "ViewInstanceInfo", {}),
            view_name: get(item, "ViewInfo.view_name"),
            version: get(version, "ViewVersionInfo.version"),
            // Ensure all required properties are present
            label: get(instance, "ViewInstanceInfo.label"),
            instance_name: get(instance, "ViewInstanceInfo.instance_name"),
          }))
        )
      )
      .compact()
      .value();

    setInstanceInfoList(instanceDetails);
  };

  useEffect(() => {
    setClusterRequests(cloneDeep(requestsRef.current));
  }, [JSON.stringify(requestsRef.current)]);

  async function getClusterRequests() {
    const allClusterRequests = await ClusterApi.getRequests(clusterName, 20);
    requestsRef.current = map(allClusterRequests.items, "Requests") || [];
    setClusterRequests(map(allClusterRequests.items, "Requests") || []);
  }

  useEffect(() => {
    const requestMessages = filter(parsedSocketMessages, [
      "destination",
      "/events/requests",
    ]);
    const requestsCopy = cloneDeep(requestsRef.current) || [];
    requestMessages.reverse().forEach((message) => {
      const request = message;
      if (request && !isUpgradeRequest({request_context: request.requestContext})) {
        const requestId = request.requestId;
        // Check if the request already exists in the state
        const existingRequest = requestsCopy.find(
          (req: any) => req.id === requestId
        );
        if (!existingRequest) {
          const newRequest: any = {};
          for (const key in request) {
            newRequest[snakeCase(key)] = request[key];
          }
          newRequest.id = request.requestId;
          requestsCopy.push(newRequest);
        } else {
          // Update the existing request with new data
          existingRequest.request_status = request.requestStatus;
        }
      }
    });
    requestsRef.current = requestsCopy;
    setClusterRequests(requestsCopy);

    // TLHASD-1163: Listen for host maintenance state changes in real-time
    if (hostname) {
      const hostMessages = filter(parsedSocketMessages, [
        "destination",
        "/events/hosts",
      ]);
      
      hostMessages.forEach((message) => {
        // Check if this message is about the current host and has maintenance state info
        if (message.hostName === hostname || message.host_name === hostname) {
          if (message.maintenanceState !== undefined) {
            setHostMaintenanceState(message.maintenanceState);
          } else if (message.maintenance_state !== undefined) {
            setHostMaintenanceState(message.maintenance_state);
          } else if (message.Hosts && message.Hosts.maintenance_state !== undefined) {
            setHostMaintenanceState(message.Hosts.maintenance_state);
          }
        }
      });
    }
  }, [parsedSocketMessages, hostname]);

  // add a function to fetch view lists instances
  useEffect(() => {
    const fetchViewList = async () => {
      try {
        fetchInstancesInfo(await ViewApi.getInstances());
      } catch (error) {
        console.error("Failed to fetch view list:", error);
      }
    };
    fetchViewList();
  }, []);

  useEffect(() => {
    const fetchAlertsLabel = async () => {
      // TLHASD-745: Only fetch alerts if cluster is installed
      if (!isClusterInstalled) {
        setAlertLabelsLoaded(true);
        return;
      }
      
      try {
        // Use the same API calls as the Alerts page
        const [alertsResponse, summariesResponse] = await Promise.all([
          AlertsApi.getAlerts(
            clusterName,
            'AlertGroup/default,AlertGroup/definitions,AlertGroup/id,AlertGroup/name,AlertGroup/targets',
            Date.now()
          ),
          AlertsApi.getAlertSummary(clusterName, Date.now())
        ]);

        const processedAlerts = processData(alertsResponse, summariesResponse);        
        // Extract labels from the processed data
        const alertLabelsCopy = new Map();
        processedAlerts.forEach(alert => {
          if (alert.alert_definition_id && alert.label) {
            alertLabelsCopy.set(alert.alert_definition_id, alert.label);
          }
        });      
        setAlertLabels(alertLabelsCopy); // Ensure state update
        setAlertLabelsLoaded(true);
      } catch (error) {
        console.error("Failed to fetch alert labels:", error);
        setAlertLabelsLoaded(true);
      }
    };
    
    const getClusterRequestsConditional = async () => {
      if (!isClusterInstalled) {
        return;
      }
      
      await getClusterRequests();
    };

    if (clusterName) {
      fetchAlertsLabel();
      getClusterRequestsConditional();
      fetchHostMaintenanceState();
    }
  }, [clusterName, isClusterInstalled, hostname]);

  // Start/stop polling based on whether we're on a host page
  useEffect(() => {
    if (hostname && isClusterInstalled) {
      resumeHostPolling();
    } else {
      pauseHostPolling();
    }
    
    return () => {
      pauseHostPolling();
    };
  }, [hostname, isClusterInstalled]);

  const generateBreadcrumbs = (pathname: string) => {
    const pathParts = pathname.split("/").filter(Boolean);
    return pathParts.map((part, index) => {
      const path = `/${pathParts.slice(0, index + 1).join("/")}`;
      return { name: part, path };
    });
  };

  //add a function getSubPath
  const getSubPath = (pathname: string) => {
    let nameMap = generateBreadcrumbs(pathname);
    let subPath = "";

    for (let i = 0; i < nameMap.length; i++) {
      // Skip 'main' from navbar display
      if (nameMap[i].name !== "main") {
        // Special case for hostname
        if (nameMap[i].name === hostname) {
          subPath += nameMap[i].name;
        } else {
          // Check for compound words (like ServicesHDFS or AdminStack)
          let segment = nameMap[i].name;
          let formattedSegment = "";

          // Handle special cases where a segment might start with the previous segment
          if (
            i > 0 &&
            nameMap[i - 1].name !== "main" &&
            segment.toLowerCase().startsWith(nameMap[i - 1].name.toLowerCase())
          ) {
            // Extract the part after the previous segment name
            const remainder = segment.slice(nameMap[i - 1].name.length);

            // Format the remainder
            const parts = snakeCase(remainder).split("_");
            const formattedRemainder = parts
              .map((part) => startCase(part))
              .join(" ");

            // Get the formatted previous segment name
            const prevParts = snakeCase(nameMap[i - 1].name).split("_");
            const formattedPrev = prevParts
              .map((part) => startCase(part))
              .join(" ");

            formattedSegment = formattedPrev + " " + formattedRemainder;
          } else {
            // Normal case - format the whole segment
            const parts = snakeCase(segment).split("_");
            formattedSegment = parts.map((part) => startCase(part)).join(" ");
          }

          subPath += formattedSegment;
        }
      }

      // Add separator between segments
      if (i < nameMap.length - 1) {
        subPath += " / ";
      }
    }

    // Handle alert IDs
    const alertId = subPath.split(" Alerts / ")[1];
    if (alertId && parseInt(alertId) > 0) {
      const id = parseInt(alertId);
      const label = alertLabels.get(id);
      if (label && label !== "Unknown") {
      subPath = subPath.replace(alertId, label);
      }
    }

    return subPath;
  };

  const subPath = useMemo(() => {
    // Only show "Loading..." for alert-specific pages that need alert labels
    const isAlertPage = location.pathname.includes('/alerts/') && 
                       location.pathname.split('/').pop() && 
                       parseInt(location.pathname.split('/').pop()!) > 0;
    
    if (isAlertPage && !alertLabelsLoaded) {
      return "Loading...";
    }
    
    return getSubPath(location.pathname);
  }, [location.pathname, alertLabelsLoaded, alertLabels.size]);

  return (
    <>
      <div className="d-flex flex-row h-100">
        <ServiceProvider>
          <SideBar
            isSidebarCollapsed={isSidebarCollapsed}
            setIsSidebarCollapsed={setIsSidebarCollapsed}
          />
          <div
            className={`d-flex flex-column ${
              isSidebarCollapsed ? "main-content-collapsed" : "main-content"
            }`}
            style={{
              background: "#e6e6e6",
              maxHeight: "100%",
              overflowY: "scroll",
              height: "100%",
              position: "absolute",
              left: isSidebarCollapsed ? "60px" : "230px",
            }}
          >
            <NavBar
              subPath={subPath}
              //add instanceInfoList name in the views list
              viewsList={instanceInfoList}
              runningRequestsCount={runningOperationsCount}
              hostMaintenanceState={hostname ? hostMaintenanceState : undefined}
              hostname={hostname}
            />
            {upgradeState !== "NOT_REQUIRED" &&
              upgradeState !== "COMPLETED" && (
                <div className="text-center">
                  <Button
                    size="sm"
                    variant="danger"
                    disabled={!canUpgradeDowngrade}
                    onClick={() => {
                      if (upgradeId !== 0 && canUpgradeDowngrade)
                        modalManager.show(<Upgrade upgradeId={upgradeId} />);
                    }}
                  >
                    {get(
                      messages,
                      getUpgradeRequestStatus(
                        upgradeState,
                        upgradeDirection == "DOWNGRADE"
                      )
                    )}
                  </Button>
                  {upgradeIsFinalizeItem && (
                    <Alert variant="danger" className="mt-3 mx-auto w-75">{translate("admin.stackVersions.version.upgrade.notFinalized.warning")}</Alert>
                  )}
                </div>
              )}
            <div style={{ paddingBottom: '80px' }}>
              <Outlet></Outlet>
            </div>
          </div>
        </ServiceProvider>
      </div>
      <LicenseFooter isSidebarCollapsed={isSidebarCollapsed} />
    </>
  );
};

export default DashboardLayout;
