import ClusterApi from "../api/clusterApi";
import ConfigsApi from "../api/ConfigsApi";
import { ambariApi } from "../api/config/axiosConfig";

/**
 * Safely update cluster-env configuration while preserving existing properties
 * This prevents the auto-start settings from being accidentally reset
 */
export const safeUpdateClusterEnvConfig = async (
  clusterName: string,
  newProperties: Record<string, any>,
  serviceConfigVersionNote?: string
): Promise<any> => {
  try {
    
    // Get current cluster configuration
    const response = await ClusterApi.getCluster(clusterName);
    const desiredConfigs = response?.Clusters?.desired_configs;

    if (!desiredConfigs || !desiredConfigs["cluster-env"]) {
      throw new Error('cluster-env configuration not found');
    }

    const clusterEnvTag = desiredConfigs["cluster-env"].tag;
    
    // Get current cluster-env configuration with all properties
    const configUrl = `clusters/${clusterName}/configurations?type=cluster-env&tag=${clusterEnvTag}&fields=*`;
    const configResponse = await ambariApi.request({
      url: configUrl,
      method: "GET",
    });

    if (!configResponse.data || !configResponse.data.items || configResponse.data.items.length === 0) {
      throw new Error('Failed to get current cluster-env configuration');
    }

    const clusterEnvConfig = configResponse.data.items[0];
    
    // Get ALL existing properties from the current configuration
    const existingProperties = clusterEnvConfig.properties || {};
    
    
    // Create updated properties by merging existing properties with the new values
    // This prevents data loss by preserving all existing configuration including recovery_enabled
    const updatedProperties = {
      ...existingProperties,
      ...newProperties
    };
    

    // Save the updated configuration using the proper service config API structure
    const configData = {
      Clusters: {
        desired_config: {
          type: "cluster-env",
          tag: `version${Date.now()}`,
          properties: updatedProperties, // Send ALL properties, not just the changed ones
          service_config_version_note: serviceConfigVersionNote || "Updated cluster-env configuration"
        }
      }
    };

    const saveResponse = await ConfigsApi.saveConfigs(clusterName, configData);
    
    return saveResponse;
  } catch (error) {
    console.error("Error safely updating cluster-env config:", error);
    throw error;
  }
};

/**
 * Get current cluster-env properties
 */
export const getClusterEnvProperties = async (clusterName: string): Promise<Record<string, any>> => {
  try {
    const response = await ClusterApi.getCluster(clusterName);
    const desiredConfigs = response?.Clusters?.desired_configs;

    if (!desiredConfigs || !desiredConfigs["cluster-env"]) {
      throw new Error('cluster-env configuration not found');
    }

    const clusterEnvTag = desiredConfigs["cluster-env"].tag;
    
    // Get current cluster-env configuration
    const configUrl = `clusters/${clusterName}/configurations?type=cluster-env&tag=${clusterEnvTag}&fields=*`;
    const configResponse = await ambariApi.request({
      url: configUrl,
      method: "GET",
    });

    if (!configResponse.data || !configResponse.data.items || configResponse.data.items.length === 0) {
      throw new Error('Failed to get current cluster-env configuration');
    }

    const clusterEnvConfig = configResponse.data.items[0];
    return clusterEnvConfig.properties || {};
  } catch (error) {
    console.error("Error getting cluster-env properties:", error);
    throw error;
  }
};
