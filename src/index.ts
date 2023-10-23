//@ts-nocheck
process.env.NODE_ENV === "dev"
  ? require("dotenv").config({ path: "./env/dev.env" })
  : require("dotenv").config({ path: "./env/prod.env" });

import { isLoggedIn } from "./middleware/AuthMiddleware";

const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 6002;

app.use(
  cors({
    origin: ["http://localhost:3001", process.env.CLIENT_URL],
    credentials: true,
    methods: ["HEAD", "POST", "PUT", "GET", "PATCH", "DELETE"],
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());

function onProxReq(proxyReq, req, res) {
  const bodyData = JSON.stringify(req.body);
  proxyReq.setHeader("Content-Type", "application/json");
  proxyReq.setHeader("Content-Length", Buffer.byteLength(bodyData));
  proxyReq.write(bodyData);
}

const apiProxy = createProxyMiddleware({
  target: process.env.API_URL,
  changeOrigin: true,
  logLevel: "debug",
  pathRewrite: {
    "^/api": "/", // remove base path
  },
  onProxyReq: onProxReq,
});

const privateApiProxy = createProxyMiddleware({
  target: process.env.API_URL,
  changeOrigin: true,
  logLevel: "debug",
  pathRewrite: {
    "^/certi": "/auth-api", // remove base path
  },
  onProxyReq: onProxReq,
});

app.use("/api", apiProxy);
app.use("/certi", isLoggedIn, privateApiProxy);
const wsProxy = createProxyMiddleware("ws://localhost:7002", {
  changeOrigin: true,
});

const server = app.listen(PORT, (err) => {
  if (err) {
    console.log(`Unable to run Server on ${PORT}=> ${err}`);
  } else {
    console.log(`Server Up: ${PORT}`);
  }
});
server.on("upgrade", wsProxy.upgrade);
