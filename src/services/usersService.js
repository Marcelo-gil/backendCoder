import config from "../config/config.js";
import moment from "moment";
import {
    saveUser as saveUserRepository,
    getUsers as getUsersRepository,
    getByEmailUser as getByEmailUserRepository,
    getByIdUser as getByIdUserRepository,
    updateOneUser as updateOneUserRepository,
    updateUserRole as updateUserRoleRepository,
    updateUserDocument as updateUserDocumentRepository,
    deleteUser as deleteUserRepository,
} from "../repositories/usersRepository.js";

import emailService from "../emailService/emailService.js";
import { getLogger } from "../utils/logger.js";
import { generateToken } from "../utils.js";

const httpUrl = config.http_url;
const inactivityTime = config.inactivity_time;

const resetEmailUser = async (email) => {
    const user = await getByEmailUserRepository(email);
    if (!user) throw new Error("Email not found");
    const accessToken = generateToken({ email }, "1h");
    const today = new Date();
    const fechaHora = today.toLocaleString();
    const messageEmail1 =
        user.first_name.trim() +
        " Has pedido el reseteo de tu contraseña en nuestra API";
    const messageEmail2 = " Fecha: " + fechaHora;
    const subjectEmail = "¡Reseteo de Contraseña!";
    const hrefEmail = `href='${httpUrl}/resetPassword?token=${encodeURIComponent(
        accessToken
    )}'>Haz click aqui para crear una nueva contraseña`;
    await emailService(
        email,
        messageEmail1,
        messageEmail2,
        subjectEmail,
        hrefEmail
    );
};
const saveUser = async (user) => {
    const result = await saveUserRepository(user);
    if (result) {
        const today = new Date();
        const fechaHora = today.toLocaleString();
        const messageEmail1 =
            user.first_name.trim() + " Te has registrado en nuestra API";
        const messageEmail2 = " Fecha: " + fechaHora;
        const subjectEmail = "¡Nuevo usuario!";
        try {
            await emailService(
                user.email,
                messageEmail1,
                messageEmail2,
                subjectEmail
            );
        } catch (error) {
            getLogger().error(
                "[services/usersService.js] /saveUser " + error.message
            );
        }
    }
    return result;
};

const getUsers = async () => {
    const users = await getUsersRepository();
    return users;
};

const deleteUser = async (uid) => {
    const user = await getByIdUserRepository(uid);
    if (!user) {
        throw new Error("Not found");
    }
    const result = await deleteUserRepository(uid);
    const today = new Date();
    const fechaHora = today.toLocaleString();
    const messageEmail1 =
        user.first_name.trim() + "Tu Usuario fue dado de baja de nuestra API";
    const messageEmail2 = " Fecha: " + fechaHora;
    const subjectEmail = "¡Usuario Eliminado!";
    await emailService(user.email, messageEmail1, messageEmail2, subjectEmail);
    return result;
};
const deleteUsers = async () => {
    const users = await getUsersRepository();
    const formatTime = inactivityTime.substring(0, 1);
    let unitedTime = "days";
    if (formatTime === "h") {
        unitedTime = "hours";
    } else if (formatTime === "m") {
        unitedTime = "minutes";
    } else if (formatTime === "s") {
        unitedTime = "seconds";
    }
    const timeInactivity = inactivityTime.substring(1, inactivityTime.length);
    const hoy = moment();
    const usersInact = users.filter(
        (user) =>
            hoy.diff(moment(user.last_connection), unitedTime) > timeInactivity
    );
    for (const user of usersInact) {
        const result = await deleteUserRepository(user._id);
        if (result) {
            const today = new Date();
            const fechaHora = today.toLocaleString();
            const messageEmail1 =
                user.first_name.trim() +
                "Tu Usuario fue dado de baja por Inactividad de nuestra API";
            const messageEmail2 = " Fecha: " + fechaHora;
            const subjectEmail = "¡Usuario Eliminado!";
            await emailService(
                user.email,
                messageEmail1,
                messageEmail2,
                subjectEmail
            );
        }
    }
    return usersInact;
};

const getByEmailUser = async (email) => {
    const user = await getByEmailUserRepository(email);
    return user;
};

const updateOneUser = async (email, user) => {
    const result = await updateOneUserRepository(email, user);
    return result;
};

const updateUserRole = async (uid, role) => {
    const result = await updateUserRoleRepository(uid, role);
    return result;
};

const updateUserDocument = async (uid, filename) => {
    const result = await updateUserDocumentRepository(uid, filename);
    return result;
};

export {
    saveUser,
    getUsers,
    getByEmailUser,
    updateOneUser,
    updateUserRole,
    resetEmailUser,
    updateUserDocument,
    deleteUsers,
    deleteUser,
};
