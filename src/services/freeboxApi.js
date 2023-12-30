import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:3001";

const getAppToken = async () => {
  try {
    const response = await axios.post(`${API_BASE_URL}/appToken`);  
    return response.data;
  } catch (error) {
    console.error("Erreur lors de l'obtention du token d'application", error);
    throw error;
  }
};

const checkAuthorizationStatus = async (track_id) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/authorizationStatus/${track_id}`
    );  
    return response.data;
  } catch (error) {
    console.error(
      "Erreur lors de la vérification du statut de l'autorisation",
      error
    );
    throw error;
  }
};

const getSessionToken = async (appToken, challenge) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/sessionToken`, {
      appToken,
      challenge,
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de l'obtention du token de session", error);
    throw error;
  }
};

const getInstantaneousRate = async (sessionToken) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/instantaneousRate`, {
      headers: { "X-Fbx-App-Auth": sessionToken },
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération du débit instantané", error);
    throw error;
  }
};

const getListDevice = async (sessionToken) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/listDevice`, {
      headers: { "X-Fbx-App-Auth": sessionToken },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération de la liste des appareils",
      error
    );
    throw error;
  }
};

export {
  getAppToken,
  getSessionToken,
  getInstantaneousRate,
  checkAuthorizationStatus,
  getListDevice,
};
