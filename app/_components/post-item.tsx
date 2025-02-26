import Link from "next/link";
import { PostType } from "types/posts";

export const PostItem = ({
  post,
  hideSummary = false,
}: {
  post: PostType;
  hideSummary?: boolean;
}) => {
  return (
    <Link
      className="hover block border-b border-b-black/20 pb-6 transition-opacity hover:opacity-50"
      href={`/article/${post.articleId}`}
      data-testid="post-item"
      data-categories={post.categories.join(",")}
    >
      {/* Publisher and date header */}
      <div className="flex items-center gap-4">
        <div className="rounded-full bg-stone-200 p-1.5 px-3.5 text-xs font-medium leading-none tracking-tight text-stone-700">
          {post.publisher}
        </div>

        <div className="text-xs font-medium opacity-60" data-testid="date">
          {post.date}
        </div>
      </div>

      <div className="flex items-start justify-between pt-5">
        <div className="flex-1">
          {/* Article title */}
          <div
            className="text-2xl font-semibold tracking-tighter"
            data-testid="title"
          >
            {post.title}
          </div>

          {/* Article summary - shown only if hideSummary is false */}
          {!hideSummary && (
            <div className="pt-2 text-sm text-stone-700">
              {post.summary.length > 400
                ? `${post.summary.slice(0, 400)}...`
                : post.summary}
            </div>
          )}

          {/* Authors list with special handling for 6+ authors */}
          <div className="flex flex-wrap items-center gap-2.5 pt-2 text-gray-500">
            <div className="flex flex-wrap items-center">
              {post.authors.map((author, index) => {
                // Show all authors if there are 5 or fewer
                if (post.authors.length <= 5) {
                  return (
                    <div key={index} className="flex items-center">
                      <div className="text-xs font-medium leading-none break-words">
                        {author}
                      </div>
                      {index < post.authors.length - 1 && (
                        <span className="mx-1 shrink-0">•</span>
                      )}
                    </div>
                  );
                }

                // For 6 or more authors:
                // Show first three authors and last author
                const isMiddleAuthor = index > 2 && index < post.authors.length - 1;
                const showEllipsis = isMiddleAuthor && index === 3;
                const isLastAuthor = index === post.authors.length - 1;
                
                if (isMiddleAuthor && !showEllipsis) return null;
                
                if (index < 3 || showEllipsis || isLastAuthor) {
                  return (
                    <div key={index} className="flex items-center">
                      <div className="text-xs font-medium leading-none break-words">
                        {author}
                      </div>
                      {/* Show bullet point if it's not the last visible item and not before ellipsis */}
                      {(index < 2 || (index === 2 && !showEllipsis)) && (
                        <span className="mx-1 shrink-0">•</span>
                      )}
                      {showEllipsis && post.authors.length > 5 && (
                        <span className="mx-1 shrink-0">...</span>
                      )}
                      {/* Show bullet point after ellipsis but not after the last author */}
                      {!isLastAuthor && showEllipsis && post.authors.length > 5 && (
                        <span className="mx-1 shrink-0">•</span>
                      )}
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
