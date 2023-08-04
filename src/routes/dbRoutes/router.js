import { Router as expressRouter } from "express";
import { passportStrategiesEnum } from "../../config/enums.js";
import passport from "passport";
import { getLogger } from "../../utils/logger.js";
import { ROLES } from "../../config/contants.js";
export default class Router {
    constructor() {
        this.router = expressRouter();
        this.init();
    }

    getRouter() {
        return this.router;
    }

    init() {}

    get(path, policies, passportStrategy, ...callbacks) {
        this.router.get(
            path,
            this.applyCustomPassportCall(passportStrategy),
            this.handlePolicies(policies),
            this.generateCustomReponse,
            this.applyCallbacks(callbacks)
        );
    }

    post(path, policies, passportStrategy, ...callbacks) {
        this.router.post(
            path,
            this.applyCustomPassportCall(passportStrategy),
            this.handlePolicies(policies),
            this.generateCustomReponse,
            this.applyCallbacks(callbacks)
        );
    }

    put(path, policies, passportStrategy, ...callbacks) {
        this.router.put(
            path,
            this.applyCustomPassportCall(passportStrategy),
            this.handlePolicies(policies),
            this.generateCustomReponse,
            this.applyCallbacks(callbacks)
        );
    }

    delete(path, policies, passportStrategy, ...callbacks) {
        this.router.delete(
            path,
            this.applyCustomPassportCall(passportStrategy),
            this.handlePolicies(policies),
            this.generateCustomReponse,
            this.applyCallbacks(callbacks)
        );
    }

    applyCustomPassportCall = (strategy) => (req, res, next) => {
        if (strategy === passportStrategiesEnum.JWT) {
            passport.authenticate(strategy, function (err, user, info) {
                if (err) return next(err);

                if (!user) return res.redirect("/login");

                const userCopy = { ...user };
                delete userCopy.password;

                req.user = userCopy;
                next();
            })(req, res, next);
        } else {
            next();
        }
    };

    handlePolicies = (policies) => (req, res, next) => {
        if (policies[0] === ROLES.PUBLIC) return next();

        const user = req.user;
        if (typeof user === "undefined") return res.redirect("/login");
        if (!policies.includes(user.role.toUpperCase())) {
            return res.status(403).json({ message: "Forbidden" });
        }

        next();
    };

    generateCustomReponse = (req, res, next) => {
        res.sendSuccess = (data) => {
            res.status(200).json({ data });
        };
        res.sendServerError = (error) => {
            res.status(500).json({ error });
        };
        res.sendClientError = (error) => {
            res.status(400).json({ error });
        };
        next();
    };

    applyCallbacks(callbacks) {
        return callbacks.map((callback) => async (...params) => {
            try {
                await callback.apply(this, params);
            } catch (error) {
                getLogger().error(
                    "[routes/dbRoutes/router.js] /applyCallbacks " +
                        error.message
                );
                params[1].status(500).json({ error: error.message });
            }
        });
    }
}
