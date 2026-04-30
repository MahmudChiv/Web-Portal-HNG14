import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: {
    "x-api-version": 1,
  },
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true, headers: { "x-api-version": 1 } }
        );
        return api(originalRequest);
      } catch (refreshError) {
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export const fetchDashboardMetrics = async () => {
  try {
    const response = await api.get("/api/profiles");
    return { total: response.data.total };
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const fetchProfiles = async ({ page = 1, filter = "", gender = "", country_id = "", min_age = "", max_age = "" } = {}) => {
  try {
    let url = `/api/profiles?page=${page}&limit=10`;
    if (filter) {
      // Actually, TRD says search is /api/profiles/search
      if (filter.length > 2) {
        url = `/api/profiles/search?q=${filter}&page=${page}&limit=10`;
      }
    }
    
    if (gender) {
      url += `&gender=${gender}`;
    }
    if (country_id) {
      url += `&country_id=${country_id}`;
    }
    if (min_age) {
      url += `&min_age=${min_age}`;
    }
    if (max_age) {
      url += `&max_age=${max_age}`;
    }
    
    const response = await api.get(url);
    // Return full paginated object
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const fetchProfileDetail = async (id) => {
  try {
    const response = await api.get(`/api/profiles/${id}`);
    return response.data.profile;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const addProfile = async (name) => {
  try {
    const response = await api.post("/api/profiles", { name });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const exportProfilesCSV = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams({ format: 'csv', ...filters }).toString();
    const response = await api.get(`/api/profiles/export?${queryParams}`, {
      responseType: 'blob'
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export default api;
