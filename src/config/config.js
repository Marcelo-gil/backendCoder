import dotenv from 'dotenv';

dotenv.config();

export default {
    persistence: process.env.PERSISTENCE,
    mongoUrl: process.env.MONGOURL,
    secrets: process.env.SECRETS
}