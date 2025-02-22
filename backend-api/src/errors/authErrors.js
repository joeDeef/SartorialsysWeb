class AuthError extends Error {
    constructor(message, statusCode) {
      super(message);
      this.name = 'AuthError';
      this.statusCode = statusCode;
    }
  }
  
  class WrongEmailError extends AuthError {
    constructor() {
      super('Incorrect Email/Unregistered User', 400);
    }
  }
  
  class WrongPasswordError extends AuthError {
    constructor() {
      super('Wrong Password', 401);
    }
  }
  
  export { AuthError, WrongEmailError, WrongPasswordError };
  