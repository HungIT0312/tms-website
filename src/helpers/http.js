import axios from "axios";
import { getNewAccessToken } from "../api/user/user.api";
import { getTokenFromStorage } from "./getTokenFromStorage";
import { setAccessToken } from "./setToken";
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
    });
    this.instance.interceptors.response.use(
      (response) => {
        return response.data;
      },
      ({ response }) => {
        if (response.status === 400) {
          return Promise.reject(response.data);
        }
        const result = { ...response.data, status: response.status };
        return Promise.reject(result);
      },
      async (error) => {
        const originalRequest = error.config;
        console.log(originalRequest);
        if (error.response.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const newAccessToken = await this.getNewAccessToken();
            if (newAccessToken) {
              setAccessToken(newAccessToken); // Lưu accessToken mới vào storage
              originalRequest.headers[
                "Authorization"
              ] = `Bearer ${newAccessToken}`;
              return axios(originalRequest);
            }
          } catch (refreshError) {
            // Xử lý lỗi khi lấy accessToken mới không thành công
            return Promise.reject(refreshError);
          }
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
    // this.instance.interceptors.response.use(
    //   (response) => {
    //     return response.data;
    //   }
    // );
  }
  async getNewAccessToken(refreshToken) {
    try {
      const response = await getNewAccessToken(refreshToken);
      return response.data.accessToken;
    } catch (error) {
      return null;
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
