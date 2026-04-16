import axios from "axios";
import { readSessionPayload } from "./session";

const backendUrl = process.env.NEXT_PUBLIC_BASEURL;

const axiosClient = axios.create({
    baseURL: backendUrl,
    withCredentials: true,
    // headers: {
    //     'Content-Type': 'application/json',
    // }
})

// Change to async here!
axiosClient.interceptors.request.use(
  async (config) => {
    try {
      // Use your server-side helper to get the decrypted payload
      const session = await readSessionPayload();
      
      // Since readSessionPayload handles the decryption, 
      // you get the actual API token stored inside the JWT
      if (session && session.token) {
        config.headers.Authorization = `Bearer ${session.token}`;
      }
    } catch (error) {
      console.error("Failed to fetch session in interceptor:", error);
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// ... keep your response interceptor for 401 handling

axiosClient.interceptors.response.use(
  (response) => response, 
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      // Only redirect on the client side
      if (typeof window !== "undefined") {
        const currentPath = window.location.pathname+ window.location.search;;
        const encodedPath = encodeURIComponent(currentPath);
        window.location.href = `/signin?error=session_expired&callbackUrl=${encodedPath}`;
      }
    }
    return Promise.reject(error);
  }
)

export default axiosClient;