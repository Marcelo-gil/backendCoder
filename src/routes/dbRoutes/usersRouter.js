import Router from "./router.js";
import {
    loginUser,
    registerUser,
    failLoginUser,
    githubUser,
    githubCallbackUser,
    resetUser,
    resetEmailUser,
    logoutUser,
    updateUserRole,
} from "../../controllers/usersController.js";

import passport from "passport";
import { passportStrategiesEnum } from "../../config/enums.js";
import { ADMIN_ACCESS, PUBLIC_ACCESS } from "../../config/constants.js";

export default class UsersRouter extends Router {
    init() {
        this.post(
            "/login",
            PUBLIC_ACCESS,
            passportStrategiesEnum.NOTHING,
            loginUser
        );

        this.post(
            "/register",
            PUBLIC_ACCESS,
            passportStrategiesEnum.NOTHING,
            registerUser
        );

        this.get(
            "/fail-login",
            PUBLIC_ACCESS,
            passportStrategiesEnum.NOTHING,
            failLoginUser
        );

        this.get(
            "/github",
            PUBLIC_ACCESS,
            passportStrategiesEnum.NOTHING,
            passport.authenticate("github", { scope: ["user:email"] }),
            githubUser
        );

        this.get(
            "/github-callback",
            PUBLIC_ACCESS,
            passportStrategiesEnum.NOTHING,
            passport.authenticate("github", { failureRedirect: "/login" }),
            githubCallbackUser
        );

        this.post(
            "/reset",
            PUBLIC_ACCESS,
            passportStrategiesEnum.NOTHING,
            resetEmailUser
        );

        this.post(
            "/resetUserPassword",
            PUBLIC_ACCESS,
            passportStrategiesEnum.NOTHING,
            resetUser
        );
        this.get(
            "/logout",
            PUBLIC_ACCESS,
            passportStrategiesEnum.NOTHING,
            logoutUser
        );

        this.put(
            "/premium/:uid",
            ADMIN_ACCESS,
            passportStrategiesEnum.JWT,
            updateUserRole
        );
    }
}
