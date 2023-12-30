import React, { useState, useEffect } from "react";
import { initializeAuth } from "./services/freeboxApi"; // Ajustez le chemin si nécessaire
import BandwidthGraph from "./components/bandwidthGraph";
import DeviceList from "./components/deviceList";

const App = () => {
  const [status, setStatus] = useState("pending"); // 'pending', 'denied', 'granted'

  // Authentification
  useEffect(() => {
    const updateStatus = (newStatus) => setStatus(newStatus);
    initializeAuth(updateStatus);
  }, []);

  return (
    <div className="App">
      <h1>ReefBox OS</h1>

      {status === "granted" && <BandwidthGraph status={status} />}
      {status === "granted" && <DeviceList status={status} />}
    </div>
  );
};

export default App;
