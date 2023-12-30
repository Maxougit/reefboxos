import express from "express";
import {
  getAppToken,
  checkAuthorizationStatus,
  getSessionToken,
  getInstantaneousRate,
  getListDevice,
} from "./freeboxApi.js";
import cors from "cors";

const app = express();

const corsOptions = {
  origin: "*",
  allowedHeaders: ["Content-Type", "X-Fbx-App-Auth"],
};

app.use(cors(corsOptions));

const port = 3001;

// Middleware to parse JSON request bodies
app.use(express.json());

// Define API endpoints
app.post("/appToken", getAppToken);

app.get("/authorizationStatus/:track_id", async (req, res) => {
  const { track_id } = req.params;
  const authorizationStatus = await checkAuthorizationStatus(track_id);
  res.send(authorizationStatus);
});

app.post("/sessionToken", async (req, res) => {
  const { appToken, challenge } = req.body;
  const sessionToken = await getSessionToken(appToken, challenge);
  res.send(sessionToken);
});

app.get("/instantaneousRate", async (req, res) => {
  const sessionToken = req.header("X-Fbx-App-Auth");
  const instantaneousRate = await getInstantaneousRate(sessionToken);
  res.send(instantaneousRate);
});

app.get("/listDevice", async (req, res) => {
  const sessionToken = req.header("X-Fbx-App-Auth");
  const listDevice = await getListDevice(sessionToken);
  res.send(listDevice);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
