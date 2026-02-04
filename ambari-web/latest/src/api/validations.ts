import { ambariApi } from "./config/axiosConfig";

const ValidationsApi = {
  validateMapping: async (stack:string,version:string,data:any) => {
    const url = `/stacks/${stack}/versions/${version}/validations`;
    const response = await ambariApi.request({
      url,
      data,
      method: "POST",
    });
    return response.data;
  },
};

export default ValidationsApi;