import prisma from '../../../utils/prisma-client';
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  // Default values for pagination
  let page = 1;
  let limit = 10;

  // Check if the request has a JSON content type and attempt to parse the body
  try {
    // Parse JSON body for pagination parameters
    const body = await request.json();
    page = body.page ?? page;
    limit = body.limit ?? limit;
  } catch (error) {
    console.log("No JSON body found, using default pagination values.");
  }

  // Calculate skip and take for pagination
  const skip = (page - 1) * limit;
  const take = limit;

  // Get total count of authors for pagination metadata
  const totalAuthors = await prisma.author.count();

  // Retrieve authors with pagination
  const authors = await prisma.author.findMany({
    skip,
    take,
  });

  // Return the authors with pagination metadata
  return NextResponse.json({status: 200,
    authors,
    pagination: {
      currentPage: page,
      pageSize: limit,
      totalItems: totalAuthors,
      totalPages: Math.ceil(totalAuthors / limit),
    },
    now: Date.now(),
  });
  }