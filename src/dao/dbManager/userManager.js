import config from "../../config/config.js";
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

    updateUserRole = async (uid, role) => {
        const user = await userModel.findOne({ _id: uid }).lean();
        if (!user) throw new Error("User not found");
        if (role === "PREMIUM") {
            const documents = user.documents ? user.documents : [];
            let indice = 0;
            for (let i = 0; i < documents.length - 1; i++) {
                if (documents[i] === "identification") {
                    indice++;
                }
                if (documents[i] === "account_state") {
                    indice++;
                }
                if (documents[i] === "address") {
                    indice++;
                }
            }
            if (indice < 3)
                throw new Error(
                    "El usuario no ha terminado de procesar su documentación"
                );
        }

        user.role = role;
        const result = await userModel.updateOne({ _id: uid }, user);
        return result;
    };

    updateUserDocument = async (uid, filename) => {
        const httplUrl = config.http_url;

        const user = await userModel.findOne({ _id: uid }).lean();
        if (!user) throw new Error("User not found");
        const documents = user.documents ? user.documents : [];

        if (filename.profile) {
            user.profile = `${httplUrl}/src/public/img/profiles/${filename.profile[0].filename}`;
        }
        if (filename.identification) {
            let indice = -1;
            for (let i = 0; i < documents.length - 1; i++) {
                if (documents[i] === "identification") {
                    indice = i;
                    break;
                }
            }
            const pathfilename = `${httplUrl}/src/public/img/documents/${filename.identification[0].filename}`;
            if (indice != -1) {
                documents[indice] = { identification: pathfilename };
            } else {
                documents.push({ identification: pathfilename });
            }
        }
        if (filename.account_state) {
            let indice = -1;
            for (let i = 0; i < documents.length - 1; i++) {
                if (documents[i] === "account_state") {
                    indice = i;
                    break;
                }
            }
            const pathfilename = `${httplUrl}/src/public/img/documents/${filename.account_state[0].filename}`;
            if (indice != -1) {
                documents[indice] = { account_state: pathfilename };
            } else {
                documents.push({ account_state: pathfilename });
            }
        }
        if (filename.address) {
            let indice = -1;
            for (let i = -1; i < documents.length - 1; i++) {
                if (documents[i] === "address") {
                    indice = i;
                    break;
                }
            }
            const pathfilename = `${httplUrl}/src/public/img/documents/${filename.address[0].filename}`;
            if (indice != -1) {
                documents[indice] = { address: pathfilename };
            } else {
                documents.push({ address: pathfilename });
            }
        }
        user.documents = documents;
        const result = await userModel.updateOne({ _id: uid }, user);
        return result;
    };
}
