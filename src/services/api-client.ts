import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://192.168.4.50:3000",
  withCredentials: true,
  params: {},
});
apiClient.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (error?.response?.status === 401) {
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
export default apiClient;
