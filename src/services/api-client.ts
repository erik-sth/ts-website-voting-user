import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://api.misplace.uk",
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
