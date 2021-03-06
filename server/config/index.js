import './lib';

const {
    APP_PORT,
    REDIS_HOST,
    REDIS_PORT,
    REDIS_AUTH,
    REDIS_DB,
    TEMP_PATH
} = process.env;

export default {
    APP_PORT: APP_PORT || 8080,
    REDIS_HOST,
    REDIS_PORT,
    REDIS_AUTH,
    REDIS_DB,
    TEMP_PATH
};