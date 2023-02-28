import app from "./index.js";
import mongoose from "mongoose";

const db_user = process.env.db_user;
const db_password = encodeURIComponent(process.env.db_password);
const port = process.env.PORT || 3000;


// Connect to DB
mongoose
  .connect(
    `mongodb+srv://${db_user}:${db_password}@tanndatalake.f5somuo.mongodb.net/?retryWrites=true&w=majority&keepAlive=true&socketTimeoutMS=360000&connectTimeoutMS=360000`,
    { dbName: "DataLake" }
  )
  .then(() => {
    app.listen(port, () => {
      console.log(
        `Connected to MongoDB! \nListening on: https://localhost:${port}`
      );
    });
    // apiService();
  })

  .catch((e) => console.log(e));
