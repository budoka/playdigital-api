import dotenv from 'dotenv';
import { EnviromentError } from 'src/exceptions';

dotenv.config();

/**
 * Get the environment variable.
 * @param variable Variable name
 */
export function getVar(variable: string) {
  if (process.env[variable]) {
    return process.env[variable]!;
  }
  throw new EnviromentError(`Unable to get enviroment variable: '${variable}'`);
}

/**
 * Get the environment name.
 */
export function getEnvironment() {
  return getVar('NODE_ENV').toLowerCase();
}

/**
 * Check if the current environment is a development environment.
 */
export function isDevelopment() {
  return getEnvironment() === 'development';
}

/**
 * Check if the current environment is a production environment.
 */
export function isProduction() {
  return getEnvironment() === 'production';
}

/**
 * Check if the database log is enabled.
 */
export function isDatabaseLogEnabled() {
  return getVar('DATABASE_LOG').toLowerCase() === 'true';
}
