import { NextResponse } from "next/server";
import prisma from '../../../utils/prisma-client';

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
  const subtopicsLinked = await prisma.subTopic.findMany({
    where: {
      parentTopicId,
    },
    include: {
      // Include parent and child topics
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
  try {
    const body = await request.json();
    page = body.page ?? page;
    limit = body.limit ?? limit;
  } catch (error) {
    console.log("No JSON body found, using default pagination values.");
  }

  // Calculate skip and take for pagination
  const skip = (page - 1) * limit; 
  const take = limit;

  // Get total count of topics for pagination metadata
  const totalTopics = await prisma.topic.count();

  // Retrieve topics with pagination
  const topics = await prisma.topic.findMany({
    skip,
    take,
  });

  // Return the topics with pagination metadata
  return NextResponse.json({status: 200, 
    topics: topics,
    pagination: {
      currentPage: page,
      pageSize: limit,
      totalItems: totalTopics,
      totalPages: Math.ceil(totalTopics / limit)
    }
  });
}
