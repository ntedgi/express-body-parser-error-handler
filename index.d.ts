declare module "express-body-parser-error-handler" {
  import type {
    Request,
    Response,
    NextFunction,
    ErrorRequestHandler,
  } from "express";

  export interface BodyParserErrorHandlerOptions {
    onError?: (
      err: Error,
      req: Request,
      res: Response,
      next: NextFunction,
    ) => void;
    errorMessage?: (err: Error) => string;
  }

  export default function bodyParserErrorHandler(
    options?: BodyParserErrorHandlerOptions,
  ): ErrorRequestHandler;
}
