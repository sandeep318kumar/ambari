import { ambariApi } from "./config/axiosConfig";

const adminApi = {

  getNnCheckPointStatus: async function (clusterName:string, hostName:string) {
    const url = `/clusters/${clusterName}/hosts/${hostName}/host_components/NAMENODE`;
    const response = await ambariApi.request({
      url: url,
      method: "GET",
    });
    return response.data;
  },
  getNnCheckPointStatuses: async function (clusterName:string, hostNames:string) {
    const url = `/clusters/${clusterName}/host_components?HostRoles/component_name=NAMENODE&HostRoles/host_name.in(${hostNames})&fields=HostRoles/desired_state,metrics/dfs/namenode&minimal_response=true`;
    const response = await ambariApi.request({
      url: url,
      method: "GET",
    });
    return response.data;
  },
  getJnCheckPointStatus:async function(clusterName:string, hostName:string){
    const url = `/clusters/${clusterName}/hosts/${hostName}/host_components/JOURNALNODE?fields=metrics`;
    const response = await ambariApi.request({
      url: url,
      method: "GET",
    });
    return response.data;
  },
  getSecurityStatus:async function(clusterName:string){
    const url=`/clusters/${clusterName}?fields=Clusters/security_type`
    const response = await ambariApi.request({
      url: url,
      method: "GET",
    });
    return response.data;
  },
  getSecurityType:async function(clusterName:string){
    const url=`/clusters/${clusterName}/configurations/service_config_versions?service_name=KERBEROS&is_current=true`
    const response = await ambariApi.request({
      url: url,
      method: "GET",
    });
    return response.data;
  },
  getKerberosSessionState:async function(clusterName:string){
    const url=`/clusters/${clusterName}/services/KERBEROS?fields=Services/attributes/kdc_validation_result,Services/attributes/kdc_validation_failure_details`
    const response = await ambariApi.request({
      url: url,
      method: "GET",
    });
    return response.data;
  }
};

export default adminApi