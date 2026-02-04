import { ambariApi } from "./config/axiosConfig.ts";

export const ActionsApi = {
  serviceAction: async function (
    clusterName: string,
    serviceName: string,
    payloadData: object
  ) {
    const response = await ambariApi.request({
      url: `/clusters/${clusterName}/services/${serviceName}`,
      method: "PUT",
      data: payloadData,
    });
    return response;
  },
  turnOnOffMaintenance: async function (
    clusterName: string,
    serviceName: string,
    payloadData: { requestInfo: string; passive_state: string }
  ) {
    const url = `/clusters/${clusterName}/services/${serviceName}`;
    const payload = {
      RequestInfo: {
        context: payloadData.requestInfo,
      },
      Body: {
        ServiceInfo: {
          maintenance_state: payloadData.passive_state,
        },
      },
    };
    const response = await ambariApi.request({
      url,
      method: "PUT",
      data: payload,
    });
    return response;
  },
  actionRequest: async function (clusterName: string, payloadData: any) {
    const response = await ambariApi.request({
      url: `/clusters/${clusterName}/request_schedules`,
      method: "POST",
      data: payloadData
    });
    return response;
  },
  actionRequestRebalanceHDFS: async function (clusterName: string, payloadData: object) {
    const response = await ambariApi.request({
      url: `/clusters/${clusterName}/requests`,
      method: "POST",
      data: payloadData
    });
    return response;
  },
  submitActionRequest: async function (clusterName: string, payloadData: object) {
    const response = await ambariApi.request({
      url: `/clusters/${clusterName}/requests`,
      method: "POST",
      data: payloadData
    });
    return response;
  },
  regenerateKeytabsForService: async function (clusterName: string, serviceName: string, payloadData: any) {
    const response = await ambariApi.request({
      url: `/clusters/${clusterName}?regenerate_keytabs=all&regenerate_components=${serviceName}&config_update_policy=none`,
      method: "PUT",
      data: payloadData,
    });
    return response;
  }
};
