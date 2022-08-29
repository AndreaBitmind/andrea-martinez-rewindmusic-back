export interface ErrorWithCode {
  code: string;
}

export interface ICustomError extends Error {
  code: number;
  publicMessage: string;
}
