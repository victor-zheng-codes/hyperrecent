import { getPosts } from "app/_lib/get-posts";
import { Filters } from "types/filters";

import { PostsList } from "./posts-list";

export const SimilarPosts = async ({
  filters,
  currentAid,
}: {
  filters?: Filters;
  currentAid: string;
}) => {
  let res = await getPosts(filters);
  let similarPosts = res.articles;
  // Exclude the current article
  similarPosts = similarPosts.filter((post: { articleId: string }) => {
    return post.articleId != currentAid;
  });

  return (
    <div>
      {similarPosts && similarPosts.length > 0 && (
        <div className="mt-4">
          <PostsList posts={similarPosts} hideSummary={false} />
        </div>
      )}
    </div>
  );
};
