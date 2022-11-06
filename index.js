import express from "express";
import mongoose from "mongoose";
import parser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";

import bookRouter from "./routes/book-router.js";
dotenv.config();
const env = process.env.NODE_ENV || "development";

const app = express();
const corsOptions = {
  origin: "*",
  methods: "GET, HEAD, PUT, PATCH, POST, DELETE",
};
app.use(cors(corsOptions));
app.use(morgan("combined"));
const port = process.env.PORT || 8080;

// Set up database
const mongoDbUri =
  env === "production"
    ? process.env.MONGODB_URI_PROD
    : process.env.MONGODB_URI_DEV;

mongoose.connect(
  mongoDbUri,
  () => console.log("Connected to Database"),
  (err) => console.log(err)
);

app.use("/api/books", parser.json(), bookRouter);
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

export default app;
