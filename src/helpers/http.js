import axios from "axios";
import { getNewAccessToken } from "../api/user/user.api";
import { getTokenFromStorage } from "./getTokenFromStorage";
import { setAccessToken, setRefreshToken } from "./setToken";
import { redirect } from "react-router-dom";
const apiUrl = import.meta.env.VITE_API_KEY;

class Http {
  constructor() {
    this.instance = axios.create({
      baseURL: apiUrl,
      name: "tms-website",
      timeout: 10000,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    this.instance.interceptors.response.use(
      (response) => {
        return response.data;
      },
      async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            const { accessToken, refreshToken } =
              await this.getNewAccessToken();
            setAccessToken(accessToken);
            setRefreshToken(refreshToken);
            // Lưu refreshToken mới vào cookie
            originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
            return this.retryRequest(originalRequest);
            // return axios(originalRequest);
          } catch (error) {
            // Xử lý lỗi khi không thể lấy được tokens mới
            redirect("/auth/login");
            return Promise.reject(error);
          }
        } else if (error.response.status === 400) {
          // Handle 400 errors here by returning response.data
          return Promise.reject(error.response.data);
        }
        return Promise.reject(error);
      }
    );

    this.instance.interceptors.request.use(
      async (config) => {
        if (config.url.includes("login") || config.url.includes("register")) {
          return config;
        }
        const accessToken = getTokenFromStorage();
        if (accessToken) {
          config.headers["Authorization"] = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }
  async getNewAccessToken() {
    try {
      const response = await getNewAccessToken();
      return response;
    } catch (error) {
      return Promise.reject(error);
    }
  }
  async retryRequest(originalRequest) {
    try {
      return await this.instance(originalRequest);
    } catch (error) {
      return Promise.reject(error);
    }
  }
  get(url, config = null) {
    return this.instance.get(url, config);
  }
  post(url, data, config = null) {
    return this.instance.post(url, data, config);
  }
  put(url, data, config = null) {
    return this.instance.put(url, data, config);
  }
  patch(url, data, config = null) {
    return this.instance.patch(url, data, config);
  }
  delete(url, data, config = null) {
    return this.instance.delete(url, {
      data,
      ...config,
    });
  }
}

const http = new Http();

export default http;
