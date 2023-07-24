import mongoose from "mongoose";
import config from "../../config/config.js";
import { getLogger } from "../../utils/logger.js";
import process from "node:process";

const URI = config.mongoUrl;

try {
    await mongoose.connect(URI);
    getLogger().info("DB CONNECTED");
} catch (error) {
    getLogger().fatal("[dao/dbManager/dbconfig.js] " + error.message);
    process.exit();
}
