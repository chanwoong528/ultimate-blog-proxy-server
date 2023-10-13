//@ts-nocheck
process.env.NODE_ENV === "dev"
  ? require("dotenv").config({ path: "./env/dev.env" })
  : require("dotenv").config({ path: "./env/prod.env" });

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

const apiProxy = createProxyMiddleware({
  // target: 'https://ulltimate-moonblog-node-production.up.railway.app',
  // target: 'http://localhost:5002',
  target: process.env.API_URL,
  changeOrigin: true,
});
app.use("/", apiProxy);


app.listen(PORT, (err) => {
  if (err) {
    console.log(`Unable to run Server on ${PORT}=> ${err}`);
  } else {
    console.log(`Server Up: ${PORT}`);
  }
});
