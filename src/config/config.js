import dotenv from 'dotenv';

dotenv.config();

export default {
    persistence: process.env.PERSISTENCE,
    mongoUrl: process.env.MONGO_URL,
    adminEmail: process.env.ADMIN_EMAIL,
    adminPassword: process.env.ADMIN_PASSWORD,
    secrets: process.env.SECRETS,
    gmail_account: process.env.GMAIL_ACCOUNT,
    gmail_password: process.env.GMAIL_PASSWORD
}