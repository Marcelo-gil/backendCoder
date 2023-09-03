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

    deleteUser = async (id)=> {
        const user = await userModel.deleteOne({_id: id})
        return user;
    }

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
            for (let i = 0; i < documents.length; i++) {
                if (documents[i].name === "identification") {
                    indice++;
                }
                if (documents[i].name === "account_state") {
                    indice++;
                }
                if (documents[i].name === "address") {
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

    updateUserDocument = async (uid, files) => {
        const httplUrl = config.http_url;

        const user = await userModel.findOne({ _id: uid }).lean();
        if (!user) throw new Error("User not found");
        const documents = user.documents ? user.documents : [];

        if (files.profile) {
            user.profile = `${httplUrl}/src/public/img/profiles/${files.profile[0].filename}`;
        }
        if (files.identification) {
            let indice = -1;
            for (let i = 0; i < documents.length; i++) {
                if (documents[i].name === "identification") {
                    indice = i;
                    break;
                }
            }
            const pathfilename = `${httplUrl}/src/public/img/documents/${files.identification[0].filename}`;
            if (indice != -1) {
                documents[indice].name = "identification";
                documents[indice].reference = pathfilename;
            } else {
                documents.push({
                    name: "identification",
                    reference: pathfilename,
                });
            }
        }
        if (files.account_state) {
            let indice = -1;
            for (let i = 0; i < documents.length; i++) {
                if (documents[i].name === "account_state") {
                    indice = i;
                    break;
                }
            }
            const pathfilename = `${httplUrl}/src/public/img/documents/${files.account_state[0].filename}`;
            if (indice != -1) {
                documents[indice] = {
                    name: "account_state",
                    reference: pathfilename,
                };
            } else {
                documents.push({
                    name: "account_state",
                    reference: pathfilename,
                });
            }
        }
        if (files.address) {
            let indice = -1;
            for (let i = 0; i < documents.length; i++) {
                if (documents[i].name === "address") {
                    indice = i;
                    break;
                }
            }
            const pathfilename = `${httplUrl}/src/public/img/documents/${files.address[0].filename}`;
            if (indice != -1) {
                documents[indice] = {
                    name: "address",
                    reference: pathfilename,
                };
            } else {
                documents.push({
                    name: "address",
                    reference: pathfilename,
                });
            }
        }
        user.documents = documents;
        const result = await userModel.updateOne({ _id: uid }, user);
        return result;
    };
}
