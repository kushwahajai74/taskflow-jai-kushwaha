export class ApiError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = this.constructor.name;
    // Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends ApiError {
  constructor(message = "Bad request") {
    super(400, message);
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message = "unauthenticated") {
    super(401, message);
  }
}

export class ForbiddenError extends ApiError {
  constructor(message = "forbidden") {
    super(403, message);
  }
}

export class NotFoundError extends ApiError {
  constructor(message = "not found") {
    super(404, message);
  }
}

export class ConflictError extends ApiError {
  constructor(message = "conflict") {
    super(409, message);
  }
}
