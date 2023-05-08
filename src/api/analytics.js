export const getLogsAnalytics = () => {
  return fetch(`${import.meta.env.VITE_API_URL}/logs/analytics`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_SECRET_TOKEN}`
    },
    method: 'get',
  }).then((response) => {
    if (!response.ok) {
      throw new Error(response.json().message);
    }
    return response.json();
  })
    .catch((error) => {
      throw error
    });
};