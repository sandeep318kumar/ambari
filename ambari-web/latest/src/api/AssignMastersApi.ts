import { ambariApi } from "./config/axiosConfig";

const AssignMastersApi = {
    getCpuInfo: async function(HOSTS: any) {
        const hostsParams = HOSTS.join(',');
        const url = `/hosts?Hosts/host_name.in(${hostsParams})&fields=Hosts/cpu_count,Hosts/disk_info,Hosts/total_mem,Hosts/ip,Hosts/os_type,Hosts/os_arch,Hosts/public_host_name&minimal_response=true&_=1731567268225`;
        const response = await ambariApi.request({
            url: url,
            method: "GET"
        });
        return response;
    },
    postRecommendations: async function (payload: any, STACK: string, VERSION: string) {
      const url = `/stacks/${STACK}/versions/${VERSION}/recommendations`;
      const response = await ambariApi.request({
        url: url,
        method: "POST",
        data: payload
      });
      return response.data;
    },
    postValidations: async function (payload: any, STACK: string, VERSION: string) {
      const url = `/stacks/${STACK}/versions/${VERSION}/validations`;
      const response = await ambariApi.request({
        url: url,
        method: "POST",
        data: payload
      });
      return response.data;
    }
}
export default AssignMastersApi;