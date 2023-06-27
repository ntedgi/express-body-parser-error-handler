declare module 'express-body-parser-error-handler' {
	import type { Request, Response, NextFunction } from 'express';

	export interface BodyParserErrorHandlerOptions {
		onError?: (err: Error, req: Request, res: Response) => void;
		errorMessage?: (err: Error) => string;
	}

	export default function bodyParserErrorHandler(
		options?: BodyParserErrorHandlerOptions,
	): (req: Request, res: Response, next: NextFunction) => void;
}
