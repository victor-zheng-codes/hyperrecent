// import { response } from "@/utils/http";
import { NextResponse } from "next/server";
import prisma from "../../../../utils/prisma-client";




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

// Main handler for POST requests to retrieve articles
export async function POST(request: Request) {
  // Default values for pagination and filtering
  let page = 1;
  let limit = 20;
  let query = '';
  let topicId: number[] | undefined = undefined;
  let startDate: Date | undefined;
  let endDate: Date | undefined;
  
  // Parse request body if JSON is provided
  if (request.headers.get("content-type") === "application/json") {
    try {
      const body = await request.json();
      console.log("Received request body:", body);

      // Assign values from body, with defaults
      page = body.page ?? page;
      limit = body.limit ?? limit;
      query = body.q ?? query;
      topicId = body.topic ?? topicId;
      startDate = body.start ? new Date(body.start) : undefined;

      // Ensure endDate includes the full day
      endDate = body.end ? new Date(body.end) : undefined;

      // If topicId is [] (all articles) or only contains null, set it to undefined
      // otherwise, array is already in correct format for filtering
      if (Array.isArray(topicId) && (topicId.length === 0 || topicId.filter(id => id !== null).length === 0)) {
        topicId = undefined;
      } else {
        // Filter out null values from topicId array
        topicId = topicId?.filter(id => id !== null);
      }
    } catch (error) {
      console.log("Error parsing JSON body in articles search. Using default pagination values: " + error);
    }
  }
  else{
    console.log("Received request body not json format");
  }

  // Calculate skip and take values for pagination
  const skip = Number(page - 1) * Number(limit); 
  const take = Number(limit);
  
  // Apply date filter if startDate and endDate are provided
  let dateFilter = {};
  if (startDate && endDate) {
      dateFilter = {
          date: {
              gte: startDate,
              lte: endDate,
          },
      };
  }

  // Fetch articles from Prisma based on query and filters
  try {
    let prismaPosts, totalArticles;
    // If no query is provided, fetch articles by topic and date filters only
    if (!query) {
      prismaPosts = await prisma.article.findMany({
        where: {
          ...dateFilter,
          articleTopics: {  
            some: {
              // If there's a topicId, filter for articles in any topic
              topicId: topicId ? { in: topicId } : undefined 
            }
          },
        },
        orderBy: {
          date: 'desc',
        },
        skip: skip,
        take: take,
      });

      // Count total articles for pagination
      totalArticles = await prisma.article.count({
        where: {
          ...dateFilter,
          articleTopics: {  
            some: {
              // If there's a topicId, filter for articles in any topic
              topicId: topicId ? { in: topicId } : undefined 
            }
          }
        },
      });

    // If query is provided, perform full-text search on article title and abstract
    } else {
      // Split query by commas and format for full-text search
      const queryTerms = query.split(",").map(term => {
        const trimmedTerm = term.trim();
        // Escape single quotes if present
        const cleanTerm = trimmedTerm.replace(/'/g, "\\'"); 
        if (trimmedTerm.startsWith("!")) {
          // If the term is excluded, add '!' before the term and wrap in quotes
          return `!'${cleanTerm.slice(1).trim()}'`;
        } else {
          // If the term is included, wrap the term in quotes
          return `'${cleanTerm}'`;
        }
      }).join(" & ");

      // Fetch articles with full-text search on title and abstract
      prismaPosts = await prisma.article.findMany({
        where: {
          AND: [
            {
              OR: [
                // Search for queryTerm in title and abstract
                { title: { search: queryTerms } },  
                { abstract: { search: queryTerms } }, 
              ],
            },
            {
              articleTopics: {  
                some: { 
                  // If there's a topicId, filter for articles in any topic
                  topicId: topicId ? { in: topicId } : undefined 
                }
              },
            },
          ],
          // Apply date filters if any
          ...dateFilter, 
        },
        orderBy: { 
          date: 'desc' 
        },
        skip,
        take,
      });

      // Count total articles for pagination
      totalArticles = await prisma.article.count({
        where: {
          AND: [
            {
              OR: [
                // Search for queryTerm in title and abstract
                { title: { search: queryTerms } },  
                { abstract: { search: queryTerms } },
              ],
            },
            {
              articleTopics: {  
                some: { 
                  // If there's a topicId, filter for articles in any topic
                  topicId: topicId ? { in: topicId } : undefined 
                },
              },
            },
          ],
          // Apply date filters if any
          ...dateFilter,
        },
      });
    }
    
    // Format articles with author names and related topics
    const posts = await Promise.all(
      prismaPosts.map(async (post: { articleId: number; title: any; slug: any; server: any; authorList: string; date: { toDateString: () => any; }; abstract: any; }) => {
      // Split authorList by semicolons and trim whitespace
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
    return NextResponse.json({status: 200,
      articles: posts,
      pagination: {
        currentPage: page,
        pageSize: limit,
        totalItems: totalArticles,
        totalPages: Math.ceil(totalArticles / limit),
      },
    });

  // Catch any errors that occur during the process
  } catch (error) {
    console.log("Error fetching posts:", error);
    return NextResponse.json(
      {
        error: "Error searching posts",
        articles: [],
      },
      { status: 500 },
    );
    }
}
