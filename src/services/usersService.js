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

        const userCopy = { ...user };
        delete userCopy.password;
        const ticket = {};
        const today = new Date();
        const fechaHora = today.toLocaleString();
        const messageEmail1="Te has registrado en nuestra API: "+user.id;
        const messageEmail2=" Fecha: "+fechaHora;
        const subjectEmail="¡Nuevo usuario!";
        const resultEmail =  async () => emailService(ticket, userCopy, messageEmail1, messageEmail2 , subjectEmail)
        console.log(resultEmail);
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

const updateOneUser = async () => {
    const result = await updateOneUserRepository(email, user);
    return result;
};

export { saveUser, getUsers, getByEmailUser, updateOneUser };
