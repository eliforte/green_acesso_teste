/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Request } from 'express';
import { ZodError } from 'zod';

import { AppError } from '@/core/common/errors/app.error';
import { PrismaClient } from '@prisma/client';

@Catch()
export class GlobalErrorFilter implements ExceptionFilter {
  private logger = new Logger('GlobalErrorFilter');
  private prisma = new PrismaClient();

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  async catch(exception: unknown, host: ArgumentsHost) {
    this.logger.error(
      JSON.stringify(exception, Object.getOwnPropertyNames(exception), 2),
    );

    let responseBody: any = {
      statusCode: 500,
      message: 'Internal server error',
      timestamp: new Date(),
    };
    let httpStatus = 500;

    if (exception instanceof AppError) {
      responseBody = {
        statusCode: exception.statusCode,
        message: exception.message,
        timestamp: new Date(),
        internalCode: exception.internalCode,
      };
      httpStatus = exception.statusCode;

      return this.httpAdapterHost.httpAdapter.reply(
        host.switchToHttp().getResponse(),
        responseBody,
        httpStatus,
      );
    }

    if (exception instanceof ZodError) {
      responseBody = {
        statusCode: 400,
        message: exception.errors,
        timestamp: new Date(),
      };
      httpStatus = 400;
    }

    this.logger.error(
      JSON.stringify(
        exception instanceof Error
          ? {
              ...exception,
              name: exception.name,
              message: exception.message,
              stack: exception.stack,
            }
          : exception,
        null,
        2,
      ),
    );

    const { body, query, method, originalUrl } = host
      .switchToHttp()
      .getRequest<Request>();

    await this.prisma.errorLogs.create({
      data: {
        timestamp: new Date(),
        requestBody: body,
        method,
        route: originalUrl,
        query: JSON.stringify(query),
        error: exception instanceof Error ? exception.message : 'Unknown error',
      },
    });

    this.httpAdapterHost.httpAdapter.reply(
      host.switchToHttp().getResponse(),
      responseBody,
      httpStatus,
    );
  }
}