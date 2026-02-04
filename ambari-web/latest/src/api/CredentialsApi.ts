import { ambariApi } from "./config/axiosConfig";

const CredentialsApi = {
  createCredentials: async function (
    clusterName: string,
    alias: string,
    data: { resource: string }
  ) {
    const url = `/clusters/${clusterName}/credentials/${alias}`;
    const response = await ambariApi.request({
      url: url,
      method: "POST",
      data: {
        Credential: data.resource,
      },
    });
    return response.data;
  },
  getCredentials: async function (
    clusterName: string,
    alias: string,
  ) {
    const url = `/clusters/${clusterName}/credentials/${alias}`;
    const response = await ambariApi.request({
      url: url,
      method: "GET",
    });
    return response.data;
  },
  deleteCredentials: async function (
    clusterName: string,
    alias: string,
  ) {
    const url = `/clusters/${clusterName}/credentials/${alias}`;
    const response = await ambariApi.request({
      url: url,
      method: "DELETE",
    });
    return response.data;
  },
  updateCredentials: async function (
    clusterName: string,
    alias: string,
    data:{resource:string}
  ) {
    const url = `/clusters/${clusterName}/credentials/${alias}`;
    const response = await ambariApi.request({
      url: url,
      method: "PUT",
      data:{
        Credential:data.resource
      }
    });
    return response.data;
  },
  listCredentials: async function (
    clusterName: string,
  ) {
    const url = `/clusters/${clusterName}/credentials?fields=Credential/*`;
    const response = await ambariApi.request({
      url: url,
      method: "GET",
    });
    return response.data;
  },
  credentialsStoreInfo: async function (
    clusterName: string,
  ) {
    const url = `/clusters/${clusterName}?fields=Clusters/credential_store_properties`;
    const response = await ambariApi.request({
      url: url,
      method: "GET",
    });
    return response.data;
  },
  
};

export default CredentialsApi
