import { ambariApi } from "./config/axiosConfig";

const LogApi = {

  getLogData: async function (clusterName:string, requestId:string) {
    const url = `/clusters/${clusterName}/requests/${requestId}?fields=tasks/Tasks/command,tasks/Tasks/command_detail,tasks/Tasks/ops_display_name,tasks/Tasks/exit_code,tasks/Tasks/start_time,tasks/Tasks/end_time,tasks/Tasks/host_name,tasks/Tasks/id,tasks/Tasks/role,tasks/Tasks/status&minimal_response=true`;
    const response = await ambariApi.request({
      url: url,
      method: "GET",
    });
    return response.data;
  },
};

export default LogApi;