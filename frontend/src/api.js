import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000/api",
});

// Example register function
export const registerUser = async (fullName, email, password) => {
  return await api.post("/auth/register", {
    fullName,
    email,
    password,
  });
};

// Example login function
export const loginUser = async (email, password) => {
  return await api.post("/auth/login", {
    email,
    password,
  });
};

// Edit profile function
export const editProfile = async (profileData, token) => {
  return await api.put(
    "/profile",
    profileData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export default api;