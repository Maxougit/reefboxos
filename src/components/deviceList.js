import { useEffect, useState } from "react";
import React from "react";
import { Grid, List, ListItem, ListItemText } from "@mui/material";
import { getListDevice } from "../services/freeboxApi";

const DeviceList = ({ status }) => {
  const [deviceList, setDeviceList] = useState([]); // Modifier pour stocker la liste des appareils
  useEffect(() => {
    // Récupération de la liste des appareils
    const fetchDeviceList = async () => {
      try {
        const sessionToken = localStorage.getItem("sessionToken");
        if (sessionToken && status === "granted") {
          const devices = await getListDevice(sessionToken);
          setDeviceList(devices); // Stocker les données des appareils dans l'état
        }
      } catch (error) {
        console.error(
          "Erreur lors de la récupération de la liste des appareils",
          error
        );
      }
    };

    fetchDeviceList();
  }, [status]);

  return (
    <Grid container spacing={2}>
      {deviceList.map((device, index) => (
        <Grid item xs={6} sm={4} md={2} key={index}>
          <List>
            <ListItem>
              <ListItemText
                primary={device.primary_name}
                secondary={device.active.toString()}
              />
            </ListItem>
          </List>
        </Grid>
      ))}
    </Grid>
  );
};

export default DeviceList;
