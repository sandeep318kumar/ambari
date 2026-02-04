import { set } from "lodash";
import { ambariApi } from "./config/axiosConfig";

const nameNodeFederationApi = {
    formatNameNode : async function(clusterName: string, payload: any) {
        const url = `/clusters/${clusterName}/requests`
        const response = await ambariApi.request({
            url: url,
            method: "POST",
            data: payload
        });
        set(response, "data.status", response?.status)
        return response.data;
    },

    formatZKFC : async function(clusterName: string, payload: any) {
        const url = `/clusters/${clusterName}/requests`
        const response = await ambariApi.request({
            url: url,
            method: "POST",
            data: payload
        });
         set(response, "data.status", response?.status)
        return response.data;
    },
    bootStrapNameNode : async function(clusterName: string, payload: any) {
        const url = `/clusters/${clusterName}/requests`
        const response = await ambariApi.request({
            url: url,
            method: "POST",
            data: payload
        });
         set(response, "data.status", response?.status)
        return response.data;
    }
}

export default nameNodeFederationApi;