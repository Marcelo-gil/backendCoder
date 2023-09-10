import express from "express";
import compression from "express-compression";
import "./dao/dbManager/dbConfig.js";
import ProductsRouter from "./routes/dbRoutes/productsRouter.js";
import CartsRouter from "./routes/dbRoutes/cartsRouter.js";
import UsersRouter from "./routes/dbRoutes/usersRouter.js";
import SessionsRouter from "./routes/dbRoutes/sessionsRouter.js";
import mockingProductsRouter from "./routes/dbRoutes/mockingProductsRouter.js";
import loggerTest from "./routes/fileRoutes/loggerTest.js";
import { Server } from "socket.io";
import handlebars from "express-handlebars";
import ViewsRouter from "./routes/viewsRouter.js";
import { __dirname } from "./utils.js";
import realtimeManager from "./dao/dbManager/realtimeManager.js";
import MessageManager from "./dao/dbManager/messageManager.js";
import session from "express-session";
import initializePassport from "./config/passportConfig.js";
import passport from "passport";
import cookieParser from "cookie-parser";
import config from "./config/config.js";
import cors from "cors";
import errorHandler from "./middlewares/errors/index.js";
import { addLogger, getLogger } from "./utils/logger.js";

import swaggerJsdoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";

const secrets = config.secrets;
const frontend_account = config.frontend_account;
const frontend_external_account = config.frontend_external_account;
const portEnv = config.portEnv;

const messageManager = new MessageManager();
const usersRouter = new UsersRouter();
const sessionsRouter = new SessionsRouter();
const viewsRouter = new ViewsRouter();
const cartsRouter = new CartsRouter();
const productsRouter = new ProductsRouter();

const app = express();

if (frontend_external_account) {
    app.use(
        cors({
            origin: [frontend_account],
        })
    );
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));
app.use(compression());

const swaggerOptions = {
    definition: {
        openapi: "3.0.1",
        info: {
            title: "Documentación del proyecto de Backend de Coderhouse",
            description: "API pensada para resolver el proceso de un ecommerce",
        },
    },
    apis: [`${__dirname}/docs/**/*.yaml`],
};

const specs = swaggerJsdoc(swaggerOptions);

app.use("/api/docs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

app.use(cookieParser());

initializePassport();

app.use(
    session({
        secret: secrets,
        resave: true,
        saveUninitialized: true,
    })
);
app.use(passport.initialize());

app.use(addLogger);

const hbs = handlebars.create({
    helpers: {
        ifEquals: (arg1, arg2, options) => {
            return arg1 == arg2 ? options.fn(this) : options.inverse(this);
        },
        ifNotEquals: (arg1, arg2, options) => {
            return arg1 != arg2 ? options.fn(this) : options.inverse(this);
        },
    },
});

app.engine("handlebars", hbs.engine);
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");

app.use("/", viewsRouter.getRouter());
app.use("/realtimeproducts", viewsRouter.getRouter());
app.use("/api/users", usersRouter.getRouter());

app.use("/api/sessions", sessionsRouter.getRouter());
app.use("/api/products", productsRouter.getRouter());
app.use("/api/carts", cartsRouter.getRouter());
app.use("/mockingProducts", mockingProductsRouter);
app.use("/loggerTest", loggerTest);

app.use(errorHandler);

app.use((err, req, res, next) => {
    req.logger.fatal(err.message);
    res.status(500).send("Error no controlado");
});

const server = app.listen(portEnv, "0.0.0.0", () =>
    getLogger().info("Server running at 0.0.0.0:" + portEnv)
);

const io = new Server(server);

app.set("socketio", io);

io.on("connection", async () => {
    getLogger().info("Cliente Conectado");
    io.emit("showProducts", realtimeManager);
});

const messages = [];
io.on("connection", (socket) => {
    getLogger().info("Chat conectado");
    const cargarDatos = async () => {
        const historyMessages = await messageManager.getMessages();
        historyMessages.forEach((element) => {
            messages.push(element);
        });
        socket.emit("messageLogs", historyMessages);
    };

    socket.on("message", (data) => {
        const enviarMessage = async () => {
            const message = await messageManager.addMessages(data);
            messages.push(data);
            io.emit("messageLogs", messages);
        };
        enviarMessage();
    });

    socket.on("authenticated", (data) => {
        cargarDatos();
        socket.broadcast.emit("newUserConnected", data);
    });
});
