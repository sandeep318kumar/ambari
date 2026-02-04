import { centralizedServiceStateApi } from "../api/CentralizedServiceStateApi";
import { ServiceComponentMetricsEnums } from "../enums/ServiceComponentMetricsEnums";
import { cloneDeep, isEqual } from "lodash";

/**
 * Utility function to update service alerts and state using centralized API
 * This replaces individual ServiceApi.getServiceState() calls across all service updaters
 */
export const updateServiceAlertsAndStateFromCentralizedApi = (
  serviceName: string,
  serviceModelKey: string,
  allServiceModels: any,
  updateRegistry: Function
): boolean => {
  // Use centralized service state API instead of individual call
  const serviceStateData = centralizedServiceStateApi.getServiceStateData(serviceName);
  
  if (!serviceStateData || !allServiceModels[serviceModelKey]) {
    return false;
  }

  const { alertsCount, hasCriticalAlerts, state } = serviceStateData;

  if (!alertsCount && alertsCount !== 0) {
    return false;
  }

  const currentConfig = cloneDeep(allServiceModels[serviceModelKey]);

  // Update alerts and state based on service type
  currentConfig[ServiceComponentMetricsEnums.AMBARI_METRICS.hasCriticalAlerts] = hasCriticalAlerts;
  
  // Set service-specific metrics
  const serviceMetrics = ServiceComponentMetricsEnums[serviceName as keyof typeof ServiceComponentMetricsEnums];
  if (serviceMetrics) {
    if (serviceMetrics.alertsCount) {
      currentConfig[serviceMetrics.alertsCount] = alertsCount;
    }
    if (serviceMetrics.state) {
      currentConfig[serviceMetrics.state] = state;
    }
  }

  // Update if there are changes
  if (!isEqual(allServiceModels[serviceModelKey], currentConfig)) {
    allServiceModels[serviceModelKey].updateConfig(currentConfig);
    updateRegistry(allServiceModels);
    return true;
  }

  return false;
};
