import { createLogger, getLogger, LogLevel } from 'logging';

class Utils {
    static getByKeyIgnoreCase(object: any, keyValue: string): string {
        if (!object || !keyValue)
            return null;

        let key = Object.keys(object).find(k => k.toLowerCase() === keyValue.toLowerCase());

        return object[key];
    }

    static createLogger(): any {
        return getLogger();
    }

}

export { Utils }