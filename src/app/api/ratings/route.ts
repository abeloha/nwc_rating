import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse, serverErrorResponse } from '@/lib/api-utils';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lecturerModuleId = searchParams.get('lecturerModuleId');
    
    const where = lecturerModuleId ? { lecturer_module_id: lecturerModuleId } : {};
    
    const ratings = await prisma.rating.findMany({
      where,
      orderBy: {
        created_at: 'desc',
      },
    });
    
    return successResponse(ratings);
  } catch (error) {
    return serverErrorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const {
      lecturer_module_id,
      criteria_1_score,
      criteria_2_score,
      criteria_3_score,
      criteria_4_score,
      criteria_5_score,
      remarks,
    } = await request.json();

    const ip_address = request.headers.get('x-forwarded-for') || 'unknown';
    const user_agent = request.headers.get('user-agent') || 'unknown';

    if (!lecturer_module_id) {
      return errorResponse('Lecturer module ID is required', 400);
    }

    // Create the rating
    const newRating = await prisma.rating.create({
      data: {
        lecturer_module_id,
        criteria_1_score: Number(criteria_1_score),
        criteria_2_score: Number(criteria_2_score),
        criteria_3_score: Number(criteria_3_score),
        criteria_4_score: Number(criteria_4_score),
        criteria_5_score: Number(criteria_5_score),
        remarks: remarks || null,
        ip_address,
        user_agent,
      },
    });

    return successResponse(newRating);
  } catch (error) {
    return serverErrorResponse(error);
  }
}
