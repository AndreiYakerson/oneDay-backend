//Import ENV vars from .env
import dotenv from 'dotenv';
dotenv.config()


export default {
    dbURL: process.env.MONGO_ATLAS_URL,
    dbName: process.env.DB_NAME,
}
