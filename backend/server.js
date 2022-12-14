import express from "express";
import path from "path";

import "./api_routes.js";
import { apis } from "./api_routes.js";

const app = express();

app.use("/api", apis);

app.use("/", express.static(path.resolve("frontend")));


app.listen(80,"10.44.4.106");

console.log("http://10.44.4.106");
