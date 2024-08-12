import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { z } from "zod";
import { ENV } from "./utils/env.util";
import { protect } from "./middlewares/auth.middleware";
import { authRoutes } from "./modules/auth/auth.route";
import { userRoutes } from "./modules/user/user.route";
import http from "http"
import { setupWebSocketServer } from "./modules/websocket/websocket.server";
import { Server } from "http";
// import { chatRoutes } from "./modules/chat/chat.route";

const app = express();
app.use(express.json());
const server = http.createServer(app);

// Setup WebSocket server
setupWebSocketServer(server);
app.get("/", (req, res) => {
  res.send("WebSocket server is up and running!");
});

app.get("/",protect, (req, res) => {
  console.log("HTTP METHOD - " + req.method + " URL - " + req.url);
  //@ts-ignore
  console.log(req.userId);

  return res.json({ message: "Authorization Completed" });
});

app.use(cors());
app.use(bodyParser.json());
app.use("/",authRoutes)
app.use("/",userRoutes)
// app.use("/",chatRoutes)

server.listen(ENV.PORT, () => {
  console.log(`Application running at http://localhost:${ENV.PORT}`);
});
