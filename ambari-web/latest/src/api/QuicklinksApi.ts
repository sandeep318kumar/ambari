import { ambariApi } from "./config/axiosConfig";

export const QuicklinksApi = {
    getQuicklinks: async (stackVersion: string,stackName:string, serviceName: string) => {
        const url = `/stacks/${stackName}/versions/${stackVersion}/services/${serviceName}/quicklinks?QuickLinkInfo/default=true&fields=*&_=${Date.now()}'`;
        const response = await ambariApi.request({
            url: url,
            method: "GET",
        });
        return response;
    }
}