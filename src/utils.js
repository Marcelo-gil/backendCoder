import { fileURLToPath } from "url";
import { dirname } from "path";
import multer from 'multer';
import { PRIVATE_KEY } from "./config/constants.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const createHash = (password) =>
    bcrypt.hashSync(password, bcrypt.genSaltSync(10));

const isValidPassword = (user, password) =>
    bcrypt.compareSync(password, user.password);

const generateToken = (user, expiresIn = "24h") => {
    const token = jwt.sign({ user }, PRIVATE_KEY, { expiresIn });
    return token;
};

const verifyToken = async (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, PRIVATE_KEY, (err, decoded) => {
            if (err) {
                reject(err);
            }

            resolve(decoded);
        });
    });
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let filePath = "";
        if (req.files.products) {
            filePath="products";
        } else if (req.files.profiles) {
            filePath="profiles";
        } else {
            filePath="documents";
        }
        cb(null, `${__dirname}/public/img/${filePath}`);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});


const uploader = multer({
    storage, onError: (err, next) => {
        console.log(err);
        next();
    }
});

export { __dirname, createHash, isValidPassword, generateToken, verifyToken, uploader };
