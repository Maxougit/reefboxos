import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:3001";

const initializeAuth = async (updateStatusCallback) => {
  try {
    let appToken = localStorage.getItem("appToken");
    let trackId = localStorage.getItem("trackId");

    if (!appToken || !trackId) {
      const appTokenResponse = await getAppToken();

      localStorage.setItem("appToken", appTokenResponse.app_token); // Stocker pour les utilisations futures
      localStorage.setItem("trackId", appTokenResponse.track_id); // Stocker pour les utilisations futures
    }

    const checkAuthStatus = async () => {
      const statusResponse = await checkAuthorizationStatus(
        localStorage.getItem("trackId")
      );

      // setStatus(statusResponse.status);
      if (statusResponse.status === "granted") {
        const sessionToken = await getSessionToken(
          appToken,
          statusResponse.challenge
        );
        localStorage.setItem("sessionToken", sessionToken);
      } else if (statusResponse.status === "pending") {
        setTimeout(checkAuthStatus, 1000);
      } else {
        localStorage.removeItem("sessionToken");
      }
      updateStatusCallback(statusResponse.status); // Call the callback with the new status
    };

    checkAuthStatus();
  } catch (error) {
    console.error(
      "Erreur lors de l'initialisation de l'authentification",
      error
    );
  }
};

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
    if (response === "auth_required") {
      initializeAuth();
    }
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
    if (response === "auth_required") {
      localStorage.removeItem("sessionToken");
    }
    return response.data;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération de la liste des appareils",
      error
    );
    throw error;
  }
};

const getPing = async (ip) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/ping/${ip}`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération du ping", error);
    throw error;
  }
};

const getFavorite = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/favorite`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération du ping", error);
    throw error;
  }
};

const addFavorite = async (favoriteId) => {
  try {
    await axios.post(`${API_BASE_URL}/favorite`, { favoriteId });
  } catch (error) {
    console.error("Erreur lors de la récupération du ping", error);
    throw error;
  }
};

const removeFavorite = async (favoriteId) => {
  try {
    await axios.delete(`${API_BASE_URL}/favorite/${favoriteId}`);
  } catch (error) {
    console.error("Erreur lors de la récupération du ping", error);
    throw error;
  }
};

export {
  initializeAuth,
  getAppToken,
  getSessionToken,
  getInstantaneousRate,
  checkAuthorizationStatus,
  getListDevice,
  getPing,
  getFavorite,
  addFavorite,
  removeFavorite,
};
