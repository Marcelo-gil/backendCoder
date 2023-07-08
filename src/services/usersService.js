import {
    saveUser as saveUserRepository,
    getUsers as getUsersRepository,
    getByEmailUser as getByEmailUserRepository,
    updateOneUser as updateOneUserRepository,
} from "../repositories/usersRepository.js";

const saveUser = async (user) => {
    const result = await saveUserRepository(user);
    return result;
};

const getUsers = async () => {
    const users = await getUsersRepository();
    return users;
};

const getByEmailUser = async (email) => {
    const user = await getByEmailUserRepository(email);
    if (!user) {
        throw new TypeError("incorrect credentials");
    }
    return user;
};

const updateOneUser = async () => {
    const result = await updateOneUserRepository(email, user);
    return result;
};

export { saveUser, getUsers, getByEmailUser, updateOneUser };
