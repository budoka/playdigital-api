import { HttpError } from 'routing-controllers';

/**
 * Exception for crashable error.
 */
export abstract class CrashableError extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, CrashableError.prototype);
  }
}

/**
 * Exception for environment error.
 */
export class EnviromentError extends CrashableError {
  constructor(message: string) {
    super(message);
    this.name = EnviromentError.name;
  }
}

/**
 * Exception for database error.
 */
export class DatabaseError extends CrashableError {
  constructor(message: string) {
    super(message);
    this.name = DatabaseError.name;
  }
}

/**
 * Exception for API error.
 */
export class APIError extends CrashableError {
  constructor(message: string) {
    super(message);
    this.name = APIError.name;
  }
}

/**
 * Exception for external API error.
 */
export class ExternalAPIError extends CrashableError {
  constructor(message: string) {
    super(message);
    this.name = ExternalAPIError.name;
  }
}

/**
 * Exception for unsupported OpenAPI file error.
 */
export class UnsupportedOpenAPIFileError extends CrashableError {
  constructor(file: string) {
    super(`Unsupported OpenAPI documentation file. Expected a yaml or json file, but found: '${file}'`);
    this.name = UnsupportedOpenAPIFileError.name;
  }
}

/**
 * Exception for 409 HTTP error.
 */
export class ConflictError extends HttpError {
  constructor(message?: string) {
    super(409);
    this.name = ConflictError.name;
    this.message = message!;
  }
}

/**
 * Exception for 422 HTTP error.
 */
export class UnprocessableEntityError extends HttpError {
  constructor(message?: string) {
    super(422);
    this.name = UnprocessableEntityError.name;
    this.message = message!;
  }
}
