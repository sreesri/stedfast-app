import axios from "axios";

const API_URL = "https://stedfast-backend.onrender.com";

export const getBaseConfig = async () => {
  const response = await axios.get(`${API_URL}/base-config`);
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
