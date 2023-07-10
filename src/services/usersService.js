import {
    saveUser as saveUserRepository,
    getUsers as getUsersRepository,
    getByEmailUser as getByEmailUserRepository,
    updateOneUser as updateOneUserRepository,
} from "../repositories/usersRepository.js";
import emailService from "../emalService/emailService.js";

const saveUser = async (user) => {
    const result = await saveUserRepository(user);
    if (result){
        const ticket = {};
        const today = new Date();
        const fechaHora = today.toLocaleString();
        const messageEmail1=user.first_name.trim()+" Te has registrado en nuestra API";
        const messageEmail2=" Fecha: "+fechaHora;
        const subjectEmail="¡Nuevo usuario!";
        try {
            await emailService(ticket, user.email, messageEmail1, messageEmail2 , subjectEmail)
        } catch (error) {
            console.log(error.message);
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
    //if (!user) {
    //    throw new TypeError("incorrect credentials");
    //}
    return user;
};

const updateOneUser = async (email, user) => {
    const result = await updateOneUserRepository(email, user);
    return result;
};

export { saveUser, getUsers, getByEmailUser, updateOneUser };
