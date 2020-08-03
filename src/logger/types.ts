export enum Levels {
  Error = 'error',
  Warn = 'warn',
  Info = 'info',
  Debug = 'debug',
}

export const LoggerLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3,
  },
  colors: {
    error: 'white redBG',
    warn: 'black yellowBG',
    info: 'white blueBG',
    debug: 'green',
  },
};
