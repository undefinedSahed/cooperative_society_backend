import { HttpStatus } from '@nestjs/common';

export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data?: T;
  error?: string;
}

export const sendResponse = <T>(
  data: T,
  message: string = 'Success',
  statusCode: HttpStatus = HttpStatus.OK,
): ApiResponse<T> => {
  return {
    statusCode,
    message,
    data,
  };
};

export const errorResponse = (
  message: string = 'Internal Server Error',
  statusCode: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
  error?: string,
): ApiResponse<null> => {
  return {
    statusCode,
    message,
    error: error || message,
  };
};
