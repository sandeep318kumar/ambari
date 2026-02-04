import { ambariApi } from "./config/axiosConfig";

const ConfigHistoryApi = {
  fetchPageSize: async (clusterName: string) => {
    const url = `/clusters/${clusterName}/configurations/service_config_versions?page_size=1&minimal_response=true`;
    const response = await ambariApi.request({
      url,
      method: "GET",
    });
    return response.data;
  },
  fetchConfigHistory: async (clusterName: string, parameters: string) => {
    const url = `/clusters/${clusterName}/configurations/service_config_versions?${parameters}fields=service_config_version,user,group_id,group_name,is_current,createtime,service_name,hosts,service_config_version_note,is_cluster_compatible,stack_id&minimal_response=true`;
    const response = await ambariApi.request({
      url,
      method: "GET",
    });
    return response.data;
  },
};

export default ConfigHistoryApi;
