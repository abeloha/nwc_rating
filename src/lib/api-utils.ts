import { NextResponse } from 'next/server';

type SuccessResponse<T> = {
  success: true;
  data: T;
};

type ErrorResponse = {
  success: false;
  error: string;
};

export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

export function successResponse<T>(data: T): NextResponse<ApiResponse<T>> {
  return NextResponse.json({ success: true, data });
}

export function errorResponse(error: string, status = 400): NextResponse<ErrorResponse> {
  return NextResponse.json({ success: false, error }, { status });
}

export function serverErrorResponse(error: unknown): NextResponse<ErrorResponse> {
  console.error('Server error:', error);
  const errorMessage = error instanceof Error ? error.message : 'Internal server error';
  return errorResponse(errorMessage, 500);
}
