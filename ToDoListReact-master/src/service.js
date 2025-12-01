import axios from 'axios';

const apiUrl = "http://localhost:5098";

const apiClient = axios.create({
  baseURL: apiUrl
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default {

  logout: () => {
    localStorage.removeItem("token");
  },

  getTasks: async () => {
    const result = await apiClient.get('/items');
    return result.data;
  },

  addTask: async (name) => {
    const result = await apiClient.post('/items', {
      name: name,
      isComplete: false
    });
    return result.data;
  },

  setCompleted: async (id, isComplete, name) => {
    const result = await apiClient.put(`/items/${id}`, {
      name: name,
      isComplete: isComplete
    });
    return result.data;
  },

  deleteTask: async (id) => {
    const result = await apiClient.delete(`/items/${id}`);
    return result.data;
  }
};
