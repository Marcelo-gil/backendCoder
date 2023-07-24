import { messageModel } from "../models/messageModel.js";
import { getLogger } from "../../utils/logger.js";

export default class MessageManager {
    constructor() {
        getLogger().info("Working Messages with DB");
    }

    getMessages = async () => {
        const messages = await messageModel.find().lean();
        return messages;
    };

    /**
     * Agrega un Mensaje
     * @param {*} message Objeto del mensaje
     * @returns
     */
    addMessages = async (message) => {
        const result = await messageModel.create(message);
        return result;
    };
}
