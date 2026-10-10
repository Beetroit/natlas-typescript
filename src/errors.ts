/**
 * Error hierarchy for @natlas/sdk.
 */

export class NatlasError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NatlasError";
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class APIConnectionError extends NatlasError {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = "APIConnectionError";
  }
}

export class APIStatusError extends NatlasError {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly responseBody: string
  ) {
    super(message);
    this.name = "APIStatusError";
  }
}

export class AudioProcessingError extends NatlasError {
  constructor(message: string) {
    super(message);
    this.name = "AudioProcessingError";
  }
}
