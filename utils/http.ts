import axios from "axios";

// axios.interceptors.request.use((request) => {
//   console.log("Starting Request", JSON.stringify(request, null, 2));
//   return request;
// });
// axios.interceptors.response.use((response) => {
//   console.log("Response:", JSON.stringify(response.data, null, 2));
//   return response;
// });

const API_URL = "https://stedfast-backend.onrender.com";

export const setAuthToken = (token: string | null) => {
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
};

export const doLogin = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const response = await axios.post(`${API_URL}/api/auth/login`, {
    email,
    password,
  });
  return response.data;
};

export const doSignup = async ({
  name,
  email,
  password,
}: {
  name: string;
  email: string;
  password: string;
}) => {
  const response = await axios.post(`${API_URL}/api/auth/register`, {
    name,
    email,
    password,
  });
  return response.data;
};

export const getFastingStatus = async () => {
  const response = await axios.get(`${API_URL}/api/fasting/current-status`);

  return response.data;
};

export const updateFastingStatus = async ({
  trackingState,
  startTime,
}: {
  trackingState: string;
  startTime: string;
}) => {
  const response = await axios.post(`${API_URL}/api/fasting/change-status`, {
    status: trackingState,
    startTime: startTime,
  });

  return response.data;
};

export const getUserSummary = async () => {
  const response = await axios.get(`${API_URL}/api/user/summary`);
  return response.data;
};

export const getMealLogs = async () => {
  const url = `${API_URL}/api/meallog?date=${new Date().toISOString()}`;
  const response = await axios.get(url);
  return response.data;
};

export const createMealLog = async ({
  name,
  time,
  calories,
  dish,
  date,
}: {
  name: string;
  time: string;
  calories: number;
  dish: string;
  date?: string;
}) => {
  const response = await axios.post(`${API_URL}/api/meallog`, {
    mealType: name,
    mealTime: time,
    calories,
    dish,
  });
  return response.data;
};

export const setupBaseConfig = async ({
  fastingWindow,
  eatingWindow,
  fastingStartTime,
  calorieLimit,
}) => {
  const { hour, minute } = fastingStartTime;
  // const ampm = hour >= 12 ? "PM" : "AM";
  // const h = hour % 12 || 12;
  const mm = minute < 10 ? `0${minute}` : minute;
  // const formattedTime = `${h}:${mm} ${ampm}`;

  const formattedTime = `${hour}:${mm}:00`;

  const response = await axios.post(`${API_URL}/api/user/settings`, {
    fastingWindow,
    eatingWindow,
    fastingStartTime: formattedTime,
    calorieLimit: calorieLimit,
  });
  return response.data;
};

export const getBaseConfig = async () => {
  const response = await axios.get(`${API_URL}/api/user/settings`);
  return response.data;
};
