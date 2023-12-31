// components/StatusPage.js
import React, { useState, useEffect } from "react";
import {
  checkAuthorizationStatus,
  initializeAuth,
} from "../services/freeboxApi";

const StatusPage = () => {
  const [status, setStatus] = useState("initial");

  const fetchData = async () => {
    if (!localStorage.getItem("trackId")) {
      return { status: "Not connected" };
    }
    const updateStatus = await checkAuthorizationStatus(
      localStorage.getItem("trackId")
    );
    return updateStatus;
  };

  useEffect(() => {
    fetchData().then((updateStatus) => {
      setStatus(updateStatus.status);
    });
  }, []);

  const handleRefreshState = () => {
    setStatus("Refreshing...");
    fetchData().then((updateStatus) => {
      setStatus(updateStatus.status);
    });
  };

  const handleLogin = () => {
    const updateStatus = (newStatus) => setStatus(newStatus);
    initializeAuth(updateStatus);
  };

  return (
    <div>
      <h1>État de la connexion à la Reefbox</h1>
      <p>Statut de la connexion : {status}</p>
      <button onClick={handleRefreshState}>Refresh</button>
      {status === "granted" && (
        <>
          <p>Session : {localStorage.getItem("sessionToken")}</p>
          <p>Numéro session : {localStorage.getItem("trackId")}</p>
        </>
      )}

      {status === "Not connected" && (
        <button onClick={handleLogin}>Ce connecter</button>
      )}
    </div>
  );
};

export default StatusPage;
