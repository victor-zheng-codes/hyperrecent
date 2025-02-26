import { PostType } from "types/posts";

import { PostItem } from "./post-item";

export const PostsList = ({
  posts,
  hideSummary = false,
}: {
  posts: PostType[];
  hideSummary?: boolean;
}) => {
  return (
    <div className="space-y-10 py-4">
      {/* Map through posts and render each PostItem */}
      {posts.map((post, i) => (
        <PostItem key={post.title + i} post={post} hideSummary={hideSummary} />
      ))}

      {/* Show message when no posts match the filters */}
      {posts.length === 0 && (
        <p>
          There are no posts for this filter search, please try adjusting your
          filters.
        </p>
      )}
    </div>
  );
};
