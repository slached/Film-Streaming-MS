const STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
};

class APIError extends Error {
  constructor(description, name, statusCode) {
    super(description);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = name;
    this.statusCode = statusCode;
    Error.captureStackTrace(this);
  }
}

// Internal  Server Error 500
class InternalServerError extends APIError {
  constructor(description = "Internal server error.") {
    super(description, "Server Error", STATUS_CODES.INTERNAL_SERVER_ERROR);
  }
}

// Unauthorized Error 401
class UnauthorizedError extends APIError {
  constructor(description = "Unauthorized user detected.") {
    super(description, "Unauthorized Error", STATUS_CODES.UNAUTHORIZED);
  }
}

// Bad Request Error 400
class BadContentError extends APIError {
  constructor(description = "Bad request.") {
    super(description, "Bad Request Error", STATUS_CODES.BAD_REQUEST);
  }
}

// Not Found Error 404
class NotFoundError extends APIError {
  constructor(description = "Not founded.") {
    super(description, "Not Found Error", STATUS_CODES.NOT_FOUND);
  }
}

module.exports = {
  STATUS_CODES,
  InternalServerError,
  UnauthorizedError,
  BadContentError,
  NotFoundError,
};
