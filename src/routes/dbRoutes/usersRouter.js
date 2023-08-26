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
    updateUserDocument,
} from "../../controllers/usersController.js";

import passport from "passport";
import { passportStrategiesEnum } from "../../config/enums.js";
import { ADMIN_ACCESS, PRIVATE_ACCESS, PUBLIC_ACCESS } from "../../config/constants.js";
import { uploader } from "../../utils.js";

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
            PRIVATE_ACCESS,
            passportStrategiesEnum.JWT,
            logoutUser
        );

        this.put(
            "/premium/:uid",
            ADMIN_ACCESS,
            passportStrategiesEnum.JWT,
            updateUserRole
        );

        this.post(
            "/:uid/documents",
            PRIVATE_ACCESS,
            passportStrategiesEnum.JWT,
            uploader.fields([
                { name: "products" },
                { name: "profile", maxCount: 1 },
                { name: "identification", maxCount: 1 },
                { name: "address", maxCount: 1 },
                { name: "account_state", maxCount: 1 },
            ]),
            updateUserDocument
        );
    }
}
