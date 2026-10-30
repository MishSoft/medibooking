// Thrown for unknown user, wrong password or wrong sign-in portal alike,
// so the response never reveals which one it was
export class InvalidCredentialsError extends Error {
  constructor() {
    super("Wrong email/id or password");
    this.name = "InvalidCredentialsError";
  }
}
