import React, { useState, useEffect } from "react";
import {
  getAppToken,
  checkAuthorizationStatus,
  getSessionToken,
  getInstantaneousRate,
} from "./services/freeboxApi";
import RateChart from "./components/bandwidthGraph";

const App = () => {
  const [status, setStatus] = useState("pending"); // 'pending', 'denied', 'granted'
  const [rateHistory, setRateHistory] = useState([]); // Modifier pour stocker l'historique des débits

  //authentification
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        let appToken = localStorage.getItem("appToken");
        let trackId = localStorage.getItem("trackId");

        if (!appToken || !trackId) {
          const appTokenResponse = await getAppToken();

          console.log("Token d'application : ", appTokenResponse);

          localStorage.setItem("appToken", appTokenResponse.app_token); // Stocker pour les utilisations futures
          localStorage.setItem("trackId", appTokenResponse.track_id); // Stocker pour les utilisations futures
        }

        const checkAuthStatus = async () => {
          const statusResponse = await checkAuthorizationStatus(
            localStorage.getItem("trackId")
          );

          console.log("Statut de l'autorisation : ", statusResponse.status);

          setStatus(statusResponse.status);
          if (statusResponse.status === "granted") {
            const sessionToken = await getSessionToken(
              appToken,
              statusResponse.challenge
            );
            localStorage.setItem("sessionToken", sessionToken);
          } else if (statusResponse.status === "pending") {
            setTimeout(checkAuthStatus, 1000);
          }
        };

        checkAuthStatus();
      } catch (error) {
        console.error(
          "Erreur lors de l'initialisation de l'authentification",
          error
        );
      }
    };

    initializeAuth();
  }, []);

  // Récupération des données de débit
  useEffect(() => {
    const fetchRate = async () => {
      try {
        const sessionToken = localStorage.getItem("sessionToken");
        const rateData = await getInstantaneousRate(sessionToken);
        // console.log("Données de débit : ", rateData);
        setRateHistory((prevHistory) => [
          ...prevHistory,
          { timestamp: new Date(), ...rateData },
        ]);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des données de débit",
          error
        );
      }
    };

    if (status === "granted") {
      fetchRate(); // Récupérer immédiatement les données de débit
      const intervalId = setInterval(fetchRate, 1000); // Modifier ici pour régler la fréquence de mise à jour (en ms)
      return () => clearInterval(intervalId); // Nettoyage de l'intervalle quand le composant est démonté ou le statut change
    }
  }, [status]);

  return (
    <div className="App">
      <h1>ReefBoxOS</h1>
      <p>Statut : {status}</p>
      {status === "granted" && rateHistory.length > 0 && (
        <RateChart rateHistory={rateHistory} />
      )}
    </div>
  );
};

export default App;
