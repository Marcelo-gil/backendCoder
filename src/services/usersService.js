import config from "../config/config.js";
import {
    saveUser as saveUserRepository,
    getUsers as getUsersRepository,
    getByEmailUser as getByEmailUserRepository,
    updateOneUser as updateOneUserRepository,
    updateUserRole as updateUserRoleRepository,
} from "../repositories/usersRepository.js";
import emailService from "../emailService/emailService.js";
import { getLogger } from "../utils/logger.js";
import { generateToken } from "../utils.js";

const emailUrl = config.email_url;

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
    const hrefEmail = `href='${emailUrl}/resetPassword?token=${encodeURIComponent(
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

export {
    saveUser,
    getUsers,
    getByEmailUser,
    updateOneUser,
    updateUserRole,
    resetEmailUser,
};
