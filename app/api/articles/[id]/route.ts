// import { response } from "@/utils/http";

import prisma from '../../../../utils/prisma-client';
import { NextResponse } from "next/server";

// Define Article interface for type checking
interface Article {
  topic: {
    name: string;
  };
}

// Helper function to get all topics related to an article by its ID
async function getAllRelatedTopics(articleId: number) {
  const topics = await prisma.articleTopic.findMany({
    where: { articleId },
    include: { topic: true },
  });
  return topics.map((article: Article) => article.topic.name);
}

export async function POST(request: Request) {

  // Check if the request has a JSON content type and attempt to parse the body
  const fullUrl = request.url

  // Get the article id from the URL
  const urlObject = new URL(fullUrl);
  const endpoint = urlObject.pathname;  
  let articleId = Number(endpoint.split('/').pop()!); 

  // Check if the article id is a number
  if (!articleId){
    return NextResponse.json(
      {
        error: "Article id must be a number1",
        articles: [],
      },
      { status: 404 },
    );
    }

  // Return the article with the given article id
  try {
      // Get total count of articles for pagination metadata
      const article = await prisma.article.findUnique({
        where: { articleId }
      });

      // Check if the article exists
      if (!article){
        return NextResponse.json({status: 404, message: `Article with article id ${articleId} does not exist` });
      }

      // Get the first and last author of the article
      const firstAuthor = await prisma.author.findUnique({
        where: {
          authorId: article.firstAuthorId
        },
      });
      const lastAuthor = await prisma.author.findUnique({
        where: {
          authorId: article.lastAuthorId
        },
      });

      // Get all related topics for the article
      const topics = await getAllRelatedTopics(articleId)

      // Return the article with all the related information
      return NextResponse.json( {status: 200,
        article: article,
        firstAuthor,
        lastAuthor,
        topics,
        now: Date.now(),
      });
    }

    // Catch any errors that occur during the process
    catch(error) {
      console.error("Error fetching post:", error);
      return NextResponse.json(
        {
          error: "Error searching posts",
          articles: [],
        },
        { status: 500 },
      );
  }
}
