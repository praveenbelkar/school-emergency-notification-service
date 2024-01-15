import { createLogger, getLogger, LogLevel } from 'logging';

const getByKeyIgnoreCase = (object: any, keyValue: string): string | null => {
    if (!object || !keyValue)
        return null;

    let key = Object.keys(object).find(k => k.toLowerCase() === keyValue.toLowerCase()) as string;

    return object[key];
}

/*const getLogger = (): any => {
    return getLogger();
}*/


export { getByKeyIgnoreCase }