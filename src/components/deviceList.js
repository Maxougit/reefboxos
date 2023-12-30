import { useEffect, useState } from "react";
import React from "react";
import { Grid } from "@mui/material";
import { getListDevice } from "../services/freeboxApi";
import DeviceCard from "./deviceCard";

const DeviceList = ({ status, refreshInterval = 10000 }) => {
  // refreshInterval est en millisecondes
  const [deviceList, setDeviceList] = useState([]);

  useEffect(() => {
    const fetchDeviceList = async () => {
      try {
        const sessionToken = localStorage.getItem("sessionToken");
        if (sessionToken && status === "granted") {
          const devices = await getListDevice(sessionToken);
          //   console.log(devices);
          // Mettre à jour la liste des appareils avec la dernière adresse de l3connectivities
          const updatedDevices = devices
            .filter((device) => device.default_name)
            .map((device) => ({
              ...device,
              l3connectivities: getMostRecentAddress(device.l3connectivities),
            }))
            .sort((a, b) => b.active - a.active);
          setDeviceList(updatedDevices);
        }
      } catch (error) {
        console.error(
          "Erreur lors de la récupération de la liste des appareils",
          error
        );
      }
    };

    fetchDeviceList();
    // Définir un intervalle pour actualiser la liste des appareils
    const interval = setInterval(fetchDeviceList, refreshInterval);

    return () => clearInterval(interval);
  }, [status, refreshInterval]);

  function getMostRecentAddress(l3connectivities) {
    if (l3connectivities === undefined) return ["NA"];
    return l3connectivities[0].addr;
  }

  return (
    <Grid container spacing={2}>
      {deviceList.map((device, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <DeviceCard device={device} />
        </Grid>
      ))}
    </Grid>
  );
};

export default DeviceList;
