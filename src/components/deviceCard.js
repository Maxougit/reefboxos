import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Grid,
  Chip,
  CardActions,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import WifiIcon from "@mui/icons-material/Wifi"; // Logo Wifi
import SettingsEthernetIcon from "@mui/icons-material/SettingsEthernet"; // Logo Ethernet
import {
  getPing,
  addFavorite,
  removeFavorite,
  wakeOnLan,
} from "../services/freeboxApi";

const DeviceCard = ({ device, favourite, setfavourite }) => {
  const [ping, setPing] = useState("NA");
  const [connectivityType, setConnectivityType] = useState("NA");

  const handleFavoriteClick = () => {
    //peut être utiliser tanstackquerie et invalidate query
    if (favourite.includes(device.id)) {
      removeFavorite(device.id);
      setfavourite(favourite.filter((id) => id !== device.id));
    } else {
      addFavorite(device.id);
      setfavourite([...favourite, device.id]);
    }
  };

  useEffect(() => {
    if (device.access_point === undefined) {
      setConnectivityType("NA");
    } else {
      // Ici, nous remplaçons le texte par des icônes
      const type = device.access_point.connectivity_type;
      if (type === "wifi") {
        setConnectivityType(<WifiIcon />);
      } else if (type === "ethernet") {
        setConnectivityType(<SettingsEthernetIcon />);
      } else {
        setConnectivityType("NA");
      }
    }
  }, [device]);

  useEffect(
    () => async () => {
      try {
        if (device.active) setPing(await getPing(device.l3connectivities));
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des données de ping",
          error
        );
      }
    },
    [device]
  );

  const handlePowerClick = async () => {
    console.log("Power clicked", device.access_point.mac);
    const result = await wakeOnLan(
      device.access_point.mac,
      localStorage.getItem("sessionToken")
    );
    console.log(result);
  };

  return (
    <Card>
      <CardContent>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h5">{device.primary_name}</Typography>
            <Typography variant="body2">
              IP: {device.l3connectivities} | Ping: {ping}
            </Typography>
          </Grid>
          <Grid item>
            <Chip
              label={device.active ? "Online" : "Offline"}
              color={device.active ? "success" : "error"}
            />
          </Grid>
        </Grid>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton onClick={handleFavoriteClick}>
          <FavoriteIcon
            style={{ color: favourite.includes(device.id) ? "red" : "inherit" }}
          />
        </IconButton>
        <IconButton onClick={handlePowerClick}>
          <PowerSettingsNewIcon />
        </IconButton>
        <IconButton>{connectivityType}</IconButton>
      </CardActions>
    </Card>
  );
};

export default DeviceCard;
