import app from "./index.js";
import mongoose from "mongoose";
import https from "https";
import path from "path";
import fs from "fs";
import apiService from "./service/apiService.js";

const db_user = process.env.db_user;
const db_password = encodeURIComponent(process.env.db_password);
const port = process.env.PORT || 3000;

var options = {
  key: fs.readFileSync("./src/cert/key.pem"),
  cert: fs.readFileSync("./src/cert/cert.pem"),
};

const sslServer = https.createServer(options, app);
// Connect to DB
mongoose
  .connect(
    `mongodb+srv://${db_user}:${db_password}@tanndatalake.f5somuo.mongodb.net/?retryWrites=true&w=majority&keepAlive=true&socketTimeoutMS=360000&connectTimeoutMS=360000`,
    { dbName: "DataLake" }
  )
  .then(() => {
    sslServer.listen(port, () => {
      console.log(
        `Connected to MongoDB! \nListening on: http://localhost:${port}`
      );
    });
    // apiService();
  })

  .catch((e) => console.log(e));
