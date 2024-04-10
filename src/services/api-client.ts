import axios from 'axios';
import rateLimit from 'axios-rate-limit';

const baseApiClient = axios.create({
	baseURL: "https://api.misplace.uk",
	withCredentials: true,
	params: {},
});
// Create a rate-limited instance of the baseApiClient
const apiClient = rateLimit(baseApiClient, {
	maxRequests: 20, // Maximum number of requests
	perMilliseconds: 1000 * 60 * 2, // Time period in milliseconds
});

export default apiClient;
