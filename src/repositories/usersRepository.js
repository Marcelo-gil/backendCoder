import { USERSDAO } from "../dao/index.js";

const saveUser = async (user) => {
    const result = await USERSDAO.save(user);
    return result;
};

const getUsers = async () => {
    const users = await USERSDAO.getAll();
    return users;
};

const getByEmailUser = async (email) => {
    const user = await USERSDAO.getByEmail(email);
    return user;
};

const updateOneUser = async (email, user) => {
    const result = await USERSDAO.updateOne(email, user);
    return result;
};
const updateUserRole = async (uid, roler) => {
    const result = await USERSDAO.updateUserRole(uid, roler);
    return result;
};
const updateUserDocument = async (uid, filename) => {
    const result = await USERSDAO.updateUserDocument(uid, filename);
    return result;
};
export {
    saveUser,
    getUsers,
    getByEmailUser,
    updateOneUser,
    updateUserRole,
    updateUserDocument,
};
