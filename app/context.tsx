"use client";

import { createContext, ReactNode, useContext, useState } from "react";
import { PostType } from "types/posts";

// Define the types for the context state and functions
interface PostsContextType {
  posts: PostType[];
  setPosts: (posts: PostType[]) => void;
}

// Create the context with default undefined values
const PostsContext = createContext<PostsContextType | undefined>(undefined);

// Provider component props
interface PostsProviderProps {
  children: ReactNode;
}

// Create the provider component
export const PostsProvider = ({ children }: PostsProviderProps) => {
  const [posts, setPosts] = useState<PostType[]>([]);

  return (
    <PostsContext.Provider value={{ posts, setPosts }}>
      {children}
    </PostsContext.Provider>
  );
};

export const usePostsContext = () => {
  const context = useContext(PostsContext);
  if (!context) {
    throw new Error("usePostsContext must be used within a UserProvider");
  }
  return context;
};
