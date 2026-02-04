import { ambariApi } from "./config/axiosConfig";

export const ChooseServicesApi = {
  serviceDetails: async function (serviceName: string, clusterName: string) {
    const url = `/clusters/${clusterName}/services/${serviceName}`;
    const response = await ambariApi.request({
      url: url,
      method: "GET",
    });
    return response.data;
  },
  servicesList: async function (clusterName: string) {
    const url = `/clusters/${clusterName}/services`;
    const response = await ambariApi.request({
      url: url,
      method: "GET",
    });
    return response.data;
  },

  getServices: async (stack: string, version: string, services?: string[]) => {
    const url = `stacks/${stack}/versions/${version}/services?fields=StackServices/*,components/*,components/dependencies/Dependencies/scope,components/dependencies/Dependencies/service_name,artifacts/Artifacts/artifact_name${
      services ? `&StackServices/service_name.in(${services.join(",")})` : ""
    }`;
    const response = await ambariApi.request({
      url: url,
      method: "GET",
    });
    return response.data;
  },
};
