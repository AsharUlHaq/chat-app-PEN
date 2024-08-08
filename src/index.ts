import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { z } from "zod";
import { ENV } from "./utils/env.util";
//import { protect } from "./middleware/auth.middleware";

const app = express();

// app.use(express.json());
// app.use((req, res, next) => {
//     console.log("HTTP METHOD - " + req.method + " URL - " + req.url);
//     next();
// }
// )

app.get("/", (req, res) => {
  console.log("HTTP METHOD - " + req.method + " URL - " + req.url);
  //@ts-ignore
  console.log(req.userId);

  return res.json({ message: "Authorization Completed" });
});

app.use(cors());
app.use(bodyParser.json());

app.listen(ENV.PORT, () => {
  console.log(`Application running at http://localhost:${ENV.PORT}`);
});
