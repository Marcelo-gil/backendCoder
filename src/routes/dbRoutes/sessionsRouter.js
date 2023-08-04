import Router from "./router.js";
import { passportStrategiesEnum } from "../../config/enums.js";
import { PRIVATE_ACCESS } from "../../config/contants.js";

export default class SessionsRouter extends Router {
    init() {
        this.get(
            "/current",
            PRIVATE_ACCESS,
            passportStrategiesEnum.JWT,
            (req, res) => {
                res.sendSuccess(req.user);
            }
        );
    }
}
