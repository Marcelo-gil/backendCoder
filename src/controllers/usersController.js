import {
    saveUser as saveUserService,
    getUsers as getUsersService,
    getByEmailUser as getByEmailUserService,
    updateOneUser as updateOneUserService,
    updateUserRole as updateUserRoleService,
    resetEmailUser as resetEmailUserService,
    updateUserDocument as updateUserDocumentService,
} from "../services/usersService.js";
import { getLogger } from "../utils/logger.js";

import {
    isValidPassword,
    generateToken,
    createHash,
    verifyToken,
} from "../utils.js";

import variablesAmbiente from "../config/config.js";
import { ROLES } from "../config/constants.js";

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    let user = {};
    try {
        if (
            email === variablesAmbiente.adminEmail &&
            password === variablesAmbiente.adminPassword
        ) {
            user = {
                first_name: "Coder",
                last_name: "House",
                email: variablesAmbiente.adminEmail,
                age: 18,
                role: "ADMIN",
            };
        } else {
            user = await getByEmailUserService(email);

            const comparePassword = isValidPassword(user, password);
            if (!comparePassword) {
                return res.sendClientError("incorrect credentials");
            }
            user.last_connection = new Date().toISOString();
            await updateOneUserService(email, user);
        }
        const accessToken = generateToken(user);

        res.cookie("coderCookieToken", accessToken, {
            maxAge: 60 * 60 * 1000,
            httpOnly: true,
        }).send({ status: "success" });
    } catch (error) {
        getLogger().info(
            "[controllers/usersController.js] /loginUser " + error.message
        );
        res.status(400).send({
            status: "error",
            error: "Ocurrio un error: " + error.message,
        });
    }
};

const registerUser = async (req, res) => {
    try {
        const { first_name, last_name, email, password } = req.body;
        const role = ROLES.USER;
        if (!first_name || !last_name || !role || !email || !password)
            return res.sendClientError("incomplete values");

        const exists = await getByEmailUserService(email);

        if (exists) return res.sendClientError("user already exists");

        const hashedPassword = createHash(password);

        const newUser = {
            ...req.body,
        };

        newUser.password = hashedPassword;

        const result = await saveUserService(newUser);

        res.sendSuccess(result);
    } catch (error) {
        getLogger().info(
            "[controllers/usersController.js] /registerUser " + error.message
        );
        res.sendServerError(error.message);
    }
};

const failLoginUser = async (req, res) => {
    res.send({ status: "error", message: "Login failed" });
};

const githubUser = async (req, res) => {
    res.send({ status: "success", message: "User registered" });
};

const githubCallbackUser = async (req, res) => {
    const user = req.user;

    const accessToken = generateToken(user);

    res.cookie("coderCookieToken", accessToken, {
        maxAge: 60 * 60 * 1000,
        httpOnly: true,
    }).redirect("/");
};

const resetUser = async (req, res) => {
    try {
        const { password, token } = req.body;

        const decodedToken = await verifyToken(token);
        const email = decodedToken.user.email;

        if (!email || !password)
            return res
                .status(400)
                .send({ status: "error", error: "Incomplete values" });

        const user = await getByEmailUserService(email);

        if (!user)
            return res
                .status(400)
                .send({ status: "error", error: "User not found" });

        if (isValidPassword(user, password)) {
            return res.status(400).send({
                status: "error",
                error: "La contraseña no puede ser la misma",
            });
        }

        const newPassword = createHash(password);
        user.password = newPassword;

        await updateOneUserService(email, user);

        res.send({ status: "success", message: "Password reset" });
    } catch (error) {
        if (error.message === "jwt expired") {
            getLogger().warning(
                "[controllers/usersController.js] /resetUser Token expired"
            );
            return res
                .status(400)
                .send({ status: "error", error: "Token expired" });
        }

        getLogger().error(
            "[controllers/usersController.js] /resetUser " + error.message
        );
        res.status(500).send({ status: "error", error: error.message });
    }
};

const resetEmailUser = async (req, res) => {
    try {
        const email = req.body.email;

        if (!email)
            return res
                .status(400)
                .send({ status: "error", error: "Incomplete values" });

        await resetEmailUserService(email);
        res.send({ status: "success", message: "Email de reset enviado" });
    } catch (error) {
        getLogger().error(
            "[controllers/usersController.js] /resetEmailUser " + error.message
        );
        res.status(500).send({ status: "error", error: error.message });
    }
};

const logoutUser = async (req, res) => {
    if (req.cookies["coderCookieToken"]) {
        const email = req.user.email;
        const user = req.user;
        if (email !== variablesAmbiente.adminEmail) {
            user.last_connection = new Date().toISOString();
            await updateOneUserService(email, user);
        }

        res.clearCookie("coderCookieToken").redirect("/");
    } else {
        res.status(401).json({
            error: "Invalid jwt",
        });
    }
};

const saveUser = async (req, res) => {
    const user = req.body;
    const result = await saveUserService(user);
    res.send(result);
};

const getUsers = async (req, res) => {
    const users = await getUsersService();
    res.send(users);
};

const getByEmailUser = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await getByEmailUserService(email);

        return user;
    } catch (error) {
        getLogger().info(
            "[controllers/usersController.js] /getByEmailUser " + error.message
        );
        res.status(400).send({ status: "error", error: error.message });
    }
};

const updateUserRole = async (req, res) => {
    const uid = req.params.uid;
    const role = req.body.role;
    try {
        const result = await updateUserRoleService(uid, role);
        res.send({
            status: "success",
            message: "El usuario fue actualizado correctamente",
        });
    } catch (error) {
        getLogger().info(
            "[controllers/usersController.js] /updateUserRole " + error.message
        );
        res.status(400).send({ status: "error", error: error.message });
    }
};

const updateUserDocument = async (req, res) => {
    const uid = req.params.uid;
    const files = req.files;
    try {
        const result = await updateUserDocumentService(uid, files);

        res.send({
            status: "success",
            message: "El usuario fue actualizado correctamente",
        });
    } catch (error) {
        getLogger().info(
            "[controllers/usersController.js] /updateUserDocument " +
                error.message
        );
        res.status(400).send({ status: "error", error: error.message });
    }
};

export {
    saveUser,
    getUsers,
    getByEmailUser,
    updateUserRole,
    loginUser,
    registerUser,
    failLoginUser,
    githubUser,
    githubCallbackUser,
    resetUser,
    resetEmailUser,
    logoutUser,
    updateUserDocument,
};
