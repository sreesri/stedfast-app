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

export const getFastingStatus = async ({ userId }: { userId: string }) => {
  const response = await axios.get(
    `${API_URL}/api/fasting/${userId}/current-status`,
  );
  console.log(response.data);

  return response.data;
};

export const updateFastingStatus = async ({
  userId,
  trackingState,
  startTime,
}: {
  userId: string;
  trackingState: string;
  startTime: string;
}) => {
  const response = await axios.post(
    `${API_URL}/api/fasting/${userId}/change-status`,
    {
      status: trackingState,
      startTime: startTime,
    },
  );

  return response.data;
};
