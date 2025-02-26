import { Container } from "app/_components/layout/container";
import { LoadingSpinner } from "app/_components/loading-spinner";
import { SimilarPosts } from "app/_components/similiar-posts";
import { getTopics } from "app/_lib/topics";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { BsArrowUpLeft } from "react-icons/bs";
import { FaExternalLinkAlt } from "react-icons/fa";
import { Filters } from "types/filters";
import type { PostType } from "types/posts";
import { AuthorLink } from "app/_components/author-link";
import { cookies } from "next/headers";
export default async function ArticleSinglePage(props: {
  params: Promise<{ aid: string }>;
}) {
  const { aid } = await props.params;
  console.log("aid", aid);
  const cookieStore = await cookies();
  const searchFiltersString = cookieStore.get("topicPreference")?.value || ""; // Parse cookie as a string
  let searchFilters;
  if (searchFiltersString == "") {
    searchFilters = {
      keywordsIn: "",
      keywordsEx: "",
      topic: new Array(),
      page: 1,
      limit: 20,
      start: "",
      end: "",
    };
  } else {
    searchFilters = JSON.parse(searchFiltersString);
  }
  console.log("JSON: ", searchFilters);

  let article: PostType | null = null;
  let authors: String[] | null = null;
  let institution: String | null = null;
  let topic: Filters | null = null;
  let link: string | undefined = undefined;
  let topicId: number;
  let topicLabel: string = "Unknown";
  let backToArticles: string = "";
  let server: string | null = null;
  let date: Date | null = null;
  let version: number | null = null;
  let href = "/articles";

  try {
    const res = await fetch(`${process.env.dbUrl}/api/articles/${aid}`, {
      method: "POST",
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    console.log(data);
    article = data.article;

    if (!article) {
      return notFound();
    }

    const authorList = data.article.authorList || "";
    authors = authorList
      .split(";")
      .map((author: string) => author.trim())
      .filter(Boolean);
    institution = data.article.institution || "Unknown Institution";

    topicId = data.topic ? data.topic[0] : -1;
    topicLabel = data.topics[0];

    const topics = await getTopics();
    console.log("LABEL", topicLabel);
    const matchingTopic = topicLabel
      ? topics.find((t) => t.label === topicLabel)
      : null;
    server = data.article.server;
    date = new Date(data.article.date);
    version = data.article.version;

    if (matchingTopic) {
      topicId = matchingTopic.value;
    } else {
      topicId = -1;
    }
    console.log("TOPIC ID: ", matchingTopic);
    console.log("LABEL", topicLabel);
    topic =
      data.topics && data.topics.length > 0
        ? {
            topic: [topicId],
            keywordsIn: "",
            keywordsEx: "",
            start: "",
            end: "",
            page: 1,
            limit: 10,
          }
        : null;
    link = data.article.link
      ? data.article.server.includes("biorxiv")
        ? `https://www.biorxiv.org/content/${data.article.link}.full`
        : data.article.server.includes("medrxiv")
          ? `https://www.medrxiv.org/content/${data.article.link}.full`
          : "#"
      : "#";

    // console.log("Article authors:", authors);
    // console.log("Topic: ", topic);
    // console.log("Full Article Link:", link);

    if (searchFilters.topic.length === 1) {
      const temp = topics.find((t) => t.value === searchFilters.topic[0]);

      backToArticles = temp ? temp.label : "";
      href = `/articles/${backToArticles}`;
    }
  } catch (error) {
    console.error("Error fetching posts:", error);
  }

  if (!article) {
    return notFound();
  }

  const paragraphs = article?.abstract?.split("\n\n").map((para, index) => (
    <p key={index} className="mb-4">
      {para}
    </p>
  ));

  // Add helper function for ordinal
  const getOrdinal = (n: number) => {
    const s = ["th", "st", "nd", "rd"],
      v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  console.log(topic);

  return (
    <Container
      className="mx-auto ml-10 px-4 pt-20"
      data-testid="post-container"
    >
      {/* "Read Full Article" button */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="">
          <Link href={href}>
            <button className="flex items-center text-white">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-700">
                <BsArrowUpLeft className="h-3.5 w-3 text-white" />
              </div>
              <span className="ml-3 font-bold text-gray-700">
                Back to articles
              </span>
            </button>
          </Link>
        </div>
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center rounded border border-yellow-600 px-3 py-1.5 text-sm text-yellow-600 hover:bg-yellow-50"
        >
          Access Preprint From Server
          <FaExternalLinkAlt className="ml-1" />
        </a>
      </div>
      <div className="my-10 flex flex-wrap items-center justify-between gap-5 text-sm text-gray-600">
        <div className="flex flex-wrap gap-4">
          {date && (
            <div className="font-medium" data-testid="article-date">
              {date.toLocaleString("default", { month: "long" })}{" "}
              {getOrdinal(date.getDate())}, {date.getFullYear()}
            </div>
          )}
          {version !== null && (
            <div className="mr-10 text-gray-400" data-testid="article-version">
              Version: {version}
            </div>
          )}
        </div>

        {/* Server and Topic and Institution */}
        <div className="mb-2 flex flex-wrap items-center gap-2 text-sm text-gray-700">
          {institution && (
            <div
              className="leading-tightest inline-block rounded-md bg-gray-200 px-3 py-1 text-sm font-medium text-gray-600"
              data-testid="article-institution"
            >
              {institution}
            </div>
          )}
          <div
            className="inline-block rounded-md bg-amber-200 px-3 py-1 text-sm font-medium text-amber-700"
            data-testid="article-topic"
          >
            {topicLabel}
          </div>
          <div
            className="inline-block rounded-md bg-sky-200 px-3 py-1 text-sm font-medium text-sky-700"
            data-testid="article-server"
          >
            {server}
          </div>
        </div>
      </div>

      <h1
        className="text-3xl font-bold tracking-tight "
        data-testid="post-title"
      >
        {article.title}
      </h1>
      {/* Updated author list with Google Scholar links */}
      {authors && authors.length > 0 ? (
        <div
          className="mb-6 mt-6 flex flex-wrap items-center text-sm text-gray-500"
          data-testid="article-authors"
        >
          {authors.slice(0, 10).map((author, index) => (
            <span key={index} data-testid={`author-${index}`}>
              <AuthorLink author={author.toString()} />
              {index < Math.min(authors?.length || 0, 10) - 1 && (
                <span className="mx-1">•</span>
              )}
            </span>
          ))}
          {authors.length > 10 && (
            <span className="ml-1" data-testid="authors-et-al">
              et al.
            </span>
          )}
        </div>
      ) : null}

      <div className="mt-5">{paragraphs}</div>

      <div className="mt-20 border-t border-black/20 pt-20">
        <h2 className="mb-10 text-2xl font-semibold">Similar Papers</h2>

        <Suspense
          fallback={
            <div className="flex justify-center">
              <LoadingSpinner height={22} />
            </div>
          }
        >
          <SimilarPosts filters={topic || undefined} currentAid={aid} />
        </Suspense>
      </div>
    </Container>
  );
}
