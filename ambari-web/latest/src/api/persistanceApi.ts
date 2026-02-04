import { ambariApi } from "./config/axiosConfig";

const PersistanceApi = {
  validateMapping: async (data:any) => {
    const url = `/persist`;
    const response = await ambariApi.request({
      url,
      data,
      method: "POST",
    });
    return response.data;
  },
};

export default PersistanceApi;