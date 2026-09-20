import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from "@nestjs/common";
import { GraphQLError } from "graphql";
import { requestContext } from "../../modules/auth/actor-context.service";

const logger = new Logger("RequestBoundary");
export function safeError(error: unknown, requestId: string) {
  const expected = error instanceof HttpException;
  const status = expected ? error.getStatus() : 500;
  if (!expected)
    logger.error({
      event: "request_failed",
      requestId,
      errorType: error instanceof Error ? error.name : "UnknownError",
    });
  return {
    status,
    message: expected
      ? error.message
      : "Не удалось выполнить запрос. Повторите позже.",
    requestId,
  };
}
@Catch()
export class ErrorBoundary implements ExceptionFilter {
  catch(error: unknown, host: ArgumentsHost) {
    const requestId = requestContext.getStore()?.requestId ?? "unknown";
    const result = safeError(error, requestId);
    if (host.getType<string>() === "graphql")
      return new GraphQLError(result.message, {
        extensions: {
          code:
            result.status === 401
              ? "UNAUTHENTICATED"
              : result.status === 403
                ? "FORBIDDEN"
                : result.status === 409
                  ? "CONFLICT"
                  : result.status >= 500
                    ? "INTERNAL_SERVER_ERROR"
                    : "BAD_USER_INPUT",
          status: result.status,
          requestId,
        },
      });
    host
      .switchToHttp()
      .getResponse()
      .status(result.status)
      .json({ error: result.message, message: result.message, requestId });
  }
}
