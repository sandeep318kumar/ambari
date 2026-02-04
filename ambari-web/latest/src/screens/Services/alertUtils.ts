/**
 * Utility function to get component alerts with proper counting logic
 * @param alerts - Array of alerts to filter
 * @param componentName - Name of the component to filter alerts for
 * @param passiveState - The passive state of the component (used to detect maintenance mode)
 * @returns Object containing alerts array, count, and length for backward compatibility
 */
export function getComponentAlerts(alerts: any[], componentName: string, passiveState?: string) {
  // Safety check: ensure alerts is an array
  const alertsArray = Array.isArray(alerts) ? alerts : [];
  
  // Get all alerts for this component (including maintenance mode ones for popup display)
  const alertsForComponent = alertsArray.filter(
    (alert: any) => alert.component_name === componentName
  );
  
  
  // If component is in maintenance mode (passiveState is truthy and not "OFF"), return 0 count for badge display
  if (passiveState && passiveState !== "OFF") {
    return {
      alerts: alertsForComponent, // Include all alerts (including maintenance) for popup
      count: 0, // Show 0 count when in maintenance mode
      length: alertsForComponent.length // For backward compatibility with existing code
    };
  }
  
  // FIXED: Only count non-maintenance alerts for badge display like Ember.js (exclude maintenanceCount)
  const criticalCount = alertsForComponent.reduce((sum: number, alert: any) => 
    sum + (alert?.summary?.["CRITICAL"]?.count || 0), 0);
  const warningCount = alertsForComponent.reduce((sum: number, alert: any) => 
    sum + (alert?.summary?.["WARNING"]?.count || 0), 0);
  
  const totalCount = criticalCount + warningCount;
  
  return {
    alerts: alertsForComponent, // Include all alerts (including maintenance) for popup
    count: totalCount, // Only non-maintenance count for badge
    length: alertsForComponent.length // For backward compatibility with existing code
  };
}
