import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse, serverErrorResponse } from '@/lib/api-utils';
import { hashPassword } from '@/lib/auth-utils';

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password) {
      return errorResponse('Email and password are required', 400);
    }

    // Check if admin already exists
    const existingAdmin = await prisma.admin.findUnique({
      where: { email },
    });

    if (existingAdmin) {
      return errorResponse('Admin with this email already exists', 400);
    }

    // Create new admin
    const admin = await prisma.admin.create({
      data: {
        email,
        password: hashPassword(password),
        name,
      },
    });

    // Don't return the password
    const { password: _, ...adminWithoutPassword } = admin;

    return successResponse({ admin: adminWithoutPassword });
  } catch (error) {
    return serverErrorResponse(error);
  }
}
