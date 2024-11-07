const API_URL = 'https://dev-backend.socialhear.com/'; 



export const registerUser = async (username, email, password) => {
  try {
    const response = await fetch(`${API_URL}/api/users/register`, {
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
