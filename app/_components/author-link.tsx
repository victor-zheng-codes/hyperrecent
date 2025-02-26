'use client';

interface AuthorLinkProps {
  author: string;
  className?: string;
}

export const AuthorLink = ({ author, className = '' }: AuthorLinkProps) => {
  // Constructs a Google Scholar search URL for the given author name
  const getGoogleScholarUrl = (authorName: string) => {
    const encodedName = encodeURIComponent(`author:"${authorName}"`);
    return `https://scholar.google.com/citations?view_op=search_authors&mauthors=${encodedName}&hl=en&oi=ao`;
  };

  // Prevents the click event from bubbling up to parent elements
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <a
      href={getGoogleScholarUrl(author)}
      target="_blank"
      rel="noopener noreferrer"
      className={`hover:text-gray-900 group relative ${className}`}
      onClick={handleClick}
    >
      {author}
      {/* Tooltip that appears on hover */}
      <span className="absolute invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity duration-200 delay-150 bg-gray-200 text-gray-600 text-xs font-medium rounded py-1 px-2 -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
        Open in Google Scholar
        {/* Tooltip arrow */}
        <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full border-4 border-transparent border-t-gray-200"></span>
      </span>
    </a>
  );
};