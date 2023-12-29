import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { ResponsiveContainer } from "recharts";
import { getInstantaneousRate } from "../services/freeboxApi";

const BandwidthGraph = ({ status }) => {
  const [rateHistory, setRateHistory] = useState([]); // Modifier pour stocker l'historique des débits

  useEffect(() => {
    const fetchRate = async () => {
      try {
        const sessionToken = localStorage.getItem("sessionToken");
        const rateData = await getInstantaneousRate(sessionToken);
        // console.log("Données de débit : ", rateData);
        setRateHistory((prevHistory) => [
          ...prevHistory,
          { timestamp: new Date(), ...rateData },
        ]);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des données de débit",
          error
        );
      }
    };

    if (status === "granted") {
      fetchRate(); // Récupérer immédiatement les données de débit
      const intervalId = setInterval(fetchRate, 1000); // Modifier ici pour régler la fréquence de mise à jour (en ms)
      return () => clearInterval(intervalId); // Nettoyage de l'intervalle quand le composant est démonté ou le statut change
    }
  }, [status]);

  const data = rateHistory.slice(-500).map((rate) => ({
    time: new Date(rate.timestamp).toLocaleTimeString(),
    rateUp: rate.rate_up / 125000,
    rateDown: rate.rate_down / 125000,
  }));

  const averageRateUp =
    rateHistory.slice(-5).reduce((sum, rate) => sum + rate.rate_up, 0) /
    (5 * 125000);

  const averageRateDown =
    rateHistory.slice(-5).reduce((sum, rate) => sum + rate.rate_down, 0) /
    (5 * 125000);

  const maxRateUp =
    Math.max(...rateHistory.map((rate) => rate.rate_up)) / 125000;

  const maxRateDown =
    Math.max(...rateHistory.map((rate) => rate.rate_down)) / 125000;

  return (
    <Box
      display="flex"
      flexDirection={{ xs: "column", sm: "row" }}
      width="100%"
    >
      <Box flex={{ xs: "100%", sm: "70%" }}>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="6 6" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="rateUp" stroke="#8884d8" />
            <Line type="monotone" dataKey="rateDown" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </Box>
      <Box flex={{ xs: "100%", sm: "30%" }}>
        <Typography variant="body1" component="div">
          <Box sx={{ bgcolor: "#f5f5f5", p: 2, borderRadius: 4 }}>
            <Typography variant="body2">
              Actual bandwidth, donw: {averageRateDown.toFixed(2)} Mbps
            </Typography>
            <Typography variant="body2">
              Actual bandwidth, up: {averageRateUp.toFixed(2)} Mbps
            </Typography>
          </Box>
        </Typography>
        <Typography variant="body1" component="div" mt={2}>
          <Box sx={{ bgcolor: "#f5f5f5", p: 2, borderRadius: 4 }}>
            <Typography variant="body2">
              Max download: {maxRateDown.toFixed(2)} Mbps
            </Typography>
            <Typography variant="body2">
              Max upload : {maxRateUp.toFixed(2)} Mbps
            </Typography>
          </Box>
        </Typography>
      </Box>
    </Box>
  );
};

export default BandwidthGraph;
