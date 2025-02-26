import { PostsController } from "app/_components/posts-controller";
import { getPosts } from "app/_lib/get-posts";
import { cookies } from "next/headers";
import { number } from "prop-types";
import { PostType } from "types/posts";

// export const revalidate = 0;
// export const cache = "no-store";

export default async function ArticlesPage() {
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
  } 
  else {
   searchFilters = JSON.parse(searchFiltersString) 
  }
  
  // const topics_str = topicPreference.split(",");
  // const topics = new Array();
  // for (let i = 0; i < topics_str.length; i++) {
  //   const topicID = parseInt(topics_str[i]);
  //   if (Number.isInteger(topicID)) {
  //     topics.push(topicID);
  //   }
  // }


  const res = (await getPosts(searchFilters)) || [];
  const posts = res.articles;
  const pageData = res.pagination;
  return (
    <>
      <section>
        <PostsController 
          posts={posts} 
          searchFilters={searchFilters} 
          paginationData={pageData}
          />
      </section>
    </>
  );
}
