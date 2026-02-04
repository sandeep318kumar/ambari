import { ambariApi } from "./config/axiosConfig";

const RecommendationsApi = {
  loadRecommendations: async (stack:string,version:string,data:any) => {
    const url = `/stacks/${stack}/versions/${version}/recommendations`;
    const response = await ambariApi.request({
      url,
      data,
      method: "POST",
    });
    return response.data;
  },
};

export default RecommendationsApi;