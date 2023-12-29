import React from "react";
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

const BandwidthGraph = ({ rateHistory }) => {
  console.log(rateHistory);
  const data = rateHistory.slice(-500).map((rate) => ({
    time: new Date(rate.timestamp).toLocaleTimeString(),
    rateUp: rate.rate_up / 125000,
    rateDown: rate.rate_down / 125000,
  }));

  const averageRate =
    rateHistory.reduce((sum, rate) => sum + rate.rate_up + rate.rate_down, 0) /
    (rateHistory.length * 200000);

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
              Average bandwidth: {averageRate.toFixed(2)} Mbps
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
