import dotenv from 'dotenv';
import { EnviromentError } from 'src/exceptions';
import { Dictionary } from 'src/constants/interfaces';
import { parseValue } from './parse';

dotenv.config();

export interface EnvironmentData {
  cache: Dictionary<any>;
  env?: string;
}

export const environmentData: EnvironmentData = {
  env: undefined,
  cache: {},
};

/**
 * Get the environment variable.
 * The retrieved value is cached for a better performance.
 * @param variableName Variable name
 */
export function getVar(variableName: string) {
  if (!variableName) throw new EnviromentError(`Malformed environment variable name.`);

  // Check if the variable is cached and return it.
  if (environmentData.cache[variableName]) return environmentData.cache[variableName];

  let value: string | number | boolean | undefined = process.env[variableName];

  if (value === undefined) throw new EnviromentError(`Unable to get environment variable: '${variableName}'.`);

  value = parseValue(value);

  // Cache the value and return it.
  return (environmentData.cache[variableName] = value);
}

/**
 * Get the environment name.
 */
export function getEnvironment() {
  if (environmentData.env) return environmentData.env;
  else return (environmentData.env = getVar('NODE_ENV').toLowerCase());
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
  return getVar('DATABASE_LOG');
}
