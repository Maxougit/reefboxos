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
import { getPing } from "../services/freeboxApi";

const DeviceCard = ({ device }) => {
  const [ping, setPing] = useState("NA");

  //   console.log(
  //     device.access_point === undefined
  //       ? device
  //       : device.access_point.connectivity_type
  //   );

  const handleFavoriteClick = () => {
    console.log("Favorite clicked", device);
  };
  const handlePowerClick = () => {
    console.log("Power clicked", device);
  };

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

  return (
    <Card>
      <CardContent>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h5">{device.primary_name}</Typography>
            <Typography variant="body2">
              IP: {device.l3connectivities} | Ping: {ping}
              {/* {device.access_type} */}
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
          <FavoriteIcon />
        </IconButton>
        <IconButton onClick={handlePowerClick}>
          <PowerSettingsNewIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default DeviceCard;
