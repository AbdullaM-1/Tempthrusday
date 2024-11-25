require("dotenv").config();
const fs = require("fs");
const express = require("express");
const connectToDatabase = require("./api/config/db");
const {
  notFound,
  errorHandler,
} = require("./api/middlewares/error.middleware");
const winston = require("winston");
const expressWinston = require("express-winston");
const cors = require("cors");

connectToDatabase();

const app = express();
const port = process.env.PORT || 5000;

const loggerOptions = {
  transports: [new winston.transports.Console()],
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} - ${level}: ${message}`;
    }),
    winston.format.colorize({ all: true })
  ),
};

if (process.env.DEBUG !== "true") {
  loggerOptions.meta = false; // when not debugging, log requests as one-liners
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(expressWinston.logger(loggerOptions));
app.use("/api/public", express.static("public"));

const indexRoutes = require("./api/routes/index.route");
const { startPolling } = require("./api/services/gmail.service");
app.use("/api", indexRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  // Create empty directories. e.g. logs
  const dirs = ["logs", "public"];
  dirs.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
  });
  startPolling(false);
  console.log(`Server is running on port ${port}`);
});
