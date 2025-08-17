// src/app/api.js
export const post = async (data, endpoint = "") => {
  const response = await fetch(`/api/${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response.json();
};

export const get = async (endpoint) => {
  const response = await fetch(`/api/${endpoint}`);
  return response.json();
};
