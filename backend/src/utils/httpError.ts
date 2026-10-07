export interface HttpError extends Error { status: number; code: string }

export const httpError = (status: number, code: string, message: string): HttpError => {
  const err = new Error(message) as HttpError;
  err.status = status;
  err.code = code;
  return err;
};

export const isHttpError = (err: unknown): err is HttpError =>
  typeof err === "object" && err !== null && "status" in err && "code" in err;
