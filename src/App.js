import React, { useState, useEffect } from "react";
import {
  getAppToken,
  checkAuthorizationStatus,
  getSessionToken,
} from "./services/freeboxApi";
import BandwidthGraph from "./components/bandwidthGraph";
import DeviceList from "./components/deviceList";

const App = () => {
  const [status, setStatus] = useState("pending"); // 'pending', 'denied', 'granted'

  //authentification
  useEffect(() => {
    const initializeAuth = async () => {
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

          setStatus(statusResponse.status);
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

  return (
    <div className="App">
      <h1>ReefBoxOS</h1>

      {status === "granted" && <BandwidthGraph status={status} />}

      <DeviceList status={status} />
    </div>
  );
};

export default App;
