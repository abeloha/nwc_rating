import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse, serverErrorResponse } from '@/lib/api-utils';

export async function GET() {
  try {
    const modules = await prisma.lecturerModule.findMany({
      where: { is_active: true },
      orderBy: [
        { lecturer_name: 'asc' },
        { module_name: 'asc' },
      ],
    });
    return successResponse(modules);
  } catch (error) {
    return serverErrorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { lecturer_name, module_name, module_description, module_objectives, email } = await request.json();

    if (!lecturer_name || !module_name || !module_description) {
      return errorResponse('Lecturer name, module name, and description are required', 400);
    }

    const moduleData = await prisma.lecturerModule.create({
      data: {
        lecturer_name,
        module_name,
        module_description,
        module_objectives: module_objectives || null,
        email: email || null,
      },
    });

    return successResponse(moduleData);
  } catch (error) {
    return serverErrorResponse(error);
  }
}
