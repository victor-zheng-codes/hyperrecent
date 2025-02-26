export interface PostType {
  articleId: string;
  title: string;
  slug: string;
  publisher: string;
  authors: string[];
  date: string;
  summary: string;
  publisherIconUrl: string;
  categories: string[];
  content?: string;
  abstract?: string;
}
