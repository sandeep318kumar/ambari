import { ambariApi } from "./config/axiosConfig";
const ClusterDeploymentApi = {
    createCluster:async function createCluster(clusterName:string,data:any){{
        const url=`/clusters/${clusterName}`;
        const response=await ambariApi.request({
            url,
            method:"POST",
            data
        })
        return response.data
    }},
    createSelectedServices:async function createCluster(clusterName:string,data:any){{
        const url=`/clusters/${clusterName}/services`;
        return  ambariApi.request({
            url,
            method:"POST",
            data
        })
    }},
    addRequestToCreateComponent:async function addRequestToCreateComponent(clusterName:string,serviceName:string,data:any){{
        const url=`/clusters/${clusterName}/services?ServiceInfo/service_name=${serviceName}`
        const response=await ambariApi.request({
            url,
            method:"POST",
            data
        })
        return response.data
    }},
    registerHostToCluster:async function registerHostToCluster(clusterName:string,data:any){{
        const url=`/clusters/${clusterName}/hosts`
        const response=await ambariApi.request({
            url,
            method:"POST",
            data
        })
        return response.data
    }},
    applyClusterConfigs: async function(clusterName:string, applyConfigsPaylpoad: any) {
        const url = `/clusters/${clusterName}`;
        return ambariApi.request({
          url: url,
          method: "PUT",
          data: applyConfigsPaylpoad
        });

      }
};

export default ClusterDeploymentApi;