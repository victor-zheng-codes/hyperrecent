"use client";

import { useEffect, useState } from "react";
import { Topic, getTopics } from "app/_lib/topics";
import { Filters } from "types/filters";
import { TopicButton } from "./topic-button";
import { LoadingSpinner } from "./loading-spinner";

export const TopicButtons = ({
  filters,
  onClick,
}: {
  filters: Filters;
  onClick: (filters: Filters) => void;
}) => {
  // State for topics and loading status
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch topics on component mount
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const fetchedTopics = await getTopics();
        setTopics(fetchedTopics);
      } catch (error) {
        console.error("Failed to fetch topics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopics();
  }, []);

  if (loading) {
    return <LoadingSpinner height={20} />;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {topics.map((topic) => (
        <TopicButton
          key={topic.value}
          active={filters.topic.includes(topic.value)}
          filters={filters}
          topic={topic}
          onClick={onClick}
        />
      ))}
    </div>
  );
};
