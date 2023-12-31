// App.js
import React, { useState, useEffect } from "react";
import { initializeAuth } from "./services/freeboxApi";
import ModalButton from "./components/modalButton";
import BandwidthGraph from "./components/BandwidthGraph"; // Importer votre composant BandwidthGraph
import DeviceList from "./components/deviceList";
import { LuActivitySquare, LuComputer } from "react-icons/lu";
import "./App.css";

const App = () => {
  const [status, setStatus] = useState("pending");

  useEffect(() => {
    const updateStatus = (newStatus) => setStatus(newStatus);
    initializeAuth(updateStatus);
  }, []);

  return (
    <div className="App">
      <h1>ReefBox OS</h1>
      <div className="dashboard">
        {status === "granted" && (
          <>
            <ModalButton
              component={<BandwidthGraph status={status} />}
              name={"Bandwidth"}
              icon={<LuActivitySquare />}
            />
            <ModalButton
              component={<DeviceList status={status} />}
              name={"Device list"}
              icon={<LuComputer />}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default App;
