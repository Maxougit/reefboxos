// App.js
import React, { useState, useEffect } from "react";
import { initializeAuth } from "./services/freeboxApi";
import ModalButton from "./components/modalButton";
import BandwidthGraph from "./components/bandwidthGraph";
import DeviceList from "./components/deviceList";
import StatusPage from "./components/statusPage";
import {
  LuActivitySquare,
  LuComputer,
  LuAlignEndHorizontal,
} from "react-icons/lu";
import "./App.css";

const App = () => {
  const [status, setStatus] = useState("pending");

  useEffect(() => {
    const updateStatus = (newStatus) => setStatus(newStatus);
    initializeAuth(updateStatus);
  }, []);

  return (
    <div className="App">
      {/* <h1>ReefBox OS</h1> */}
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
        <ModalButton
          component={<StatusPage status={status} />}
          name={"Log data"}
          icon={<LuAlignEndHorizontal />}
        />
      </div>
    </div>
  );
};

export default App;
