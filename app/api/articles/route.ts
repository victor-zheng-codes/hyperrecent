import prisma from '../../../utils/prisma-client';
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
  
  // Default values for pagination
  let page = 1;
  let limit = 10;

  // Check if the request has a JSON content type and attempt to parse the body
  if (request.headers.get("content-type") === "application/json") {
    // Parse request body if JSON is provided
    try {
      const body = await request.json();
      page = body.page ?? page;
      limit = body.limit ?? limit;
    } catch (error) {
      console.log("Error parsing JSON body in api/articles, using default pagination values: " + error);
    }
  } else {
    console.log("No JSON body found, using default pagination values.");
  }

  // Calculate skip and take for pagination
  const skip = (page - 1) * limit;
  const take = limit;

  // Get total count of articles for pagination metadata
  const totalArticles = await prisma.article.count();

  // Return the articles with pagination
  try {
    // Get all articles with pagination
    const prismaPosts = await prisma.article.findMany({
      skip,
      take,
      orderBy: {
        date: 'desc',
      },
    });

    // Map the articles to the response format
    const posts = await Promise.all(
      prismaPosts.map(async (post: { articleId: number; title: any; slug: any; server: any; authorList: string; date: { toDateString: () => any; }; abstract: any; }) => {
      // Split the author list by semicolon and trim whitespace
      const authors = post.authorList.split(';').map((author: string) => author.trim());
      return {
        articleId: post.articleId,
        title: post.title,
        slug: post.slug,
        publisher: post.server,
        authors: authors,
        date: post.date.toDateString(),
        summary: post.abstract,
        publisherIconUrl: '/images/publisher-icon.png',
        categories: await getAllRelatedTopics(post.articleId),
      };
      })
    );

    // Return paginated and formatted article data
    return NextResponse.json( {status: 200, 
      articles: posts,
      pagination: {
        currentPage: page,
        pageSize: limit,
        totalItems: totalArticles,
        totalPages: Math.ceil(totalArticles / limit),
      },
    });
  }

  // Catch any errors and return a 500 status code
  catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json( {status: 500, message: "Error at the server level" });
  }
}