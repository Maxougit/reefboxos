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
import sweetAlert from "./sweetAlert";

const DeviceCard = ({ device, favourite, setfavourite }) => {
  const [ping, setPing] = useState("NAn");
  const [connectivityType, setConnectivityType] = useState("NAn");

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
        if (device.active && connectivityType !== "NA")
          setPing(await getPing(device.l3connectivities));
        else setPing("NAn");
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des données de ping",
          error
        );
      }
    },
    [device, connectivityType]
  );

  const handlePowerClick = async () => {
    console.log("Power clicked", device.l2ident.id);
    const result = await wakeOnLan(
      device.l2ident.id,
      localStorage.getItem("sessionToken")
    );
    if (result === "insufficient_rights") {
      sweetAlert("insufficient_rights");
    }
  };

  const handleTypeClick = () => {
    console.log(device);
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
              label={
                device.active && !device.reachable
                  ? "Offline"
                  : device.active
                  ? "Online"
                  : "Offline"
              }
              color={device.active && device.reachable ? "success" : "error"}
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
        <IconButton onClick={handleTypeClick}>{connectivityType}</IconButton>
      </CardActions>
    </Card>
  );
};

export default DeviceCard;
