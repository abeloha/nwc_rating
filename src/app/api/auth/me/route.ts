import { withAuth } from '@/lib/auth-utils';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-utils';

export const GET = withAuth(async (req, token) => {
  try {
    const admin = await prisma.admin.findUnique({
      where: { id: token.adminId },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!admin) {
      return errorResponse('Admin not found', 404);
    }

    return successResponse({ admin });
  } catch (error) {
    return errorResponse('Failed to fetch admin profile', 500);
  }
});
