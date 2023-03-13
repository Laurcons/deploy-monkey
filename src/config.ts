import * as dotenv from 'dotenv';
dotenv.config();

const getOrThrow = <T = string>(key: string, transform?: (f: string) => T) => {
  if (!process.env[key]) {
    throw new Error('Missing envvar ' + key);
  }
  if (transform) return transform(process.env[key]);
  return process.env[key] as T;
};

export const config = {
  mongoUrl: getOrThrow('MONGO_URL'),
};
