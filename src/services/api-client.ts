import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://api.misplace.uk",
  withCredentials: true,
  params: {},
});

export default apiClient;
