export const ServiceActionEnums = {
  startedServiceState: "STARTED",
  startAction: "Start",
  stopAction: "Stop",
  stoppedServiceState: "INSTALLED",
  clusterLevel: "CLUSTER",
  restartAllAction: "Restart All",
  turnOnMaintenanceMode: "Turn on Maintenance Mode",
  turnOffMaintenanceMode: "Turn off Maintenance Mode",
  restartDataNodeAction: "Restart DataNodes",
  restartRangerTagSyncsAction: "Restart Ranger TagSyncs",
  restartJournalNodeAction: "Restart JournalNodes",
  enableHighAvailibility: "Enable Namenode HA",
  enableRmHighAvailability:"Enable ResourceManager HA",
  enableNamenodeFederation: "Add New HDFS Namespace",
  rebalanceHDFS: "Rebalance HDFS",
  enableRangerHighAvailibility: "Enable Ranger Admin HA",
  runServiceCheck: "Run Service Check",
  serviceLevel: "SERVICE",
  manageJournalNodes:"Manage JournalNodes",
  restartYarnCapacityScheduler: "Restart YC",
  executeRefreshNodes: "Execute REFRESH_NODES",
  refreshYarnCapacityScheduler: "Refresh YARN Capacity Scheduler",
  refreshNodes: "Refresh Nodes",
  deleteServiceAction: "Delete Service",
  restartNodeManagerAction: "Restart NodeManagers",
  restartZooKeeperServerAction: "Restart ZooKeeper Servers",
  refreshConfigs: "Refresh Configs",
  restartZKFC: "Restart ZKFailoverControllers",
};

/**
 * Gets or creates a service action enum value for restarting a component
 * 
 * @param componentDisplayName - The display name of the component
 * @returns The action enum value
 */
export const getRestartActionEnum = (componentDisplayName: string): string => {
  const actionKey = `restart${componentDisplayName.replace(/\s+/g, '')}Action`;
  
  // If the action already exists in ServiceActionEnums, return it
  if (ServiceActionEnums[actionKey as keyof typeof ServiceActionEnums]) {
    return ServiceActionEnums[actionKey as keyof typeof ServiceActionEnums];
  }
  
  // Otherwise, create a new action name
  return `Restart ${componentDisplayName}`;
};
