import "./util/load-env";
import express from "express";
import path from "node:path";
import { apiRouter } from "./api";

const app = express();

app.use("/api", apiRouter);

//app.use(express.static(process.env.FRONTEND_DIST_PATH!));
app.use(express.static("../client/src"));
app.use((req, res) => {
  //res.sendFile(path.join(__dirname, process.env.FRONTEND_DIST_PATH!, "index.html"));
  res.sendFile(path.join(__dirname, "../client/src/index.html"));
});

app.listen(process.env.NODE_PORT, () => {
  console.log(`App listening at http://localhost:${process.env.NODE_PORT}`);
});

