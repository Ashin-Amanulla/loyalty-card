import axios from "axios";

// const BASE_URL = "https://loyalty-card.onrender.com/"
const BASE_URL = "https://loyalty-card-606z.onrender.com/"
// const BASE_URL = "http://localhost:3005/"
const token = localStorage.getItem("4ZbQwXtY8uVrN5mP7kL3JhF6");

const setupInterceptors = (instance) => {
    instance.interceptors.request.use((config) => {
      const token = localStorage.getItem("token") || '' ;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    }, (error) => {
      return Promise.reject(error);
    });
  
    instance.interceptors.response.use((response) => {
      return response;
    }, (error) => {
      return Promise.reject(error);
    });
  };

const createAxiosInstance = (baseURL, defaultHeaders = {}) => {
    const instance = axios.create({ baseURL, headers: defaultHeaders });
    setupInterceptors(instance);
    return instance;
};

export const AUTH_INSTANCE = createAxiosInstance(`${BASE_URL}api/admins`, { "Content-Type": "application/json" });
export const ADMIN_INSTANCE = createAxiosInstance(`${BASE_URL}api/admins`, { "Content-Type": "application/json", Authorization: `Bearer ${token}`, });
export const CARD_INSTANCE = createAxiosInstance(`${BASE_URL}api/loyalitycard`, { "Content-Type": "application/json",  Authorization: `Bearer ${token}`, });
export const CATEGORY_INSTANCE = createAxiosInstance(`${BASE_URL}api/category`, { "Content-Type": "application/json",  Authorization: `Bearer ${token}`, });
export const BRAND_INSTANCE = createAxiosInstance(`${BASE_URL}api/brand`, { "Content-Type": "application/json",  Authorization: `Bearer ${token}`, });
export const TRANSACTION_INSTANCE = createAxiosInstance(`${BASE_URL}api/transaction`, { "Content-Type": "application/json",  Authorization: `Bearer ${token}`, });
export const UPLOAD_INSTANCE = createAxiosInstance(`${BASE_URL}api/`, { "Content-Type": "multipart/form-data",  Authorization: `Bearer ${token}`, });

