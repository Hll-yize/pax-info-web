import Cookies from 'js-cookie';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

// 创建 Axios 实例
const axiosInstance = axios.create({
  baseURL: '/api', // 使用环境变量设置基础 URL
  timeout: 10000, // 请求超时
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
axiosInstance.interceptors.request.use(
  (config) => {
    // 获取 token
    const token = typeof window !== 'undefined' ? Cookies.get('token') : null;
    console.log('token:', token);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      // 避免重复跳转
      if (typeof window !== 'undefined' && window.location.pathname !== '/signin') {
        // 清理 token
        document.cookie = 'token=; Max-Age=0';

        // 跳转到登录页面
        window.location.href = '/signin';
      }
    }

    return Promise.reject(error);
  }
);

// 通用的请求函数
const request = async <T>(config: {
    url: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    data?: Record<string, unknown>,
    params?: Record<string, unknown>,
    isAuthRequired?: boolean
}): Promise<T> => {
  const { method, url, data, params, isAuthRequired = true } = config;
  // 如果不需要 Authorization，则删除请求头中的 Authorization
  if (!isAuthRequired) {
    delete axiosInstance.defaults.headers['Authorization'];
  }

  try {
    const config: AxiosRequestConfig = {
      url,
      method,
      data,
      params,
    };

    const response: AxiosResponse<T> = await axiosInstance(config);
    return response.data;
  } catch (error) {
    // 如果有错误，可以在此进行日志处理或其他操作
    console.error(error);
    throw error;
  }
};

export default request;
