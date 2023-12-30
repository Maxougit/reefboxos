import { useEffect, useState } from "react";
import React from "react";
import { Grid } from "@mui/material";
import { getListDevice, getFavorite } from "../services/freeboxApi";
import DeviceCard from "./deviceCard";

const DeviceList = ({ status, refreshInterval = 10000 }) => {
  // refreshInterval est en millisecondes
  const [deviceList, setDeviceList] = useState([]);
  const [favourite, setFavourite] = useState([]); // Ajout de l'état pour les appareils favoris

  useEffect(() => {
    const fetchFavorite = async () => {
      try {
        const favorites = await getFavorite();
        setFavourite(favorites);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération de la liste des appareils favoris",
          error
        );
      }
    };

    fetchFavorite();
    const interval = setInterval(fetchFavorite, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  useEffect(() => {
    const fetchDeviceList = async () => {
      try {
        const sessionToken = localStorage.getItem("sessionToken");
        if (sessionToken && status === "granted") {
          const devices = await getListDevice(sessionToken);
          //   console.log(devices);
          const updatedDevices = devices
            .filter((device) => device.default_name)
            .map((device) => ({
              ...device,
              l3connectivities: getMostRecentAddress(device.l3connectivities),
            }))
            .sort((a, b) => {
              const isAFavorite = favourite.includes(a.id);
              const isBFavorite = favourite.includes(b.id);
              if (isAFavorite && !isBFavorite) {
                return -1; // a is favorite, b is not favorite
              } else if (!isAFavorite && isBFavorite) {
                return 1; // b is favorite, a is not favorite
              } else {
                return b.active - a.active; // both are favorite or both are not favorite, sort by active status
              }
            });
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
    const interval = setInterval(fetchDeviceList, refreshInterval);

    return () => clearInterval(interval);
  }, [status, refreshInterval, favourite]);

  function getMostRecentAddress(l3connectivities) {
    if (l3connectivities === undefined) return ["NA"];
    return l3connectivities[0].addr;
  }

  return (
    <Grid container spacing={2}>
      {deviceList.map((device, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <DeviceCard
            device={device}
            favourite={favourite}
            setfavourite={setFavourite}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default DeviceList;
