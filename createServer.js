import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import routes from "./routes/index.js";
import { fileURLToPath } from "url";
import cors from "cors";
import http from "http";
import debugLib from "debug";
const debug = debugLib("kowloon-express:server");

import nocache from "nocache";

export default async function handler() {
  const app = express();
  app.use(cors());

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  app.use(logger("dev"));
  // app.use(bodyParser({ limit: "100mb" }));
  app.use(express.json({ limit: "100mb" }));

  app.use(
    express.urlencoded({
      extended: true,
      limit: 10000000,
    })
  );
  app.use(cookieParser());
  app.use(express.static("public"));
  app.use(routes);
  app.use(nocache());

  // app.use(nocache());
  app.set("json spaces", 2);

  var port = normalizePort(process.env.PORT || "3001");
  app.set("port", port);

  /**
   * Create HTTP server.
   */

  var server = http.createServer(app);

  /**
   * Listen on provided port, on all network interfaces.
   */

  server.listen(port);
  server.on("error", onError);
  server.on("listening", onListening);

  /**
   * Normalize a port into a number, string, or false.
   */

  function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
      // named pipe
      return val;
    }

    if (port >= 0) {
      // port number
      return port;
    }

    return false;
  }

  /**
   * Event listener for HTTP server "error" event.
   */

  function onError(error) {
    if (error.syscall !== "listen") {
      throw error;
    }

    var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case "EACCES":
        console.error(bind + " requires elevated privileges");
        process.exit(1);
        break;
      case "EADDRINUSE":
        console.error(bind + " is already in use");
        process.exit(1);
        break;
      default:
        throw error;
    }
  }

  /**
   * Event listener for HTTP server "listening" event.
   */

  function onListening() {
    var addr = server.address();
    var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
    debug("Listening on " + bind);
    console.log("Server is running....");
  }
}
