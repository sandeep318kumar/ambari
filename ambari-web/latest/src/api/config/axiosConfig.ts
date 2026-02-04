import axios from "axios";
import { toast } from "react-hot-toast";
import { get } from "lodash";

const config = {
  development: {
    VITE_API_PROXY_TARGET: "<PROXY URL HERE>",
    //VITE_TOKEN: "<PROXY TOKEN HERE>",
  },
  production: {
    VITE_API_PROXY_TARGET: "",
  },
};

let currentEnv = "development"; // however you determine the current environment

if (process.env.NODE_ENV) {
  currentEnv = process.env.NODE_ENV;
}

const createAxiosInstance = (baseURL: string, headers = {}) => {
  if (currentEnv != undefined) {
    if (currentEnv == "development") {
      headers = {
        "Content-Type": "application/json",
        // Authorization: `Basic ${btoa(localStorage.getItem("proxy_token")||"admin:admin")}`,
        ...headers,
      };
    } else {
      headers = {
        "Content-Type": "application/json",
        // Authorization: `Basic ${btoa(localStorage.getItem("proxy_token")||"admin:admin")}`,
        ...headers,
      };
    }
  } else {
    console.error(`No configuration found for target: ${currentEnv}`);
  }

  const instance = axios.create({
    baseURL,
    withCredentials: true,
    headers: headers,
  });

  instance.interceptors.response.use(undefined, (error) => {
    const responseMessage = get(error, "response.data.message", undefined);
    // Check for 403 Forbidden status
    if (error.response && error.response.status === 403) {
      // Redirect to login page
      window.location.href = "/#/login";
      return Promise.reject(error);
    }
    if (responseMessage && error.response.status !== 400) {
      toast.error(responseMessage);
    }
    return Promise.reject(error);
  });

  return instance;
};

const createSupressErrorAxiosInstance = (baseURL: string, headers = {}) => {
  if (currentEnv != undefined) {
    headers = {
      "Content-Type": "application/json",
      ...headers,
    };
  }

  const instance = axios.create({
    baseURL,
    withCredentials: true,
    headers: headers,
  });

  instance.interceptors.response.use(undefined, (error) => {
    // Check for 403 Forbidden status
    if (error.response && error.response.status === 403) {
      // Redirect to login page
      window.location.href = "/#/login";
      return Promise.reject(error);
    }
    return Promise.reject(error);
  });

  return instance;
};

let endpoint = "";
if (config.development.VITE_API_PROXY_TARGET != undefined) {
  if (config.development.VITE_API_PROXY_TARGET != "") {
    endpoint = "/api/v1";
  } else {
    endpoint = `${config.production.VITE_API_PROXY_TARGET}/api/v1`;
  }
}

export const ambariApi = createAxiosInstance(endpoint);
export const supressErrorAmbariApi = createSupressErrorAxiosInstance(endpoint);
