import { ambariApi } from "./config/axiosConfig";

const WizardApi = {
  isHostsRegistered: async () => {
    const url = `/hosts?fields=Hosts/host_status`;
    const response = await ambariApi.request({
      url,
      method: "GET",
    });
    return response.data;
  },
  getStackConfigurations: async (
    stackName: string,
    stackVersion: string,
    services: string,
    fields: string
  ) => {
    const url = `/stacks/${stackName}/versions/${stackVersion}/services?StackServices/service_name.in(${services})&fields=${fields}`;
    const response = await ambariApi.request({
      url,
      method: "GET",
    });
    return response.data;
  },
  getStackThemes: async (
    stackName: string,
    stackVersion: string,
    services: string,
    fields: string
  ) => {
    const url = `/stacks/${stackName}/versions/${stackVersion}/services?StackServices/service_name.in(${services})&themes/ThemeInfo/default=true&fields=${fields}`;
    const response = await ambariApi.request({
      url,
      method: "GET",
    });
    return response.data;
  },
  getStackLevelConfigurations: async (
    stackName: string,
    stackVersion: string,
    fields: string
  ) => {
    const url = `/stacks/${stackName}/versions/${stackVersion}?fields=${fields}`;
    const response = await ambariApi.request({
      url,
      method: "GET",
    });
    return response.data;
  }
};

export default WizardApi;
