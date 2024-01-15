const {Sequelize} = require("sequelize");
const sharedLogging = require("logging");
import * as dotenv from 'dotenv';
dotenv.config();

module.exports.options = {
    dialect: 'postgres',
    logging: (msg: any) => sharedLogging.getLogger().debug(msg),
    pool: {
        max: 5,
        min: 0,
        idle: 0,
        acquire: 1000,
        evict: 15 * 1000 // same as lambda timeout
    },
    retry: {
        max: 3, // maximum amount of tries
        //timeout: parseInt(process.env.RETRY_TIMEOUT_IN_MS as string), // throw if no response or error within millisecond timeout, default: undefined,
        match: [ // Must match error signature (ala bluebird catch) to continue
           Sequelize.ConnectionError,
           Sequelize.SequelizeConnectionError,
           Sequelize.SequelizeConnectionRefusedError,
           Sequelize.SequelizeHostNotFoundError,
           Sequelize.SequelizeHostNotReachableError,
           Sequelize.SequelizeInvalidConnectionError,
           Sequelize.SequelizeConnectionTimedOutError,
           Sequelize.SequelizeConnectionAcquireTimeoutError
        ],
        backoffBase: 500, // Initial backoff duration in ms. Default: 100,
        backoffExponent: 1.1, // Exponent to increase backoff each try. Default: 1.1
        report: (msg: any, obj: any) => sharedLogging.getLogger().debug(msg), // the function used for reporting; must have a (string, object) argument signature, where string is the message that will passed in by retry-as-promised, and the object will be this configuration object + the $current property
        name: 'Database Call' // if user supplies string, it will be used when composing error/reporting messages; else if retry gets a callback, uses callback name in erroring/reporting; else (default) uses literal string 'unknown'
    }
}
