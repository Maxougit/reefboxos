import express from "express";
import {
  getAppToken,
  checkAuthorizationStatus,
  getSessionToken,
  getInstantaneousRate,
  getListDevice,
} from "./freeboxApi.js";
import { getPingLatency } from "./ping.js";
import { listFavorites, addFavorite, removeFavorite } from "./userdata.js";
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

app.get("/ping/:ip", async (req, res) => {
  const { ip } = req.params;
  getPingLatency(ip)
    .then((latency) => {
      res.send(latency);
    })
    .catch((error) => {
      res.send("NAn");
    });
});

app.get("/favorite", async (req, res) => {
  try {
    const favorite = await listFavorites();
    res.send(favorite);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred");
  }
});

app.post("/favorite", async (req, res) => {
  try {
    const { favoriteId } = req.body;
    await addFavorite(favoriteId);
    res.send("Favorite added successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred");
  }
});

app.delete("/favorite/:favoriteId", async (req, res) => {
  try {
    const { favoriteId } = req.params;
    await removeFavorite(favoriteId);
    res.send("Favorite removed successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
