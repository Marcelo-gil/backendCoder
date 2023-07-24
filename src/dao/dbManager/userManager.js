import userModel from "../models/userModel.js";
import { getLogger } from "../../utils/logger.js";

export default class Users {
    constructor() {
        getLogger().info("Working users with DB");
    }

    getAll = async () => {
        const users = await userModel.find();
        return users.map((user) => user.toObject());
    };

    getByEmail = async (email) => {
        const user = await userModel.findOne({ email }).lean();
        return user;
    };

    save = async (user) => {
        const result = await userModel.create(user);
        return result;
    };

    updateOne = async (email, user) => {
        const result = await userModel.updateOne({ email }, user);
        return result;
    };
}
