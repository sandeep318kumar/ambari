import { ambariApi } from "./config/axiosConfig";

export const ServicesApi = {
  getServices: async (stack: string, version: string) => {
    const url = `stacks/${stack}/versions/${version}/services?fields=StackServices/*,components/*,components/dependencies/Dependencies/scope,components/dependencies/Dependencies/service_name,artifacts/Artifacts/artifact_name`;
    const response = await ambariApi.request({
      url: url,
      method: "GET",
    });
    return response.data;
  },
  deleteServiceWithUpdatedConfigs: async function (
    clusterName: string,
    data: any
  ) {
    const url = `/clusters/${clusterName}`;
    const response = await ambariApi.request({
      url: url,
      method: "PUT",
      headers: {
        "Content-Type": "text/plain",
        "X-Requested-By": "ambari-web",
      },
      data: JSON.stringify(data),
    });
    return response.data;
  },
};
