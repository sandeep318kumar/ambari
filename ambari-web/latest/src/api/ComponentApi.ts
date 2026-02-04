import { ambariApi } from "./config/axiosConfig";

const componentApi = {

  editComponent: async function (clusterName:string,data:any) {
    const url = `/clusters/${clusterName}/components`;
    const response = await ambariApi.request({
      url: url,
      method: "PUT",
      data
    });
    return response.data;
  },
};

export default componentApi;