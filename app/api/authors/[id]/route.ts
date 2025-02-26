import prisma from '../../../../utils/prisma-client';
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  // Default values for pagination
  let page = 1;
  let limit = 10;

  // Check if the request has a JSON content type and attempt to parse the body
  const fullUrl = request.url

  // Get the author id from the URL
  const urlObject = new URL(fullUrl);
  const endpoint = urlObject.pathname;  
  let authorId = Number(endpoint.split('/').pop()!); 

  // Parse JSON body for pagination parameters
  try {
    const body = await request.json();
    page = body.page ?? page;
    limit = body.limit ?? limit;
  }
  catch (err){
    console.log("No json body provided to the request")
  }

  // Calculate skip and take for pagination
  const skip = (page - 1) * limit; 
  const take = limit;

    // Retrieve author with the given author id
    const authorExists = await prisma.author.findUnique({
      where: { authorId: authorId},
    });

    // Check if the author exists
    if (!authorExists){
      return NextResponse.json({status: 404, message: `Author with id ${authorId} does not exist`})
    }

    // Retrieve papers with pagination
    const papers = await prisma.article.findMany({
      where: { OR: [
        {lastAuthorId: authorId}, 
        {firstAuthorId: authorId}]
      },
      take,
      skip
    })

    // Get total count of papers for pagination metadata
    const totalPapers = await prisma.article.count({
      where: { OR: [
        {lastAuthorId: authorId}, 
        {firstAuthorId: authorId}]
      },
    });

    // Return the papers with pagination metadata
    return NextResponse.json({status:200,
      author: authorExists,
      papers,
      pagination: {
        currentPage: page,
        pageSize: limit,
        totalItems: totalPapers,
        totalPages: Math.ceil(totalPapers / limit),
      },
    });
}
