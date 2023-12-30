import axios from "axios";
import hmacSHA1 from "crypto-js/hmac-sha1.js";

const freeboxURL = "http://mafreebox.freebox.fr";

// Fonction pour obtenir un token d'application
const getAppToken = async () => {
  const appInfo = {
    app_id: "reefboxos",
    app_name: "ReefBoxOS",
    app_version: "1.0",
    device_name: "ReefOS",
  };

  try {
    // Remplacer par l'URL correcte de l'API Freebox
    const response = await axios.post(
      `${freeboxURL}/api/v8/login/authorize/`,
      appInfo
    );
    return response.data.result;
  } catch (error) {
    console.error("Erreur lors de l'obtention du token d'application", error);
    throw error; // Gérer ou propager l'erreur
  }
};

const checkAuthorizationStatus = async (track_id) => {
  try {
    const response = await axios.get(
      `${freeboxURL}/api/v8/login/authorize/${track_id}`
    );
    return response.data.result; // Assurez-vous que cela renvoie le statut de l'autorisation
  } catch (error) {
    console.error(
      "Erreur lors de la vérification du statut de l'autorisation",
      error
    );
    throw error;
  }
};

const getSessionToken = async (appToken, challenge) => {
  const password = hmacSHA1(challenge, appToken).toString();

  try {
    const response = await axios.post(freeboxURL + "/api/v8/login/session/", {
      app_id: "reefboxos",
      password: password,
    });
    return response.data.result.session_token; // or adjust based on the API response structure
  } catch (error) {
    console.error("Error obtaining session token", error);
    throw error;
  }
};

// Fonction pour obtenir le débit instantané
const getInstantaneousRate = async (sessionToken) => {
  try {
    // Remplacez par l'endpoint exact de l'API pour les données de débit
    const response = await axios.get(freeboxURL + "/api/v8/connection/full/", {
      headers: { "X-Fbx-App-Auth": sessionToken },
    });
    return response.data.result; // Ajustez en fonction de la structure réelle de la réponse
  } catch (error) {
    if (error.response.status === 403) {
      console.error("getInstantaneousRate", error); //to be fiexed : find the right error message
      return "auth_required";
    }
    console.error("Erreur lors de la récupération du débit instantané", error);
    throw error;
  }
};

const getListDevice = async (sessionToken) => {
  try {
    // Remplacez par l'endpoint exact de l'API pour les données de débit
    const response = await axios.get(freeboxURL + "/api/v8/lan/browser/pub", {
      headers: { "X-Fbx-App-Auth": sessionToken },
    });
    return response.data.result; // Ajustez en fonction de la structure réelle de la réponse
  } catch (error) {
    if (error.response.status === 403) {
      console.error("getListDevice", error); //to be fiexed : find the right error message
      return "auth_required";
    }
    console.error("Erreur lors de la récupération du débit instantané", error);
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
