import { existsSync, mkdirSync, appendFile } from "fs";
import { join } from "path";

// Ensure logs directory exists
const logsDir = join(__dirname, "../../logs");
if (!existsSync(logsDir)) {
  mkdirSync(logsDir, { recursive: true });
}

class Logger {
  static log(level, message, meta = {}) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      ...meta,
    };

    // Console log
    console.log(`[${timestamp}] ${level.toUpperCase()}: ${message}`, meta);

    // File log (only in production)
    if (process.env.NODE_ENV === "production") {
      this.writeToFile(level, logEntry);
    }
  }

  static writeToFile(level, logEntry) {
    const date = new Date().toISOString().split("T")[0];
    const filename = `${date}-${level}.log`;
    const filepath = join(logsDir, filename);

    const logLine = JSON.stringify(logEntry) + "\n";

    appendFile(filepath, logLine, (err) => {
      if (err) {
        console.error("Failed to write to log file:", err);
      }
    });
  }

  static info(message, meta) {
    this.log("info", message, meta);
  }

  static warn(message, meta) {
    this.log("warn", message, meta);
  }

  static error(message, meta) {
    this.log("error", message, meta);
  }

  static debug(message, meta) {
    if (process.env.NODE_ENV === "development") {
      this.log("debug", message, meta);
    }
  }
}

export default Logger;
