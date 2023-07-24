import { Router } from "express";
import toAsyncRouter from "async-express-decorator";

const router = toAsyncRouter(Router());

router.get("/", (req, res) => {
    req.logger.fatal("Prueba fatal");
    req.logger.error("Prueba error");
    req.logger.warning("Prueba warning");
    req.logger.info("Prueba info");
    req.logger.http("Prueba http");
    req.logger.debug("Prueba debug");
});

export default router;
