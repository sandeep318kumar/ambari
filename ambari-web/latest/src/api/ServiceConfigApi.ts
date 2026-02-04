import { ambariApi } from "./config/axiosConfig";
export const ServiceConfigApi = {
    getServiceConfig: async function (clusterName: string, serviceName: string) {
        const url = `/clusters/${clusterName}/configurations/service_config_versions?service_name=${serviceName}&fields=service_config_version,user,hosts,group_id,group_name,is_current,createtime,service_name,service_config_version_note,stack_id,is_cluster_compatible&sortBy=service_config_version.desc&minimal_response=true`;
        const response = await ambariApi.request({
            url: url,
            method: "GET",
        });
        return response;
    },
    setIsCurrent: async function (clusterName: string, selectedServices: string[]) {
        const servicesQuery = selectedServices.join(',');
        const url = `/clusters/${clusterName}/configurations/service_config_versions?service_name.in(${servicesQuery})&is_current=true&fields=*&_=${Date.now()}\`;`
        const response = await ambariApi.request({
            url: url,
            method: "GET",
        });
        return response;
    },
};