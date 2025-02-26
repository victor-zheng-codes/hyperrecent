import { NextResponse } from "next/server";
import prisma from '../../../../utils/prisma-client';

// Return author name for a given author ID
async function getAuthorName(identifier: number) {
  const prismaUserName = await prisma.author.findFirst({
    where: {
      authorId: identifier,
    },
  });
  // Return author name as a string
  let ret = prismaUserName?.firstName + " " + prismaUserName?.lastName;
  return ret;
}

// Return article title for a given article ID
async function getAllRelatedTopics(articleID: number) {
  const allArticles = await prisma.articleTopic.findMany({
    where: {
      articleId: articleID,
    },
    include: {
      topic: true,
    },
  });
  // Get all topic names from the articles
  const topicNames = allArticles.map((article: { topic: { name: any; }; }) => article.topic.name);
  return topicNames;
}

// Return all related subtopics for a given parent topic ID
async function getAllRelatedSubTopics(parentTopicId: number) {
  // Get all subtopics linked to the parent topic
  const subtopicsLinked = await prisma.subTopic.findMany({
    where: {
      parentTopicId,
    },
    // Include parent and child topics
    include: {
      parentTopic: true, 
      childTopic: true, 
    },
  });
  return subtopicsLinked;
}


export async function POST(request: Request) {
  // Default values for pagination
  let page = 1;
  let limit = 10;

  // Check if the request has a JSON content type and attempt to parse the body
  const fullUrl = request.url

  // Get the topic id from the URL
  const urlObject = new URL(fullUrl);
  const endpoint = urlObject.pathname;  
  let topicId = Number(endpoint.split('/').pop()!); 

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

  // Retrieve topic with the given topic id
  const topic = await prisma.topic.findUnique({
    where: {
      topicId: topicId,
    },
  });

  // Check if the topic exists
  if (!topic){
    return NextResponse.json({status: 404, message: `Topic with topic id ${topicId} does not exist.`})
  }

  // Get total count of articles for the given topic for pagination metadata
  const totalArticles = await prisma.articleTopic.count({
    where: {
      topicId: topicId,
    },
  });

  // Find articles with pagination
  const topics = await prisma.articleTopic.findMany({
    where: {
      topicId: topicId,
    },
    include: {
      article: true,
      topic: true
    },
    skip,
    take,
  });

  // Get all articles from the topics
  const articles = topics.map((art: { article: any; }) => art.article);

  // Get all posts from the articles
  const posts = await Promise.all(
    // Map through all articles and get the post details
    articles.map(async (post: { title: any; slug: any; server: any; firstAuthorId: number; lastAuthorId: number; date: { setDate: (arg0: number) => string | number | Date; getDate: () => number; }; abstract: any; articleId: number; }) => ({
      title: post.title,
      slug: post.slug,
      publisher: post.server,
      authors: [
        await getAuthorName(post.firstAuthorId),
        await getAuthorName(post.lastAuthorId),
      ],
      date: new Date(post.date.setDate(post.date.getDate() - 1)).toDateString(),
      summary: post.abstract,
      categories: await getAllRelatedTopics(post.articleId),
    }))
  );

  // Return paginated and formatted article data
  return NextResponse.json({status: 200, 
    topic,
    posts,
    pagination: {
      currentPage: page,
      pageSize: limit,
      totalItems: totalArticles,
      totalPages: Math.ceil(totalArticles / limit),
    },
    now: Date.now(),
  });
}
