import { PostsController } from "app/_components/posts-controller";
import { getPosts } from "app/_lib/get-posts";
import { cookies } from "next/headers";
import { PostType } from "types/posts";
import { getTopics } from "app/_lib/topics";
import { UrlCleaner } from "app/_components/url-cleaner";

// export const revalidate = 0;
// export const cache = "no-store";

export default async function ArticlesPageSpecificTopic(props: {
  params: Promise<{ tid: string }>;
}) {
  const { tid } = await props.params;

  const usableTid = tid.includes('-')
    ? tid.replace(/-/g, ' ')  // Convert hyphens to spaces
    : decodeURIComponent(tid); // Decode URL-encoded spaces

  const topics = await getTopics();

  const topicFromTid = topics.find(
    (t) => t.label.toLowerCase() === usableTid.toLowerCase(),
  );

  const cookieStore = await cookies();
  const searchFiltersString = cookieStore.get("topicPreference")?.value || "";  // Parse cookie as a string
  const searchFilters = JSON.parse(searchFiltersString)

  if (!topicFromTid) {
    return (
      <section>
        <PostsController 
          posts={[]} 
          showTopics={false} 
          searchFilters={searchFilters} 
          paginationData={{
            currentPage: 1,
            pageSize: 0,
            totalItems: 0,
            totalPages: 1,
          }}/>
      </section>
    );
  }

  const res = await getPosts({
    keywordsIn: "",
    keywordsEx: "",
    page: 1,
    limit: 20,
    start: "",
    end: "",
    topic: [topicFromTid.value],
  }) || [];

  const posts = res.articles;
  const pageData = res.pagination;

  return (
    <>
      <UrlCleaner />
      <section>
        <PostsController
          posts={posts}
          showTopics={false}
          forcedTopic={topicFromTid}
          searchFilters={searchFilters}
          paginationData={pageData}
        />
      </section>
    </>
  );
}
