// const API_URL = `https://dev-backend.socialhear.com/`;
import { getBackendUrl } from "../../utils/apiUrl";

export const registerUser = async (username, email, password) => {
  const apiUrl= getBackendUrl();
  try {
    const response = await fetch(`${apiUrl}/api/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }
    return data;

  } catch (error) {
    throw error; 
  }
};
